// Renders page one of the resume PDF to public/resume-preview.avif (and .webp, as the fallback), and records
// what the file says about itself (pages, size, last-modified date) in src/data/resume.json. Runs before each build.
// It does nothing while the PDF is unchanged, and on any failure it keeps the committed files.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { profile } from "../src/data/profile.js";

const WIDTH = 960; // Shown at up to 440 CSS px wide, so this covers 2x screens.
const PREVIEW = { avif: "/resume-preview.avif", webp: "/resume-preview.webp" };
const OUT = new URL("../src/data/resume.json", import.meta.url);
const inPublic = (path) => fileURLToPath(new URL(`../public${path}`, import.meta.url));

const bytes = await readFile(inPublic(profile.resume));
const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
const previous = await readFile(OUT, "utf8").then(JSON.parse, () => null);
const previewExists = await Promise.all(Object.values(PREVIEW).map((p) => readFile(inPublic(p)))).then(() => true, () => false);

// "D:20260926150204Z" → "2026-09-26"
const pdfDate = (s) => /^D:(\d{4})(\d{2})(\d{2})/.exec(s ?? "")?.slice(1).join("-") ?? null;

if (previous?.hash === hash && previewExists) {
  console.log("resume preview is current");
} else {
  try {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const assets = dirname(createRequire(import.meta.url).resolve("pdfjs-dist/package.json"));
    const dir = (name) => `${pathToFileURL(join(assets, name)).href}/`;
    const pdf = await getDocument({ data: new Uint8Array(bytes), standardFontDataUrl: dir("standard_fonts"), cMapUrl: dir("cmaps"), cMapPacked: true }).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: WIDTH / page.getViewport({ scale: 1 }).width });
    const { canvas, context } = pdf.canvasFactory.create(Math.round(viewport.width), Math.round(viewport.height));
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;
    await writeFile(inPublic(PREVIEW.avif), await canvas.encode("avif", { quality: 60 }));
    await writeFile(inPublic(PREVIEW.webp), await canvas.encode("webp", 70));

    const { info } = await pdf.getMetadata();
    const data = {
      hash,
      pages: pdf.numPages,
      bytes: bytes.length,
      modified: pdfDate(info.ModDate) ?? pdfDate(info.CreationDate),
      preview: PREVIEW,
      width: canvas.width,
      height: canvas.height,
    };
    await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
    console.log(`resume preview rendered: ${data.pages} page(s), ${canvas.width}×${canvas.height}`);
  } catch (err) {
    if (!previous || !previewExists) throw err; // No fallback at all.
    console.warn(`resume preview kept as-is (${err.message})`);
  }
}
