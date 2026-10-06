import { useEffect, useRef, useState } from "react";

/**
 * Numbered chapter navigation with scroll spy. A sticky column on wide screens,
 * a sticky strip of chips under the nav on narrow ones (see ProjectPage.css).
 */
export function ChapterRail({ chapters }) {
  const [active, setActive] = useState(chapters[0].id);
  const listRef = useRef(null);
  const ids = chapters.map((c) => c.id).join();
  const index = Math.max(chapters.findIndex((c) => c.id === active), 0);

  // The chapter crossing a thin band a third of the way down the viewport is the current one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -65% 0px" }
    );
    ids.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  // Narrow screens: keep the current chip in view. Scrolls the strip only, never the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const chip = list.children[index];
    list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [index]);

  return (
    <nav className="px-rail" aria-label="Chapters">
      <ol ref={listRef} style={{ "--p": (index + 1) / chapters.length }}>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={c.id === active ? "step" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
