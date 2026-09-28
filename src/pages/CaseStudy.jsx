import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { caseStudies, caseStudyOrder } from "../data/caseStudies";
import { featured } from "../data/projects";
import { ArchDiagram } from "../components/ArchDiagram";
import { Reveal } from "../components/Section";
import "./CaseStudy.css";

// Architecture diagrams per case study; others fall back to their implementation list.
const diagrams = { noto: featured.diagram };

const chapters = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "requirements", label: "Requirements" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "implementation", label: "Implementation" },
  { id: "challenges", label: "Challenges" },
  { id: "results", label: "Results" },
  { id: "lessons", label: "Lessons" },
];

function Todo({ children }) {
  return <p className="todo">TODO · {children}</p>;
}

function Chapter({ id, n, title, children }) {
  return (
    <Reveal as="section" className="cs-ch" id={id} aria-labelledby={`cs-${id}`}>
      <p className="label"><b>{String(n).padStart(2, "0")}</b></p>
      <h2 id={`cs-${id}`}>{title}</h2>
      <div className="cs-body">{children}</div>
    </Reveal>
  );
}

export default function CaseStudy({ slug }) {
  const cs = caseStudies[slug];


  const i = caseStudyOrder.indexOf(slug);
  const prev = caseStudies[caseStudyOrder[(i - 1 + caseStudyOrder.length) % caseStudyOrder.length]];
  const next = caseStudies[caseStudyOrder[(i + 1) % caseStudyOrder.length]];
  const prevSlug = caseStudyOrder[(i - 1 + caseStudyOrder.length) % caseStudyOrder.length];
  const nextSlug = caseStudyOrder[(i + 1) % caseStudyOrder.length];

  return (
    <article className="cs">
      <header className="cs-head">
        <div className="container">
          <Breadcrumbs trail={[["Home", "/"], ["Projects", "/projects"], [cs.name, `/projects/${slug}`]]} />
          <p className="label cs-kicker">Case study · {cs.timeframe}</p>
          <h1>{cs.name}</h1>
          <p className="cs-one">{cs.oneLine}</p>
          <dl className="cs-meta">
            <div><dt>Role</dt><dd>{cs.role}</dd></div>
            <div><dt>Timeframe</dt><dd>{cs.timeframe}</dd></div>
            <div>
              <dt>Links</dt>
              <dd className="cs-links">
                {cs.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>)}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container cs-layout">
        <nav className="cs-toc" aria-label="Chapters">
          {chapters.map((c, n) => (
            <a key={c.id} href={`#${c.id}`}><span>{String(n + 1).padStart(2, "0")}</span>{c.label}</a>
          ))}
        </nav>

        <div className="cs-main">
          <Chapter id="overview" n={1} title="Overview"><p>{cs.overview}</p></Chapter>
          <Chapter id="problem" n={2} title="Problem"><p>{cs.problem}</p></Chapter>
          <Chapter id="requirements" n={3} title="Requirements">
            <ul className="cs-checks">{cs.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
          </Chapter>
          <Chapter id="architecture" n={4} title="Architecture">
            {diagrams[slug] ? (
              <ArchDiagram diagram={diagrams[slug]} note="Scroll sideways on small screens." />
            ) : (
              <ol className="cs-stackflow">
                {cs.implementation.map((line) => <li key={line}>{line}</li>)}
              </ol>
            )}
          </Chapter>
          <Chapter id="decisions" n={5} title="Technical decisions">
            <div className="adrs">
              {cs.decisions.map((d, k) => (
                <div className="adr" key={d.title}>
                  <p className="label">ADR {String(k + 1).padStart(3, "0")}</p>
                  <h3>{d.title}</h3>
                  <dl>
                    <dt>Context</dt><dd>{d.context}</dd>
                    <dt>Decision</dt><dd>{d.decision}</dd>
                    <dt>Consequence</dt><dd>{d.consequence}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </Chapter>
          <Chapter id="implementation" n={6} title="Implementation">
            <ul className="bullets">{cs.implementation.map((line) => <li key={line}>{line}</li>)}</ul>
            <Todo>Add 2–3 annotated code excerpts from the repository</Todo>
          </Chapter>
          <Chapter id="challenges" n={7} title="Challenges and solutions">
            {cs.challenges ? (
              <div className="pairs">
                {cs.challenges.map((c) => (
                  <div className="pair" key={c.challenge}>
                    <p><span className="label">Challenge</span>{c.challenge}</p>
                    <p><span className="label">Solution</span>{c.solution}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Todo>Describe the hardest problem in this project and how you solved it</Todo>
            )}
          </Chapter>
          <Chapter id="results" n={8} title="Results">
            {cs.results ? <p>{cs.results}</p> : <Todo>Add measured results only (users, timings, releases). Nothing estimated.</Todo>}
          </Chapter>
          <Chapter id="lessons" n={9} title="Lessons learned">
            {cs.lessons ? <p>{cs.lessons}</p> : <Todo>What would you do differently next time?</Todo>}
          </Chapter>

          <nav className="cs-next" aria-label="More case studies">
            <Link to={`/projects/${prevSlug}`}><span className="label">← Previous</span>{prev.name}</Link>
            <Link to={`/projects/${nextSlug}`}><span className="label">Next →</span>{next.name}</Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
