import { useTabs } from "../../hooks/useTabs";
import { Compare, Sources } from "./Figure";

/**
 * Faults drawn against the layers of a system: where each was seen, and where it was caused.
 * Choosing a fault redraws the trace between the two layers and shows the investigation.
 */
export function FaultTrace({ layers, faults }) {
  const { selected, getTabProps } = useTabs(faults.map((f) => f.id), undefined, undefined, true);
  const fault = faults.find((f) => f.id === selected);
  const at = (id) => layers.findIndex((l) => l.id === id);
  const from = at(fault.seen);
  const to = at(fault.cause);

  return (
    <div className="by-fault">
      <div className="by-picks" role="tablist" aria-label="Faults" aria-orientation="vertical">
        {faults.map((f, i) => (
          <button key={f.id} id={`ft-t-${f.id}`} aria-controls={`ft-p-${f.id}`} className="by-pick" {...getTabProps(f.id, i)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.title}
          </button>
        ))}
      </div>

      <div
        className="by-layers"
        role="img"
        aria-label={`Seen in the ${layers[from].label} layer, caused in the ${layers[to].label} layer.`}
        style={{ "--from": from, "--to": to }}
      >
        {/* Keyed so the trace redraws from the symptom towards the cause on every change. */}
        <i key={fault.id} className={`by-wire${to < from ? " is-up" : ""}`} />
        {layers.map((l, i) => (
          <div key={l.id} className={`by-layer${i === from ? " is-seen" : ""}${i === to ? " is-cause" : ""}`}>
            <b>{l.label}</b>
            <span>{l.sub}</span>
            {i === from && <em className="by-pin by-pin-seen">seen here</em>}
            {i === to && <em className="by-pin by-pin-cause">caused here</em>}
          </div>
        ))}
      </div>

      {faults.map((f) => (
        <div key={f.id} className="by-fault-detail" role="tabpanel" id={`ft-p-${f.id}`} aria-labelledby={`ft-t-${f.id}`} hidden={selected !== f.id}>
          <h3>{f.title}</h3>
          <dl className="by-facts">
            <div className="is-seen"><dt>Symptom</dt><dd>{f.symptom}</dd></div>
            <div className="is-cause"><dt>Cause</dt><dd>{f.why}</dd></div>
            {f.hid && <div><dt>Why it hid</dt><dd>{f.hid}</dd></div>}
            <div className="is-fix"><dt>Fix</dt><dd>{f.fix}</dd></div>
          </dl>
          {f.code && (
            <details className="by-more">
              <summary>Show the code</summary>
              <Compare code={f.code} />
            </details>
          )}
          <Sources items={f.sources} />
        </div>
      ))}
    </div>
  );
}
