import { Reveal } from "./Section";
import { Spine } from "./Spine";
import "./Chapters.css";

function Chapter({ id, n, label, title, lead, children }) {
  return (
    <section className="ch" id={id} aria-labelledby={`${id}-h`}>
      <Reveal className="ch-head">
        <p className="ch-no"><b>{String(n).padStart(2, "0")}</b>{label}</p>
        <h2 id={`${id}-h`}>{title}</h2>
        {lead && <p className="ch-lead">{lead}</p>}
      </Reveal>
      {children}
    </section>
  );
}

/**
 * A page body made of numbered chapters with a spine beside them (see Spine.jsx).
 * `chapters` is [{ id, label, title, lead, body }]; `children` render after the last chapter.
 * `name` is what the chapters are about, shown at the top of the spine.
 * The page must sit inside a `.tint` element, which supplies the accent.
 */
export function Chapters({ name, chapters, children }) {
  return (
    <div className="container ch-layout">
      <Spine name={name} chapters={chapters} />
      <div className="ch-main">
        {chapters.map((c, n) => (
          <Chapter key={c.id} id={c.id} n={n + 1} label={c.label} title={c.title} lead={c.lead}>
            {c.body}
          </Chapter>
        ))}
        {children}
      </div>
    </div>
  );
}
