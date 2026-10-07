import { useEffect, useState } from "react";
import { useTabs } from "../../hooks/useTabs";
import { Icon } from "../Icon";
import { Compare, Sources } from "./Figure";

const STEP_MS = 3400;

/**
 * The same eight questions asked of every problem. Pick a case, then step or play through
 * what each question looked like when it was real. Every stage of every case is in the HTML.
 */
export function ProcessWalk({ stages, cases }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = stages.length - 1;
  const { selected, getTabProps } = useTabs(cases.map((c) => c.id), undefined, () => {
    setStep(0);
    setPlaying(false);
  });

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => (step < last ? setStep(step + 1) : setPlaying(false)), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, last]);

  const go = (i) => {
    setPlaying(false);
    setStep(i);
  };
  const toggle = () => {
    if (!playing && step === last) setStep(0);
    setPlaying(!playing);
  };

  return (
    <div className="by-walk">
      <div className="by-tabs" role="tablist" aria-label="Cases">
        {cases.map((c, i) => (
          <button key={c.id} id={`pw-t-${c.id}`} aria-controls={`pw-p-${c.id}`} className="by-tab" {...getTabProps(c.id, i)}>
            <b>{c.title}</b>
            <span>{c.where}</span>
          </button>
        ))}
      </div>

      {cases.map((c) => (
        <div key={c.id} role="tabpanel" id={`pw-p-${c.id}`} aria-labelledby={`pw-t-${c.id}`} hidden={selected !== c.id}>
          <ol className="by-rail" aria-label="Stages">
            {stages.map((s, i) => (
              <li key={s.id} className={i < step ? "is-done" : i === step ? "is-on" : undefined}>
                <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => go(i)}>
                  <span>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>

          <div aria-live="polite">
            {stages.map((s, i) => (
              <div key={s.id} className="by-stage" hidden={i !== step}>
                <div>
                  <p className="by-stage-no">{String(i + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</p>
                  <h3>{s.label}</h3>
                  <p className="by-ask">{s.ask}</p>
                </div>
                <div>
                  <p className="label">In this case</p>
                  <p className="by-did">{c.steps[s.id]}</p>
                  {c.code?.at === s.id && <Compare code={c.code} />}
                </div>
              </div>
            ))}
          </div>

          <div className="by-ctl">
            <button type="button" className="by-step" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous stage">
              <Icon name="chevron-left" size={16} />
            </button>
            <button type="button" className="by-step by-play" onClick={toggle} aria-pressed={playing}>
              <Icon name={playing ? "pause" : "play"} size={13} />
              {playing ? "Pause" : step === last ? "Replay" : "Play it through"}
            </button>
            <button type="button" className="by-step" onClick={() => go(step + 1)} disabled={step === last} aria-label="Next stage">
              <Icon name="chevron-right" size={16} />
            </button>
            <Sources items={c.sources} />
          </div>
        </div>
      ))}
    </div>
  );
}
