import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import github from "../data/github.json";
import { profile } from "../data/profile";
import { categories, flatStack, projects } from "../data/projects";
import { LayerStrip } from "../components/ProjectBits";
import { Breadcrumbs } from "../components/Breadcrumbs";
import "./Projects.css";

const ALL = "All";
const years = projects.map((p) => p.year);
const span = `${Math.min(...years)}–${Math.max(...years)}`;
const liveCount = projects.filter((p) => p.live).length;
const caseCount = projects.filter((p) => p.caseStudy).length;

const matches = (p, q) =>
  !q || [p.name, p.summary, p.category, ...flatStack(p)].join(" ").toLowerCase().includes(q);

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const type = categories.includes(params.get("type")) ? params.get("type") : ALL;
  const query = params.get("q") ?? "";
  const q = query.trim().toLowerCase();
  const searchRef = useRef(null);


  const update = (next) => {
    const merged = { type, q: query, ...next };
    const out = {};
    if (merged.type !== ALL) out.type = merged.type;
    if (merged.q) out.q = merged.q;
    setParams(out, { replace: true });
  };

  const counts = useMemo(() => {
    const byType = Object.fromEntries(categories.map((c) => [c, 0]));
    projects.filter((p) => matches(p, q)).forEach((p) => byType[p.category]++);
    return byType;
  }, [q]);

  const visible = projects.filter((p) => (type === ALL || p.category === type) && matches(p, q));
  const filtered = type !== ALL || q;

  return (
    <div className="pj">
      <header className="pj-head">
        <div className="container">
          <Breadcrumbs trail={[["Home", "/"], ["Projects", "/projects"]]} />
          <p className="label pj-kicker"><b>Index</b> · {projects.length} projects · {span}</p>
          <h1>Projects</h1>
          <p className="pj-lede">
            Everything I&apos;ve built and shipped, from production-style APIs and data pipelines to earlier frontend
            work. Each project has its own page with what it does, how it works and the stack behind it.
          </p>
          <dl className="pj-stats">
            <div><dt>Projects</dt><dd>{projects.length}</dd></div>
            <div><dt>Case studies</dt><dd>{caseCount}</dd></div>
            <div><dt>Live demos</dt><dd>{liveCount}</dd></div>
            <div><dt>Public repos</dt><dd>{github.publicRepos}</dd></div>
          </dl>
        </div>
      </header>

      <div className="pj-bar">
        <div className="container pj-bar-row">
          <div className="pj-filters" role="group" aria-label="Filter by type">
            {[ALL, ...categories].map((c) => (
              <button
                key={c}
                type="button"
                className="pj-filter"
                aria-pressed={type === c}
                onClick={() => update({ type: c })}
                disabled={c !== ALL && counts[c] === 0}
              >
                {c}
                <span>{c === ALL ? projects.filter((p) => matches(p, q)).length : counts[c]}</span>
              </button>
            ))}
          </div>
          <div className="pj-search">
            <label className="sr-only" htmlFor="pj-q">Search projects</label>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" />
            </svg>
            <input
              id="pj-q"
              ref={searchRef}
              type="search"
              placeholder="Search name or stack…"
              value={query}
              onChange={(e) => update({ q: e.target.value })}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <section className="container pj-body" aria-label="Project list">
        <p className="pj-count" role="status">
          {filtered ? `${visible.length} of ${projects.length} projects` : `All ${projects.length} projects`}
          {type !== ALL && <> · {type}</>}
          {q && <> · matching “{query.trim()}”</>}
        </p>

        {visible.length > 0 ? (
          <ul className="pj-grid">
            {visible.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="pj-empty">
            <p>No projects match {q ? <>“{query.trim()}”</> : "this filter"}.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setParams({}, { replace: true });
                searchRef.current?.focus();
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <p className="pj-more">
          Smaller experiments and practice repos live on GitHub.{" "}
          <a className="lnk" href={`${profile.links.github}?tab=repositories`} target="_blank" rel="noopener">
            All {github.publicRepos} repositories ↗
          </a>
        </p>
      </section>
    </div>
  );
}

function ProjectCard({ project: p }) {
  const stack = flatStack(p);
  return (
    <article className={`pcard${p.caseStudy ? " is-case" : ""}`} aria-labelledby={`pc-${p.slug}`}>
      <div className="pcard-top">
        <span className="label">{p.year} · {p.category}</span>
        {p.caseStudy ? (
          <span className="chip pcard-case">Case study</span>
        ) : p.live ? (
          <span className="chip chip-live">● live</span>
        ) : null}
      </div>
      <h2 id={`pc-${p.slug}`}>
        <Link className="pcard-link" to={`/projects/${p.slug}`}>{p.name}</Link>
      </h2>
      <p className="pcard-sum">{p.summary}</p>
      <LayerStrip stack={p.stack} labelled />
      <ul className="chips pcard-stack" aria-label="Stack">
        {stack.slice(0, 4).map((t) => <li className="chip" key={t}>{t}</li>)}
        {stack.length > 4 && <li className="chip pcard-more">+{stack.length - 4}</li>}
      </ul>
      <div className="pcard-foot">
        <span className="pcard-cta" aria-hidden="true">{p.caseStudy ? "Read case study" : "View details"} →</span>
        <span className="pcard-ext">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" aria-label={`${p.name}: ${l.label}`}>
              {l.label} ↗
            </a>
          ))}
        </span>
      </div>
    </article>
  );
}
