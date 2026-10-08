import { useEffect, useId, useState } from "react";
import { useSpine } from "../hooks/useSpine";
import "./Spine.css";

const pad = (n) => String(n).padStart(2, "0");

/** "07 / 09". The current number sits in a one-line window, and the reel behind it rolls to the new one. */
function Odometer({ index, total }) {
  return (
    <span className="sp-odo" aria-hidden="true">
      <span className="sp-odo-win">
        <span className="sp-odo-reel" style={{ "--i": index }}>
          {Array.from({ length: total }, (_, i) => <span key={i}>{pad(i + 1)}</span>)}
        </span>
      </span>
      / {pad(total)}
    </span>
  );
}

/**
 * Chapter navigation drawn as a scale model of the page. Each chapter is a segment of one line, as long as the
 * chapter is, with a tick for every screen of reading; a playhead travels the line as the page scrolls. The current
 * chapter opens to show its heading, its neighbours stay readable, and the rest fall back to numbered marks until
 * the pointer or keyboard focus comes near.
 *
 * `chapters` is [{ id, label, title }] and `name` labels the top of the line. Nothing about the chapters is fixed
 * here: number, order and length all come from the page. The same links are a spine on wide screens, a narrow
 * spine on medium ones and a bar with a drop-down map on small ones (see Spine.css).
 */
export function Spine({ name, chapters }) {
  const { rootRef, at, focus, from, hop, spans, go } = useSpine(chapters.map((c) => c.id));
  const [open, setOpen] = useState(false);
  const listId = useId();
  const n = chapters.length;

  // A signal runs from the chapter just left to the current one, a segment at a time. Never on first paint.
  const lo = Math.min(from, focus);
  const hi = Math.max(from, focus);
  const up = focus < from;
  const step = Math.min(600, 300 + (hi - lo) * 60) / Math.max(hi - lo, 1);

  // The small-screen map closes on Escape and on a press outside it.
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      root.querySelector(".sp-now").focus();
    };
    const onPress = (e) => !root.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open, rootRef]);

  // The link itself moves the page, so the address, history and focus behave as for any in-page link.
  // The spine is told a moment later, once the browser has read the link: the step links re-point when the chapter changes.
  const follow = (i) => (e) => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    setOpen(false);
    setTimeout(() => go(i));
  };
  const state = (i) => (i < at ? "is-past" : i === at ? "is-at" : "");

  return (
    <nav className={`sp${open ? " is-open" : ""}`} aria-label="Chapters" ref={rootRef}>
      <p className="sp-origin" aria-hidden="true">{name}</p>

      <div className="sp-bar">
        <button className="sp-now" type="button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>
          <Odometer index={focus} total={n} />
          <b key={focus}>{chapters[focus].label}</b>
          <span className="sr-only">, chapter {focus + 1} of {n}. All chapters</span>
          <i aria-hidden="true">+</i>
        </button>
        {[-1, 1].map((d) => {
          const c = chapters[focus + d];
          const arrow = d < 0 ? "↑" : "↓";
          return c ? (
            <a key={d} className="sp-step" href={`#${c.id}`} aria-label={`${d < 0 ? "Previous" : "Next"} chapter: ${c.label}`} onClick={follow(focus + d)}>
              {arrow}
            </a>
          ) : (
            <span key={d} className="sp-step" aria-hidden="true">{arrow}</span>
          );
        })}
        <span className="sp-meter" aria-hidden="true">
          {chapters.map((c, i) => (
            <i key={c.id} className={state(i) || undefined} data-q={i === at ? "" : undefined} style={{ "--len": spans?.[i] }} />
          ))}
        </span>
      </div>

      <ol className="sp-list" id={listId} style={{ "--n": n }}>
        {chapters.map((c, i) => (
          <li
            key={c.id}
            className={`sp-seg ${state(i)}${i === focus ? " is-current" : ""}`}
            data-d={Math.min(Math.abs(i - focus), 3)}
            style={{ "--len": spans?.[i] }}
          >
            <a href={`#${c.id}`} aria-current={i === focus ? "step" : undefined} onClick={follow(i)}>
              <span className="sp-no" aria-hidden="true">{pad(i + 1)}</span>
              <span className="sp-name">{c.label}</span>
              <span className="sp-gist" aria-hidden="true"><span>{c.title}</span></span>
              <span className="sp-tip" aria-hidden="true"><b>{pad(i + 1)} · {c.label}</b>{c.title}</span>
            </a>
            {i === at && <i className="sp-head" data-q="" aria-hidden="true" />}
            {hop > 0 && i >= lo && i < hi && (
              <i
                key={hop}
                className={`sp-relay${up ? " is-up" : ""}`}
                style={{ "--rt": `${step}ms`, "--rd": `${(up ? hi - 1 - i : i - lo) * step}ms` }}
                aria-hidden="true"
              />
            )}
            {hop > 0 && i === focus && <i key={`hit${hop}`} className="sp-hit" style={{ "--rd": `${(hi - lo) * step}ms` }} aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <p className="sp-end" aria-hidden="true"><Odometer index={focus} total={n} /></p>
    </nav>
  );
}
