import { Link } from "react-router-dom";
import { CodeBlock } from "../CodeBlock";
import { Reveal } from "../Section";

/** Where a claim comes from. Repository files open on GitHub; pages on this site route internally. */
export function Sources({ items }) {
  return (
    <p className="by-src">
      <span>Source</span>
      {items.map((s) =>
        s.to ? (
          <Link key={s.label} to={s.to}>{s.label}</Link>
        ) : (
          <a key={s.label} href={s.href} target="_blank" rel="noopener">
            {s.label} <span aria-hidden="true">↗</span>
          </a>
        )
      )}
    </p>
  );
}

/** The notebook frame every diagram on /beyond sits in: a figure number, a title, and what it holds. */
export function Figure({ n, title, meta, children }) {
  return (
    <Reveal as="figure" className="by-fig">
      <figcaption>
        <span>Fig. {String(n).padStart(2, "0")}</span>
        <b>{title}</b>
        {meta && <span>{meta}</span>}
      </figcaption>
      {children}
    </Reveal>
  );
}

/** Code as evidence: an optional "before", the version in the repository, and why the difference matters. */
export function Compare({ code }) {
  return (
    <div className="by-compare">
      <div className={code.before ? "by-compare-pair" : undefined}>
        {code.before && <CodeBlock code={code.before} />}
        <CodeBlock code={code.after ?? code.excerpt} />
      </div>
      <p className="by-why">
        <b>Why this matters</b>
        {code.why}
      </p>
    </div>
  );
}
