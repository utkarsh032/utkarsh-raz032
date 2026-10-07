import { layerNames, layerOrder } from "../../data/projects";
import { useLive } from "../../hooks/motion";
import { Flow } from "../ProjectBits";
import "./Signature.css";

// Each view is a schematic of the project itself, drawn from the same facts as the rest of the page.
// They are pictures: the text alternative lives in `look.alt`.

/** The same wireframe document, rendered once per runtime. */
function Doc() {
  return (
    <div className="ws-doc">
      <i className="ws-side" />
      <div className="ws-page">
        <i className="ws-tabs" />
        <b />
        <i className="ws-l" />
        <i className="ws-l" />
        <i className="ws-l ws-type" />
      </div>
    </div>
  );
}

function Workspace({ look }) {
  return (
    <div className="ws">
      <div className="ws-frames">
        {look.runtimes.map((r) => (
          <div key={r.name} className={`ws-f ws-${r.frame}`}>
            <div className="ws-chrome"><i /><i /><i /><span>{r.name}</span></div>
            <Doc />
            <p className="ws-store"><span className="ws-ok">saved</span>{r.store}</p>
          </div>
        ))}
      </div>
      <ol className="ws-path">
        {look.path.map((s) => (
          <li key={s.name}><b>{s.name}</b><span>{s.label}</span></li>
        ))}
      </ol>
    </div>
  );
}

const ROWS = 6;

/** Six routes spread across the whole API, so every router is represented. */
function sampleRoutes({ base, groups }) {
  const all = groups.flatMap((g) => g.endpoints.map(([m, path]) => [m, `${base}${g.prefix}${path === "/" ? "" : path}`, g.name]));
  const n = Math.min(ROWS, all.length);
  return Array.from({ length: n }, (_, i) => all[Math.floor((i * all.length) / n)]);
}

function ApiLog({ project: p, look }) {
  const rows = look.rows ?? sampleRoutes(p.api);
  return (
    <div className="al">
      <ol className="al-rows">
        {rows.map(([m, path, note], i) => (
          <li key={m + path} style={{ "--i": i }}>
            <span className={`http http-${m.toLowerCase()}`}>{m}</span>
            <code>{path}</code>
            <em>{note}</em>
          </li>
        ))}
      </ol>
      <ol className="al-stages">
        {p.flow.map((f, i) => (
          <li key={f.label} className={`L-${f.tone}`} style={{ animationDelay: `${((i * 1.6) / p.flow.length).toFixed(2)}s` }}>
            {f.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

const CELLS = 18;

function Strata({ look }) {
  return (
    <div className="st">
      <div className="st-src">
        {look.sources.map((s) => (
          <p key={s.name}><b>{s.name}</b><span>{s.note}</span></p>
        ))}
      </div>
      <i className="st-join" />
      {look.layers.map((l, i) => (
        <div key={l.name} className={`st-layer st-${l.name}`} style={{ "--i": i }}>
          <p><b>{l.name}</b><span>{l.note}</span></p>
          <div className="st-cells">{Array.from({ length: CELLS }, (_, k) => <i key={k} />)}</div>
        </div>
      ))}
    </div>
  );
}

function Board({ look }) {
  // Resting cards per column; one more card travels across the board.
  const resting = [2, 1, 1];
  return (
    <div className="bd">
      {look.columns.map((c, i) => (
        <div className="bd-col" key={c}>
          <b>{c}</b>
          {Array.from({ length: resting[i] ?? 1 }, (_, k) => <i className="bd-card" key={k} />)}
        </div>
      ))}
      <i className="bd-card bd-drag" />
    </div>
  );
}

function Graph({ look }) {
  return (
    <div className="gq">
      <pre className="gq-q"><code>{look.query}</code></pre>
      <div className="gq-out">
        {look.bars.map((b, i) => (
          <p key={b} style={{ "--i": i }}><i /><span>{b}</span></p>
        ))}
      </div>
    </div>
  );
}

function Frames({ look }) {
  return (
    <div className="fr">
      {look.frames.map((f, i) => (
        <div key={f.name} className="fr-f" style={{ "--cols": f.cols, "--i": i }}>
          <div className="fr-screen">
            <i className="fr-nav" />
            <i className="fr-hero" />
            <div className="fr-grid">{Array.from({ length: 6 }, (_, k) => <i key={k} />)}</div>
          </div>
          <p><b>{f.name}</b><span>{f.note}</span></p>
        </div>
      ))}
    </div>
  );
}

/** Fallback: the project's request path, or its stack by layer when it has no flow. */
function Path({ project: p }) {
  const steps =
    p.flow ?? layerOrder.filter((l) => p.stack[l]?.length).map((l) => ({ label: layerNames[l], sub: p.stack[l].join(" · "), tone: l }));
  return <Flow steps={steps} />;
}

const views = { workspace: Workspace, api: ApiLog, strata: Strata, board: Board, graph: Graph, frames: Frames, path: Path };

/** The hero visual, chosen by `project.look.kind`. Loops pause while it is off screen. */
export function Signature({ project }) {
  const { look } = project;
  const ref = useLive();
  const View = views[look.kind];
  return (
    <figure className={`sig sig-${look.kind}`} ref={ref}>
      <figcaption className="sig-bar">
        <span className="sig-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sig-title">{look.caption}</span>
        <span className="sig-tag">schematic</span>
      </figcaption>
      <div className="sig-body" role="img" aria-label={look.alt}>
        <View project={project} look={look} />
      </div>
    </figure>
  );
}
