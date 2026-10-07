import { Link } from "react-router-dom";
import { programmes } from "../../data/credentials";
import { roles } from "../../data/experience";
import { ViewLink } from "../CredentialBits";
import { Reveal } from "../Section";

// Oldest first, to read in the same direction as the timeline.
const work = [...roles].reverse();

/**
 * Formal study on one line, oldest first. The line draws itself when it scrolls into view,
 * and runs on, dashed, past any programme that has no end date.
 */
export function EducationTimeline() {
  return (
    <>
      <Reveal className="cr-tl">
        <ol style={{ "--n": programmes.length }}>
          {programmes.map((p, i) => (
            <li key={p.id} className={`cr-tl-item${p.ongoing ? " is-open" : ""}`} style={{ "--i": i }}>
              <p className="cr-tl-year">{p.year}{p.ongoing && <span>→ now</span>}</p>
              <i className="cr-tl-node" aria-hidden="true" />
              <div className="cr-tl-card">
                <p className="cr-tl-level">{p.level}</p>
                <h3>{p.title}</h3>
                <p className="cr-tl-where">{p.issuer}{p.place && <span> · {p.place}</span>}</p>
                <p className="cr-tl-foot">
                  <span className={`cr-status ${p.ongoing ? "is-open" : "is-done"}`}>{p.status}</span>
                  <span>{p.date}</span>
                  {p.doc && <ViewLink set="education" href={p.doc.href} title={`${p.title} certificate`} />}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      {work.length > 0 && (
        <Reveal className="cr-meanwhile">
          <p className="label">Meanwhile, at work</p>
          <ul>
            {work.map((r) => (
              <li key={r.org}>{r.title}, {r.org}<small>{r.period}</small></li>
            ))}
          </ul>
          <Link className="lnk" to="/#experience">Experience <span aria-hidden="true">→</span></Link>
        </Reveal>
      )}
    </>
  );
}
