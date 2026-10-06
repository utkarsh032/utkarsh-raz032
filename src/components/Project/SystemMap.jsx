import { useEffect, useState } from "react";
import { layerNames } from "../../data/projects";
import { Icon } from "../Icon";
import "./SystemMap.css";

const STEP_MS = 1700;

// Wires are drawn in grid units (columns × rows) and stretched over the node grid.
const centre = (n) => [n.at[0] + (n.span ?? 1) / 2, n.at[1] + 0.5];
function wire(a, b) {
  const [x1, y1] = centre(a);
  const [x2, y2] = centre(b);
  if (x1 === x2) return `M${x1} ${y1}V${y2}`;
  if (y1 === y2) return `M${x1} ${y1}H${x2}`;
  return `M${x1} ${y1}V${(y1 + y2) / 2}H${x2}V${y2}`;
}

function Detail({ node, into, out, stack }) {
  const tech = node.tech ?? stack?.[node.layer];
  return (
    <>
      <p className={`sm-layer L-${node.layer}`}>
        {node.tag ?? layerNames[node.layer]}
        {node.soon && <span className="sm-soon">not wired yet</span>}
      </p>
      <h3>{node.label}</h3>
      {node.sub && <p className="sm-sub">{node.sub}</p>}
      {node.does && <p className="sm-does">{node.does}</p>}
      {tech && (
        <ul className="chips" aria-label={node.tech ? "Technologies" : `${layerNames[node.layer]} stack`}>
          {tech.map((t) => <li className="chip" key={t}>{t}</li>)}
        </ul>
      )}
      <dl className="sm-io">
        {into.length > 0 && <div><dt>Receives from</dt><dd>{into.join(" · ")}</dd></div>}
        {out.length > 0 && <div><dt>Hands off to</dt><dd>{out.join(" · ")}</dd></div>}
      </dl>
    </>
  );
}

/**
 * Interactive architecture map. Hover or focus previews a component, click pins it, and a trace
 * walks one request through the system step by step. On narrow screens the grid becomes a list
 * and the details open under the selected component.
 */
export function SystemMap({ system, stack }) {
  const { nodes, edges, cols = 1, traces = [] } = system;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const rows = Math.max(...nodes.map((n) => n.at[1])) + 1;
  const [pinned, setPinned] = useState(nodes[0].id);
  const [hover, setHover] = useState(null);
  const [run, setRun] = useState(null); // { trace, step, playing } while a trace is on screen

  useEffect(() => {
    if (!run?.playing) return;
    const last = traces[run.trace].steps.length - 1;
    const t = setTimeout(
      () => setRun((r) => r && { ...r, step: Math.min(r.step + 1, last), playing: r.step + 1 < last }),
      STEP_MS
    );
    return () => clearTimeout(t);
  }, [run, traces]);

  const steps = run ? traces[run.trace].steps : null;
  const step = steps?.[run.step];
  const activeId = step ? step.node : hover ?? pinned;
  const cameFrom = run?.step > 0 ? steps[run.step - 1].node : null;
  const visited = new Set(steps?.slice(0, run.step).map((s) => s.node));
  const touches = (e, id) => e.from === id || e.to === id;
  const wireOn = (e) => (step ? Boolean(cameFrom) && touches(e, cameFrom) && touches(e, activeId) : touches(e, activeId));
  const near = new Set(edges.filter(wireOn).flatMap((e) => [e.from, e.to]));

  const toggle = (i) => {
    if (run?.trace !== i) return setRun({ trace: i, step: 0, playing: true });
    if (run.playing) return setRun({ ...run, playing: false });
    const done = run.step >= traces[i].steps.length - 1;
    setRun({ trace: i, step: done ? 0 : run.step, playing: true });
  };
  const pick = (id) => {
    setRun(null);
    setPinned(id);
  };

  const detail = (
    <>
      {step && (
        <p className="sm-stepnote">
          <b>{run.step + 1} / {steps.length}</b>
          {step.note ?? traces[run.trace].label}
        </p>
      )}
      <Detail
        node={byId[activeId]}
        stack={stack}
        into={edges.filter((e) => e.to === activeId).map((e) => byId[e.from].label)}
        out={edges.filter((e) => e.from === activeId).map((e) => byId[e.to].label)}
      />
    </>
  );

  return (
    <div className={`sm${cols === 1 ? " sm-chain" : ""}`}>
      <div className="sm-stage">
        {traces.length > 0 && (
          <div className="sm-trace">
            <span className="label">Trace</span>
            {traces.map((t, i) => {
              const playing = run?.trace === i && run.playing;
              return (
                <button key={t.label} type="button" className="sm-play" aria-pressed={run?.trace === i} onClick={() => toggle(i)}>
                  <Icon name={playing ? "pause" : "play"} size={12} />
                  {t.label}
                </button>
              );
            })}
            {run && (
              <ol className="sm-steps" aria-label="Trace steps">
                {steps.map((s, k) => (
                  <li key={k}>
                    <button
                      type="button"
                      aria-current={k === run.step ? "step" : undefined}
                      aria-label={`Step ${k + 1}: ${byId[s.node].label}`}
                      onClick={() => setRun({ ...run, step: k, playing: false })}
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <p className="sr-only">{system.desc}</p>
        <div className="sm-grid" style={{ "--cols": cols }}>
          <svg className="sm-wires" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" aria-hidden="true">
            {edges.map((e) => (
              <path key={e.from + e.to} d={wire(byId[e.from], byId[e.to])} className={wireOn(e) ? "on" : undefined} />
            ))}
          </svg>
          {nodes.map((n) => {
            const on = n.id === activeId;
            const state = on ? " is-on" : near.has(n.id) || visited.has(n.id) ? " is-near" : "";
            return (
              <div
                key={n.id}
                className="sm-cell"
                style={{ gridColumn: `${n.at[0] + 1} / span ${n.span ?? 1}`, gridRow: n.at[1] + 1 }}
              >
                <button
                  type="button"
                  className={`sm-node L-${n.layer}${state}${n.span ? " is-wide" : ""}${n.soon ? " is-soon" : ""}`}
                  aria-pressed={on}
                  onClick={() => pick(n.id)}
                  onMouseEnter={() => !run && setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => !run && setHover(n.id)}
                  onBlur={() => setHover(null)}
                >
                  <b>{n.label}</b>
                  {n.sub && <small>{n.sub}</small>}
                </button>
                {on && <div className="sm-inline">{detail}</div>}
              </div>
            );
          })}
        </div>
        {system.footnote && <p className="sm-foot">{system.footnote}</p>}
      </div>

      <div className="sm-inspect" aria-live="polite">{detail}</div>
    </div>
  );
}
