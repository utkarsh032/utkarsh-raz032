import { useEffect, useState } from "react";
import github from "../../data/github.json";
import { profile } from "../../data/profile";
import { prefersReducedMotion } from "../../hooks/motion";

const session = [
  { cmd: "whoami", out: `utkarsh-raj · ${profile.role.toLowerCase()}` },
  { cmd: "cat role.txt", out: "full-stack · since Nov 2025 · Angular / React / .NET / SQL" },
  {
    cmd: "git -C noto rev-list --count HEAD",
    out: String(github.flagship.commits),
    note: `# since ${github.flagship.created ?? "Aug 2026"}`,
  },
  { cmd: "ls noto/packages", out: "config  core  database  editor  sync  types  ui" },
  { cmd: "status", out: profile.available ? "● open to new roles" : "● heads down", ok: true },
];

const CHAR_MS = 28;

/** Types each command once; output appears whole. Reduced motion prints everything at once. */
export function Terminal() {
  const [step, setStep] = useState(() => (prefersReducedMotion() ? { line: session.length, chars: 0 } : { line: 0, chars: 0 }));

  useEffect(() => {
    if (step.line >= session.length) return;
    const cmd = session[step.line].cmd;
    const done = step.chars >= cmd.length;
    const t = setTimeout(
      () => setStep(done ? { line: step.line + 1, chars: 0 } : { line: step.line, chars: step.chars + 1 }),
      done ? 260 : CHAR_MS
    );
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="term">
      {/* Screen readers get the full session immediately */}
      <div className="sr-only">
        {session.map((s) => `$ ${s.cmd}: ${s.out}. `)}
      </div>
      <div aria-hidden="true">
        {session.map((s, i) => {
          if (i > step.line) return null;
          const typing = i === step.line;
          return (
            <div key={s.cmd}>
              <p>
                <span className="pr">$</span> <span className="cm">{typing ? s.cmd.slice(0, step.chars) : s.cmd}</span>
                {typing && <span className="caret" />}
              </p>
              {!typing && (
                <p className={s.ok ? "ok" : "out"}>
                  {s.out}
                  {s.note && <span className="dim">  {s.note}</span>}
                </p>
              )}
            </div>
          );
        })}
        {step.line >= session.length && (
          <p>
            <span className="pr">$</span> <span className="caret" />
          </p>
        )}
      </div>
    </div>
  );
}
