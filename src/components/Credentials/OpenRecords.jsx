import { Link } from "react-router-dom";
import { open } from "../../data/credentials";
import { Reveal } from "../Section";

/** Everything on the record that has a start date and no end date. */
export function OpenRecords() {
  return (
    <>
      <Reveal as="ul" className="cr-open">
        {open.map((o, i) => (
          <li key={o.kind + o.title} style={{ "--i": i }}>
            <p className="cr-status is-open">{o.kind}</p>
            <div>
              <h3>{o.title}</h3>
              {o.detail && <p>{o.detail}</p>}
              {o.tags && <ul className="chips">{o.tags.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>}
              {o.links && (
                <ul className="chips">
                  {o.links.map((c) => (
                    <li key={c.id}>
                      <a className="chip" href={c.href} target="_blank" rel="noopener">{c.name} <span aria-hidden="true">↗</span></a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="cr-open-side">
              {o.since ? <span>since <b>{o.since}</b></span> : <span>ongoing</span>}
              {o.to && <Link className="lnk" to={o.to.path}>{o.to.label} <span aria-hidden="true">→</span></Link>}
            </p>
          </li>
        ))}
      </Reveal>
      <Reveal as="p" className="cr-loop">
        These are the stops on a loop, not a list. The loop itself is drawn on{" "}
        <Link to="/beyond#learning">Beyond code <span aria-hidden="true">→</span></Link>
      </Reveal>
    </>
  );
}
