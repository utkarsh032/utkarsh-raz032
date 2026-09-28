// Writes a fully rendered HTML file for every route, plus sitemap.xml and robots.txt.
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const ssrDir = fileURLToPath(new URL("../dist-ssr/", import.meta.url));
const { render, routes, profile } = await import(new URL("../dist-ssr/entry-server.js", import.meta.url));

const template = await readFile(`${dist}index.html`, "utf8");
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html is missing the <!--seo:start/end--> block or an empty #root");
}

const fileFor = (route) => (route === "/" ? "index.html" : route === "/404" ? "404.html" : `${route.slice(1)}/index.html`);

for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  const page = template.replace(SEO_BLOCK, head).replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const out = `${dist}${fileFor(route)}`;
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page);
  console.log(`  prerendered ${route.padEnd(36)} → ${fileFor(route)} (${Math.round(page.length / 1024)} KB)`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${profile.siteUrl}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><priority>${r === "/" ? "1.0" : r === "/projects" ? "0.9" : "0.7"}</priority></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(`${dist}sitemap.xml`, sitemap);
await writeFile(`${dist}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${profile.siteUrl}/sitemap.xml\n`);
console.log(`  sitemap.xml (${routes.length} URLs) and robots.txt written`);

await rm(ssrDir, { recursive: true, force: true });
