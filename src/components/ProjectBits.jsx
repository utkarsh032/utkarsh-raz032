import { layerNames } from "../data/projects";
import "./ProjectBits.css";

const stripLayers = ["ui", "api", "data"];

/** Three segments showing which layers of a request the project touches. */
export function LayerStrip({ stack, labelled = false }) {
  const used = stripLayers.filter((l) => stack[l]?.length);
  return (
    <div className="lstrip" role="img" aria-label={`Layers: ${used.map((l) => layerNames[l]).join(", ")}`}>
      {stripLayers.map((l) => (
        <span key={l} className={`lstrip-seg s-${l}${stack[l]?.length ? " on" : ""}`}>
          {labelled && <em>{l}</em>}
        </span>
      ))}
    </div>
  );
}

/** A request or data path drawn as a vertical pipeline. */
export function Flow({ steps, label }) {
  return (
    <ol className="pflow" aria-label={label}>
      {steps.map((f) => (
        <li key={f.label} className={`pflow-${f.tone}`}>
          <span className="pflow-node" aria-hidden="true" />
          <b>{f.label}</b>
          {f.sub && <small>{f.sub}</small>}
        </li>
      ))}
    </ol>
  );
}
