import { Link } from "react-router-dom";
import { featured, flatStack, homeSystems, projects } from "../data/projects";
import { useTabs } from "../hooks/useTabs";
import { ArchDiagram } from "../components/ArchDiagram";
import { Flow } from "../components/ProjectBits";
import { Reveal, Section, SectionHeader } from "../components/Section";
import "./Work.css";

export function Work() {
  return (
    <Section id="work" span="01 · systems" band>
      <SectionHeader id="work" num="01" label="Featured systems" title="Full-stack projects, shown as systems rather than screenshots.">
        <p>Each project shows the problem, the architecture, the hard part and my role. The full write-up is one click away.</p>
      </SectionHeader>
      <FeaturedProject project={featured} />
      <div className="systems">
        {homeSystems.map((s) => (
          <SystemCard key={s.slug} system={s} />
        ))}
      </div>
      <Reveal className="more-work">
        <p>
          <b>{projects.length - homeSystems.length - 1} more projects</b>
          <span>APIs, full-stack apps and earlier builds, each with its own page.</span>
        </p>
        <Link className="btn btn-ghost" to="/projects">
          View all projects <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </Section>
  );
}

function FeaturedProject({ project }) {
  const { selected, getTabProps } = useTabs(project.facets.map((f) => f.key));
  const facet = project.facets.find((f) => f.key === selected);

  return (
    <Reveal as="article" className="feature" aria-labelledby="h-feature">
      <div className="feat-head">
        <div>
          <p className="label">{project.kicker}</p>
          <h3 id="h-feature">{project.name}</h3>
          <p className="feat-one">{project.summary}</p>
        </div>
        <div className="chips">{project.stack.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
      </div>

      <div className="feat-diagram">
        <ArchDiagram diagram={project.diagram} note="Diagram based on the NOTO README. Scroll sideways on small screens." />
      </div>

      <div className="facets" role="tablist" aria-label={`${project.name} details`}>
        {project.facets.map((f, i) => (
          <button key={f.key} id={`ft-${f.key}`} aria-controls="facet-panel" className="facet" {...getTabProps(f.key, i)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="facet-body" role="tabpanel" id="facet-panel" aria-labelledby={`ft-${facet.key}`}>
        <div>
          <h4>{facet.title}</h4>
          <p>{facet.body}</p>
          {facet.todo && <p className="todo">TODO · {facet.todo}</p>}
        </div>
        <ul className="bullets">{facet.points.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>

      <div className="feat-foot">
        <div className="chips">{project.tooling.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="feat-actions">
          <a className="btn btn-ghost btn-sm" href={project.repo} target="_blank" rel="noopener">Repository ↗</a>
          <Link className="btn btn-primary btn-sm" to={`/projects/${project.slug}`}>Read the case study →</Link>
        </div>
      </div>
    </Reveal>
  );
}

function SystemCard({ system }) {
  return (
    <Reveal as="article" className="sys" aria-labelledby={`h-${system.slug}`}>
      <div className="sys-top">
        <div>
          <h3 id={`h-${system.slug}`}>{system.name}</h3>
          <p className="sys-kind">{system.kind}</p>
        </div>
        {system.live ? <span className="chip chip-live">● live</span> : <span className="chip">{system.category}</span>}
      </div>
      <Flow steps={system.flow} label={system.flowLabel} />
      <ul className="bullets sys-points">{system.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <div className="sys-foot">
        <div className="chips">{flatStack(system).slice(0, 3).map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="sys-links">
          <Link className="lnk" to={`/projects/${system.slug}`}>Case study →</Link>
          {system.links.map((l) => (
            <a key={l.href} className="lnk" href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
