import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * One passive, rAF-throttled scroll listener for the whole page chrome.
 * Returns whether the page is scrolled, the scroll progress (0–1) and the
 * current section (the last `section[data-span]` above 40% of the viewport).
 */
export function useScrollSpy() {
  const { pathname } = useLocation();
  const [state, setState] = useState({ scrolled: false, progress: 0, activeId: null, span: null });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      let current = null;
      for (const s of document.querySelectorAll("section[data-span]")) {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s;
      }
      setState((prev) => {
        const next = {
          scrolled: y > 24,
          progress: max > 0 ? Math.min(1, y / max) : 0,
          activeId: current?.id ?? null,
          span: current?.dataset.span ?? null,
        };
        const same =
          prev.scrolled === next.scrolled &&
          prev.activeId === next.activeId &&
          Math.abs(prev.progress - next.progress) < 0.002;
        return same ? prev : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return state;
}
