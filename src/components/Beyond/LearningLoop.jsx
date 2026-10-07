import { useState } from "react";
import { Link } from "react-router-dom";
import { liveChannels } from "../../data/channels";
import { RingMap } from "./RingMap";

/** Learning as a loop. Each step says what it is and points to where it happens. */
export function LearningLoop({ steps }) {
  const [active, setActive] = useState(steps[0].id);
  const next = steps[(steps.findIndex((s) => s.id === active) + 1) % steps.length];

  return (
    <div className="by-graph">
      <RingMap loop label="The learning loop" hub="repeat" items={steps} active={active} onSelect={setActive} />
      <div className="by-detail" aria-live="polite">
        {steps.map((s, i) => {
          const where = liveChannels.filter((c) => s.categories?.includes(c.category));
          return (
            <div key={s.id} hidden={s.id !== active}>
              <p className="by-stage-no">Step {i + 1} of {steps.length}</p>
              <h3>{s.label}</h3>
              <p className="by-rule">{s.text}</p>
              {s.to && <Link className="lnk" to={s.to.path}>{s.to.label} <span aria-hidden="true">→</span></Link>}
              {where.length > 0 && (
                <>
                  <p className="label">Where</p>
                  <ul className="chips">
                    {where.map((c) => (
                      <li key={c.id}>
                        <a className="chip" href={c.href} target="_blank" rel="noopener">{c.name} <span aria-hidden="true">↗</span></a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        })}
        <button type="button" className="btn btn-ghost btn-sm by-next" onClick={() => setActive(next.id)}>
          Next: {next.label} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
