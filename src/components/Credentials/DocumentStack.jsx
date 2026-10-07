import { certificates, programmes, resume } from "../../data/credentials";
import { profile } from "../../data/profile";

// What each sheet holds, drawn small from the same data as its chapter.
// They are pictures: the sheet's label and footer say the same thing in words.

// Line widths of the resume sketch; `true` marks a section heading.
const LINES = [[34, true], [100], [92], [64], [28, true], [100], [84], [96], [48]];

function ResumeMini() {
  return (
    <div className="cr-mini cr-mini-resume">
      <b>{resume.title}</b>
      <span>{profile.role}</span>
      {LINES.map(([width, heading], i) => (
        <i key={i} className={heading ? "is-heading" : undefined} style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

function EducationMini() {
  return (
    <ol className="cr-mini cr-mini-edu">
      {programmes.map((p) => (
        <li key={p.id} className={p.ongoing ? "is-open" : undefined}>
          <b>{p.year}</b>
          <span>{p.level}</span>
        </li>
      ))}
    </ol>
  );
}

function CertificatesMini() {
  return (
    <ul className="cr-mini cr-mini-certs">
      {certificates.map((c) => (
        <li key={c.id} className={c.doc ? "is-filed" : undefined}><span>{c.title}</span></li>
      ))}
    </ul>
  );
}

const first = programmes[0];
const last = programmes[programmes.length - 1];
const filed = certificates.filter((c) => c.doc).length;

// One sheet per chapter, in chapter order.
const sheets = [
  { id: "resume", label: "Resume", meta: `PDF · ${resume.pages} page${resume.pages === 1 ? "" : "s"}`, Mini: ResumeMini },
  { id: "education", label: "Education", meta: `${first.year} to ${last.ongoing ? "now" : last.year}`, Mini: EducationMini },
  { id: "certifications", label: "Certifications", meta: `${filed} of ${certificates.length} with a document`, Mini: CertificatesMini },
];

/**
 * The hero diagram: the record as a fan of three sheets.
 * It doubles as the table of contents, so every sheet is a link to its chapter.
 */
export function DocumentStack() {
  return (
    <ol className="cr-stack" aria-label="What this page holds">
      {sheets.map(({ id, label, meta, Mini }, i) => (
        <li key={id} style={{ "--i": i }}>
          <a className="cr-sheet" href={`#${id}`}>
            <div className="cr-sheet-head">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{label}</b>
              <i aria-hidden="true">↓</i>
            </div>
            <div className="cr-sheet-body" aria-hidden="true"><Mini /></div>
            <p className="cr-sheet-meta">{meta}</p>
          </a>
        </li>
      ))}
    </ol>
  );
}
