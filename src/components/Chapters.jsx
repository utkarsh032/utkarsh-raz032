import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Section";
import "./Chapters.css";

/**
 * Numbered chapter navigation with scroll spy. A sticky column on wide screens,
 * a sticky strip of chips under the nav on narrow ones.
 */
function ChapterRail({ chapters }) {
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
    <nav className="ch-rail" aria-label="Chapters">
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

function Chapter({ id, n, label, title, lead, children }) {
  return (
    <section className="ch" id={id} aria-labelledby={`${id}-h`}>
      <Reveal className="ch-head">
        <p className="ch-no"><b>{String(n).padStart(2, "0")}</b>{label}</p>
        <h2 id={`${id}-h`}>{title}</h2>
        {lead && <p className="ch-lead">{lead}</p>}
      </Reveal>
      {children}
    </section>
  );
}

/**
 * A page body made of numbered chapters with a rail beside them.
 * `chapters` is [{ id, label, title, lead, body }]; `children` render after the last chapter.
 * The page must sit inside a `.tint` element, which supplies the accent.
 */
export function Chapters({ chapters, children }) {
  return (
    <div className="container ch-layout">
      <ChapterRail chapters={chapters} />
      <div className="ch-main">
        {chapters.map((c, n) => (
          <Chapter key={c.id} id={c.id} n={n + 1} label={c.label} title={c.title} lead={c.lead}>
            {c.body}
          </Chapter>
        ))}
        {children}
      </div>
    </div>
  );
}
