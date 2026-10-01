import { useRef, useState } from "react";
import { useIsoLayoutEffect } from "../hooks/motion";
import { Link, useLocation } from "react-router-dom";
import { navSections, profile, resumeDoc } from "../data/profile";
import { DocLink } from "./DocViewer";
import { toDoc } from "../utils/docs";
import { SectionLink } from "./SectionLink";
import { Icon } from "./Icon";
import { setTheme, themes, useTheme } from "../hooks/useTheme";
import "./Nav.css";

export function Nav({ scrolled, activeId: sectionId, onOpenMenu }) {
  const { pathname } = useLocation();
  const activeId = pathname === "/" ? sectionId : null;
  const linksRef = useRef(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const themeId = useTheme();
  const themeIndex = Math.max(themes.findIndex((t) => t.id === themeId), 0);
  const currentTheme = themes[themeIndex];
  const nextTheme = themes[(themeIndex + 1) % themes.length];

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
          <button
            className="icon-btn nav-theme"
            type="button"
            onClick={() => setTheme(nextTheme.id)}
            aria-label={`Theme: ${currentTheme.label}. Switch to ${nextTheme.label}`}
            title={`Theme: ${currentTheme.label}`}
          >
            <Icon name={currentTheme.icon} />
          </button>
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
