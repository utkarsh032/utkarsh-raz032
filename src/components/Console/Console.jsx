import { useState } from "react";
import { useTabs } from "../../hooks/useTabs";
import { TraceView } from "./TraceView";
import { Terminal } from "./Terminal";
import { ReleasePipeline } from "./ReleasePipeline";
import "./Console.css";

const views = [
  { key: "trace", label: "trace", View: TraceView, foot: "sample trace · illustrative timings" },
  { key: "terminal", label: "terminal", View: Terminal, foot: "live facts · github + resume" },
  { key: "release", label: "release", View: ReleasePipeline, foot: "noto-release.ps1 gates" },
];

export function Console() {
  // Remember which tabs have been opened so the terminal only types once.
  const [seen, setSeen] = useState(() => new Set(["trace"]));
  const { selected, getTabProps } = useTabs(
    views.map((v) => v.key),
    "trace",
    (key) => setSeen((s) => (s.has(key) ? s : new Set(s).add(key)))
  );
  const current = views.find((v) => v.key === selected);

  return (
    <div className="console" role="group" aria-label="Engineering console">
      <div className="console-top">
        <div className="lights" aria-hidden="true"><i /><i /><i /></div>
        <span className="label console-host">utkarsh@dev</span>
        <div className="console-tabs" role="tablist" aria-label="Console views">
          {views.map((v, i) => (
            <button key={v.key} id={`ct-${v.key}`} aria-controls={`cp-${v.key}`} className="console-tab" {...getTabProps(v.key, i)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      {views.map(({ key, View }) => (
        <div key={key} className="pane" role="tabpanel" id={`cp-${key}`} aria-labelledby={`ct-${key}`} hidden={selected !== key}>
          {seen.has(key) && <View />}
        </div>
      ))}
      <div className="pane-foot">
        <span>{current.foot}</span>
        <span>
          layers: <span className="t-ui">ui</span> · <span className="t-api">api</span> · <span className="t-data">data</span>
        </span>
      </div>
    </div>
  );
}
