import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile, resumeDoc } from "../data/profile";
import { toDoc, useDocViewer } from "../utils/docs";
import { liveChannels } from "../data/channels";
import { projects } from "../data/projects";
import { copyText } from "../utils/clipboard";
import { setTheme, themes } from "../hooks/useTheme";
import "./CommandMenu.css";

const commands = [
  { group: "Sections", label: "Featured systems", hint: "01", section: "work" },
  { group: "Sections", label: "How I work", hint: "02", section: "method" },
  { group: "Sections", label: "Stack by layer", hint: "03", section: "stack" },
  { group: "Sections", label: "Experience", hint: "04", section: "experience" },
  { group: "Sections", label: "GitHub", hint: "05", section: "github" },
  { group: "Sections", label: "Beyond code", hint: "06", section: "beyond" },
  { group: "Sections", label: "All channels", hint: "↵", route: "/beyond" },
  { group: "Sections", label: "Contact", hint: "07", section: "contact" },
  { group: "Projects", label: "All projects", hint: "↵", route: "/projects" },
  ...projects.map((p) => ({ group: "Projects", label: p.name, hint: p.caseStudy ? "case study" : p.category, route: `/projects/${p.slug}` })),
  { group: "Actions", label: "Copy email address", hint: "⌘C", copy: profile.email },
  { group: "Actions", label: "Open GitHub", hint: "↗", href: profile.links.github },
  { group: "Actions", label: "Open LinkedIn", hint: "↗", href: profile.links.linkedin },
  ...liveChannels.map((c) => ({ group: "Actions", label: `Open ${c.name}`, hint: "↗", href: c.href })),
  { group: "Actions", label: "View resume", hint: "↵", doc: resumeDoc },
  { group: "Actions", label: "Download resume", hint: "↓", download: profile.resume },
  ...themes.map((t) => ({ group: "Theme", label: `${t.label} theme`, hint: "◐", theme: t.id })),
];

export function CommandMenu({ open, onClose }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const openDoc = useDocViewer();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.group}`.toLowerCase().includes(q)) : commands;
  }, [query]);

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) {
      setQuery("");
      setCursor(0);
      setNote("");
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const run = async (c) => {
    if (c.copy) {
      const ok = await copyText(c.copy);
      setNote(ok ? "Email address copied" : c.copy);
      if (ok) setTimeout(onClose, 700);
      return;
    }
    onClose();
    if (c.theme) setTheme(c.theme);
    else if (c.doc) openDoc([toDoc(c.doc)]);
    else if (c.download) Object.assign(document.createElement("a"), { href: c.download, download: c.download.split("/").pop() }).click();
    else if (c.href) window.open(c.href, "_blank", "noopener");
    else if (c.route) navigate(c.route);
    else if (c.section) navigate(`/#${c.section}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setCursor((i) => (i + step + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      run(results[cursor]);
    }
  };

  let lastGroup = null;
  return (
    <dialog
      ref={dialog}
      className="cmdk"
      aria-label="Command menu"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="cmdk-in">
        <span className="mono cmdk-prompt" aria-hidden="true">›</span>
        <label className="sr-only" htmlFor="cmdk-q">Search sections and actions</label>
        <input
          id="cmdk-q"
          ref={input}
          value={query}
          placeholder="Jump to…"
          autoComplete="off"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={results[cursor] ? `cmdk-${cursor}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
        />
        <kbd>esc</kbd>
      </div>
      <ul id="cmdk-list" role="listbox" aria-label="Results">
        {results.map((c, i) => {
          const header = c.group !== lastGroup && (lastGroup = c.group);
          return (
            <li key={c.label} role="presentation">
              {header && <div className="cmdk-grp" aria-hidden="true">{c.group}</div>}
              <button
                id={`cmdk-${i}`}
                type="button"
                role="option"
                aria-selected={i === cursor}
                tabIndex={-1}
                className={i === cursor ? "active" : ""}
                onMouseMove={() => setCursor(i)}
                onClick={() => run(c)}
              >
                {c.label}
                <span>{c.hint}</span>
              </button>
            </li>
          );
        })}
        {results.length === 0 && <li className="cmdk-empty">No matches. Try “stack” or “email”.</li>}
      </ul>
      <p className="cmdk-note" role="status">{note}</p>
    </dialog>
  );
}
