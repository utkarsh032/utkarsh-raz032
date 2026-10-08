import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// A chapter is the current one once its top passes this fraction of the viewport height.
const READ_LINE = 0.32;
// A jump has landed when the page has been still for this long.
const SETTLE_MS = 160;

/**
 * Reading position within a run of chapters, for components/Spine.jsx.
 *
 * Chapter positions are measured only when the page changes size, so a scroll frame is one `scrollY` read and
 * arithmetic on cached numbers, and the scroll listener runs only while a chapter is on screen. Progress through
 * the current chapter (0–1) goes straight to `--q` on the elements inside the root marked `data-q`, so scrolling
 * restyles those elements alone and re-renders React only when the chapter changes.
 *
 * Returns
 *   rootRef  attach to the navigation's root element; it gets `data-ready` once the first position is drawn
 *   at       index of the chapter under the reading line
 *   focus    index to present as current: `at`, or the destination while a jump is in flight
 *   from     the previous `focus`; `hop` counts the changes and is 0 until the reader first moves
 *   spans    each chapter's length in screens, or null before the first measurement
 *   go(i)    call when a link to chapter i is followed. The browser does the scrolling; on arrival the chapter
 *            element gets the class `is-arriving` for a second.
 */
export function useSpine(ids) {
  const rootRef = useRef(null);
  const flight = useRef({ to: null, timer: 0 });
  const [pos, setPos] = useState({ at: 0, focus: 0, from: 0, hop: 0 });
  const [spans, setSpans] = useState(null);
  const key = ids.join();

  useEffect(() => {
    const root = rootRef.current;
    const els = key.split(",").map((id) => document.getElementById(id));
    if (!root || els.some((el) => !el)) return;
    const f = flight.current;
    let tops = [];
    let end = 0;
    let line = 0;
    let frame = 0;
    let ready = 0;
    let listening = false;
    let last = null; // What React was last told. Null until the first position, which is not a move.
    let live = []; // The elements that draw --q.
    let drawn = "";

    const sync = () => {
      frame = 0;
      if (!tops.length) return;
      const y = window.scrollY + line;
      let at = 0;
      while (at < tops.length - 1 && tops[at + 1] <= y) at++;
      const q = Math.min(1, Math.max(0, (y - tops[at]) / ((tops[at + 1] ?? end) - tops[at]))).toFixed(3);
      const focus = f.to ?? at;

      if (!last || at !== last.at || focus !== last.focus) {
        const first = !last;
        const moved = !first && focus !== last.focus;
        last = { at, focus };
        // Flushed now: the chapter and --q have to change in the same frame, or the playhead flickers back to the old chapter's start.
        flushSync(() =>
          setPos((p) => (first ? { at, focus, from: focus, hop: 0 } : { at, focus, from: moved ? p.focus : p.from, hop: p.hop + (moved ? 1 : 0) }))
        );
        live = root.querySelectorAll("[data-q]");
        drawn = "";
        // Transitions switch on a frame after the first position is painted, so a page loaded mid-way doesn't animate into place.
        if (first) ready = requestAnimationFrame(() => (ready = requestAnimationFrame(() => (root.dataset.ready = ""))));
      }
      if (q === drawn) return;
      drawn = q;
      live.forEach((el) => el.style.setProperty("--q", q));
    };

    const measure = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      tops = els.map((el) => el.getBoundingClientRect().top + y);
      end = els[els.length - 1].getBoundingClientRect().bottom + y;
      line = Math.max(vh * READ_LINE, 140);
      const next = tops.map((top, i) => Math.max(0.1, ((tops[i + 1] ?? end) - top) / vh));
      setSpans((prev) => (prev?.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.05) ? prev : next));
      sync();
    };

    const onScroll = () => {
      if (f.to !== null) {
        clearTimeout(f.timer);
        f.timer = setTimeout(f.land, SETTLE_MS);
      }
      if (!frame) frame = requestAnimationFrame(sync);
    };

    f.sync = sync;
    f.land = () => {
      const el = els[f.to];
      f.to = null;
      sync();
      if (!el) return;
      el.classList.add("is-arriving");
      setTimeout(() => el.classList.remove("is-arriving"), 1000);
    };

    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      if (seen.size > 0 === listening) return;
      listening = seen.size > 0;
      if (listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        sync();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    els.forEach((el) => io.observe(el));

    // The body resizes whenever anything on the page does: a tab opening, a font loading, the window narrowing.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(ready);
      clearTimeout(f.timer);
      f.to = null;
      f.sync = f.land = undefined;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [key]);

  const go = (i) => {
    const f = flight.current;
    if (!f.sync) return;
    clearTimeout(f.timer);
    f.to = i;
    // If the page is already there, no scroll event will come to land the jump.
    f.timer = setTimeout(f.land, SETTLE_MS * 3);
    f.sync();
  };

  return { rootRef, ...pos, spans, go };
}
