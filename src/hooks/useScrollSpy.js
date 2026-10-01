import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * One passive, rAF-throttled scroll listener for the whole page chrome.
 * Writes the scroll progress (0–1) to `--scroll` on <html> and returns
 * whether the page is scrolled plus the current section (the last `section[data-span]` above 40% of the viewport).
 */
export function useScrollSpy() {
  const { pathname } = useLocation();
  const [state, setState] = useState({ scrolled: false, activeId: null, span: null });

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
      // Progress goes straight to a CSS variable so scrolling never re-renders React.
      document.documentElement.style.setProperty("--scroll", max > 0 ? Math.min(1, y / max).toFixed(4) : "0");
      setState((prev) => {
        const next = {
          scrolled: y > 24,
          activeId: current?.id ?? null,
          span: current?.dataset.span ?? null,
        };
        return prev.scrolled === next.scrolled && prev.activeId === next.activeId ? prev : next;
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
