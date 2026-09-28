import { useRef, useState } from "react";
import { useIsoLayoutEffect } from "../hooks/motion";
import { Link, useLocation } from "react-router-dom";
import { navSections, profile, resumeDoc } from "../data/profile";
import { DocLink } from "./DocViewer";
import { toDoc } from "../utils/docs";
import { SectionLink } from "./SectionLink";
import "./Nav.css";

export function Nav({ scrolled, activeId: sectionId, onOpenMenu }) {
  const { pathname } = useLocation();
  const activeId = pathname === "/" ? sectionId : null;
  const linksRef = useRef(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });

  // Slide the underline to the active link.
  useIsoLayoutEffect(() => {
    const el = activeId && linksRef.current?.querySelector(`[data-id="${activeId}"]`);
    setIndicator(el ? { x: el.offsetLeft + 12, w: el.offsetWidth - 24 } : { x: 0, w: 0 });
  }, [activeId]);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-row">
        <Link className="brand" to="/" aria-label={`${profile.name}, home`}>
          <span className="mark" aria-hidden="true">{profile.initials}</span>
          {profile.name}
        </Link>
        <nav className="nav-links" aria-label="Sections" ref={linksRef}>
          {navSections.map((s) => (
            <SectionLink key={s.id} id={s.id} data-id={s.id} aria-current={activeId === s.id ? "true" : undefined}>
              {s.label}
            </SectionLink>
          ))}
          <span
            className="nav-ind"
            aria-hidden="true"
            style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
          />
        </nav>
        <div className="nav-r">
          {profile.available && (
            <span className="avail">
              <span className="dot" aria-hidden="true" />
              {profile.availability}
            </span>
          )}
          <DocLink className="btn btn-ghost btn-sm nav-resume" doc={toDoc(resumeDoc)}>
            Resume
          </DocLink>
          <button className="btn btn-ghost btn-sm nav-menu" type="button" onClick={onOpenMenu} aria-haspopup="dialog">
            Menu <kbd>⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}

export function TraceRail({ progress, span }) {
  const { pathname } = useLocation();
  if (pathname !== "/") return null;
  return (
    <div className="rail" aria-hidden="true">
      <i style={{ transform: `scaleY(${progress})` }} />
      <b>span {span ?? "00 · identity"}</b>
    </div>
  );
}
