// The record behind /credentials, in one shape. Nothing is written here: every entry is derived from
// experience.js (education, certifications, roles), profile.js (the resume), stack.js (where a skill is used),
// channels.js, projects.js, github.json and resume.json (facts read from the PDF by scripts/resume-preview.mjs).
//
// A credential is { id, type, title, issuer, status, doc, ... }:
//   type    "resume" | "education" | "certificate"
//   status  only what the data can back. Education with no end date is "In progress", with one it is
//           "Completed"; a certificate with a file is "Document on file". Nothing is marked verified.
//   doc     what the document viewer needs (utils/docs.js), when there is a file to open
import github from "./github.json";
import file from "./resume.json";
import { liveChannels } from "./channels";
import { certifications, education, roles } from "./experience";
import { profile, resumeDoc } from "./profile";
import { projects } from "./projects";
import { layers } from "./stack";
import { toDoc } from "../utils/docs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Dates are written out by hand so the prerendered page and every browser print the same text.
const longDate = (iso) => `${Number(iso.slice(8, 10))} ${MONTHS[iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;
const monthYear = (iso) => `${MONTHS[iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** "Nov 2025 — Present" → "Nov 2025" */
const startOf = (period) => period.split(/\s+[—–-]\s+/)[0];

export const resume = {
  id: "resume",
  type: "resume",
  title: profile.name,
  file: profile.resume.split("/").pop(),
  href: profile.resume,
  doc: toDoc(resumeDoc),
  pages: file.pages,
  size: `${Math.round(file.bytes / 1024)} KB`,
  modified: file.modified ? longDate(file.modified) : null,
  preview: { ...file.preview, width: file.width, height: file.height },
};

/** Education in the order it happened, oldest first. */
export const programmes = [...education]
  .sort((a, b) => a.year - b.year)
  .map((e) => {
    const [issuer, place] = e.where.split(" · ");
    return {
      id: slug(e.title),
      type: "education",
      title: e.title,
      issuer,
      place: place ?? null,
      level: e.level,
      year: e.year,
      ongoing: Boolean(e.ongoing),
      status: e.ongoing ? "In progress" : "Completed",
      date: e.ongoing ? `since ${e.year}` : e.when,
      doc: e.href ? toDoc({ title: e.title, href: e.href, meta: e.where }) : null,
    };
  });

const tools = new Map(layers.flatMap((l) => l.items.map((t) => [t.name, t])));
const usedIn = (names = []) =>
  names.map((name) => {
    // A typo would quietly drop the evidence from the page, so it stops the build instead.
    if (!tools.has(name)) throw new Error(`experience.js: "${name}" is not a tool in data/stack.js`);
    return tools.get(name);
  });

/** Certificates with a file first, keeping file order otherwise. */
export const certificates = certifications
  .map((c) => ({
    id: slug(c.title),
    type: "certificate",
    title: c.title,
    issuer: c.by ?? null,
    length: c.length ?? null,
    status: c.href ? "Document on file" : null,
    usedIn: usedIn(c.stack),
    doc: c.href ? toDoc({ title: c.title, href: c.href, meta: c.by }) : null,
  }))
  .sort((a, b) => !a.doc - !b.doc);

const docsOf = (list) => list.filter((c) => c.doc).map((c) => c.doc);
/** Documents the viewer pages through as one set. */
export const docSets = { education: docsOf(programmes), certifications: docsOf(certificates) };
export const documentCount = 1 + docSets.education.length + docSets.certifications.length;

const current = roles.filter((r) => r.current);
const flagship = projects.find((p) => p.name === github.flagship.name);
const practice = liveChannels.filter((c) => c.category === "Practice");

/** Entries with no end date: the part of the record that is still being added to. */
export const open = [
  ...programmes
    .filter((p) => p.ongoing)
    .map((p) => ({ kind: "Study", title: p.title, detail: [p.issuer, p.place].filter(Boolean).join(" · "), since: String(p.year) })),
  ...current.map((r) => ({
    kind: "Work",
    title: `${r.title} at ${r.org}`,
    detail: r.place,
    since: startOf(r.period),
    tags: r.tags,
    to: { label: "Experience", path: "/#experience" },
  })),
  flagship && {
    kind: "Build",
    title: flagship.name,
    detail: `${flagship.tagline}. ${github.flagship.commits} commits so far.`,
    since: github.flagship.created ? monthYear(github.flagship.created) : null,
    to: { label: "Case study", path: `/projects/${flagship.slug}` },
  },
  practice.length > 0 && {
    kind: "Practice",
    title: "Data structures and algorithms",
    detail: "Kept up as a habit, so the fundamentals stay sharp.",
    links: practice,
  },
].filter(Boolean);

const allTools = [...tools.values()];

/** How the record connects to the rest of the site. Each link is a page, with its own count. */
export const chain = [
  { value: programmes.length, label: "Programmes studied", href: "#education" },
  { value: certificates.length, label: "Certificates earned", href: "#certifications" },
  { value: allTools.length, label: "Tools in the stack", note: `${allTools.filter((t) => t.prod).length} used in production`, to: "/#stack" },
  { value: projects.length, label: "Projects built", to: "/projects" },
  ...current.slice(0, 1).map((r) => ({ value: startOf(r.period), label: "In production since", note: r.org, to: "/#experience" })),
];
