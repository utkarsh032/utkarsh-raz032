import { useEffect, useRef } from "react";
import "./ScrollThumb.css";

const IDLE_MS = 900;

/**
 * Replaces the page scrollbar with a slim overlay thumb that fades in while scrolling and can be dragged.
 * Position comes from `--scroll` (see hooks/useScrollSpy.js); wheel, touch and keyboard scrolling stay native.
 */
export function ScrollThumb() {
  const ref = useRef(null);

  useEffect(() => {
    const track = ref.current;
    const thumb = track.firstElementChild;
    const root = document.documentElement;
    let idle = 0;
    let grab = null; // Pointer offset inside the thumb while dragging.

    const maxScroll = () => root.scrollHeight - window.innerHeight;
    const measure = () => {
      const max = maxScroll();
      track.hidden = max <= 0;
      thumb.style.height = `${Math.max(8, (window.innerHeight / root.scrollHeight) * 100)}%`;
    };
    const wake = () => {
      measure();
      track.classList.add("on");
      clearTimeout(idle);
      idle = setTimeout(() => grab === null && track.classList.remove("on"), IDLE_MS);
    };

    const dragTo = (clientY) => {
      const box = track.getBoundingClientRect();
      const travel = box.height - thumb.offsetHeight;
      const ratio = travel > 0 ? (clientY - box.top - grab) / travel : 0;
      window.scrollTo({ top: Math.min(1, Math.max(0, ratio)) * maxScroll(), behavior: "instant" });
    };
    const onDown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      // Grabbing the thumb keeps it under the pointer; pressing the track centres the thumb there.
      grab = e.target === thumb ? e.clientY - thumb.getBoundingClientRect().top : thumb.offsetHeight / 2;
      track.setPointerCapture(e.pointerId);
      track.classList.add("on", "drag");
      dragTo(e.clientY);
    };
    const onMove = (e) => {
      if (grab !== null) dragTo(e.clientY);
    };
    const onUp = () => {
      grab = null;
      track.classList.remove("drag");
      wake();
    };

    measure();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", measure);
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", measure);
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="sbar" ref={ref} aria-hidden="true" hidden>
      <i />
    </div>
  );
}
