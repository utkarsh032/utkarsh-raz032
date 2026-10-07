import { useState } from "react";
import { Link } from "react-router-dom";
import { Compare } from "./Figure";
import { RingMap } from "./RingMap";

/** One piece of evidence, linked to where it can be checked when there is somewhere to link. */
function Evidence({ item: e }) {
  return (
    <li>
      <span>
        {e.text}
        {e.to && <Link to={e.to}> See it →</Link>}
        {e.href?.startsWith("#") && <a href={e.href}> On this page ↓</a>}
        {e.href && !e.href.startsWith("#") && <a href={e.href} target="_blank" rel="noopener"> In the repository ↗</a>}
        {e.source && <em>{e.source}</em>}
      </span>
    </li>
  );
}

/**
 * Principles as a graph: each rule is a node sized by how much evidence sits behind it,
 * and selecting one draws the links to the rules it leans on.
 */
export function PrincipleGraph({ principles }) {
  const [active, setActive] = useState(principles[0].id);
  const byId = Object.fromEntries(principles.map((p) => [p.id, p]));

  return (
    <div className="by-graph">
      <RingMap
        label="Principles"
        hub={<>how I<br />work</>}
        items={principles.map((p) => ({ id: p.id, label: p.short, weight: p.evidence.length, badge: p.evidence.length }))}
        chords={byId[active].related.map((id) => [active, id])}
        active={active}
        onSelect={setActive}
      />
      <div className="by-detail" aria-live="polite">
        {principles.map((p) => (
          <div key={p.id} hidden={p.id !== active}>
            <h3>{p.title}</h3>
            <p className="by-rule">{p.rule}</p>
            <p className="label">Where it comes from</p>
            <ul className="by-evidence">{p.evidence.map((e) => <Evidence key={e.text} item={e} />)}</ul>
            <p className="label">Leans on</p>
            <p className="by-related">
              {p.related.map((id) => (
                <button key={id} type="button" className="chip" onClick={() => setActive(id)}>{byId[id].title}</button>
              ))}
            </p>
            {p.code && (
              <details className="by-more">
                <summary>Show the code</summary>
                <Compare code={p.code} />
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
