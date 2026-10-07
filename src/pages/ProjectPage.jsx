import { useMemo } from "react";
import { Link } from "react-router-dom";
import github from "../data/github.json";
import { caseStudies } from "../data/caseStudies";
import { flatStack, layerNames, layerOrder, projects, systemFromFlow } from "../data/projects";
import { useMagnetic, useSpotlight } from "../hooks/motion";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Section";
import { Chapters } from "../components/Chapters";
import { CodeBlock } from "../components/CodeBlock";
import { Counter } from "../components/Counter";
import { SystemMap } from "../components/SystemMap";
import { ApiExplorer, FeatureDeck, Postmortems, Reference, StackLanes } from "../components/Project/Parts";
import { Signature } from "../components/Project/Signature";
import "../styles/tint.css";
import "./ProjectPage.css";

const Todo = ({ children }) => <p className="todo">TODO · {children}</p>;

const COUNT = ["no", "one", "two", "three", "four", "five"];
const others = (n) => `${COUNT[n] ?? n} other contributor${n === 1 ? "" : "s"}`;

const isLive = (l) => l.label.startsWith("Live");
const isRepo = (l) => l.href.includes("github.com");

/** Headline numbers. Case studies supply their own; otherwise they are counted from the project data. */
function factsFor(p, cs) {
  if (cs?.facts) {
    const flagship = github.flagship.name.toLowerCase() === p.slug;
    return flagship ? [...cs.facts, { value: github.flagship.commits, label: "Commits on GitHub" }] : cs.facts;
  }
  const endpoints = p.api?.groups.reduce((n, g) => n + g.endpoints.length, 0);
  return [
    endpoints && { value: endpoints, label: "REST endpoints" },
    p.graphql && { value: p.graphql.queries.length + p.graphql.mutations.length, label: "GraphQL operations" },
    p.models && { value: p.models.length, label: "Data models" },
    p.features && { value: p.features.length, label: "Features" },
    p.flow && { value: p.flow.length, label: "Stages, end to end" },
    { value: flatStack(p).length, label: "Technologies" },
  ]
    .filter(Boolean)
    .slice(0, 4);
}

/** Projects that share the category or the most stack items, for internal linking. */
function related(p, skip) {
  const mine = new Set(flatStack(p));
  return projects
    .filter((o) => o !== p && !skip.includes(o))
    .map((o) => ({ o, score: (o.category === p.category ? 3 : 0) + flatStack(o).filter((t) => mine.has(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.o);
}

function Hero({ p, cs, facts }) {
  const spot = useSpotlight();
  const primary = useMagnetic();
  const live = p.links.find(isLive);
  const repo = p.links.find(isRepo);
  const meta = [
    ["Role", cs?.role ?? (p.team ? "Team project" : "Solo build")],
    ["Timeline", cs?.timeframe ?? p.timeline],
    ["Type", `${p.category} · ${p.language}`],
    ["Status", cs?.status ?? (p.live ? "Live" : "Source available")],
  ];

  return (
    <header className="px-hero" ref={spot}>
      <span className="px-glow" aria-hidden="true" />
      <div className="container">
        <Breadcrumbs trail={[["Home", "/"], ["Projects", "/projects"], [p.name, `/projects/${p.slug}`]]} />
        <div className="px-hero-grid">
          <div>
            <p className="px-kicker">
              <span className="label">{p.category} · {p.year}</span>
              {p.live && <span className="px-status"><i aria-hidden="true" />Live</span>}
              {p.caseStudy && <span className="chip">Case study</span>}
            </p>
            <h1>{p.name}</h1>
            <p className="px-one">{cs?.oneLine ?? p.summary}</p>
            <div className="px-cta">
              {live && (
                <a className="btn btn-primary" ref={primary} href={live.href} target="_blank" rel="noopener">
                  Open live {live.label === "Live API" ? "API" : "demo"} <span aria-hidden="true">↗</span>
                </a>
              )}
              {repo && (
                <a className={`btn ${live ? "btn-ghost" : "btn-primary"}`} ref={live ? undefined : primary} href={repo.href} target="_blank" rel="noopener">
                  <Icon name="github" size={16} /> Source on GitHub
                </a>
              )}
              <a className="btn btn-ghost" href="#brief">
                Read the breakdown <span aria-hidden="true">↓</span>
              </a>
            </div>
            <dl className="px-meta">
              {meta.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
          <Signature project={p} />
        </div>

        <dl className="px-readout">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{typeof f.value === "number" ? <Counter value={f.value} /> : f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

function Brief({ p, cs }) {
  const problem = cs?.problem ?? p.problem;
  const approach = cs?.overview ?? p.overview;
  if (!approach) return <Todo>{p.todo}</Todo>;
  return (
    <>
      <Reveal className="px-brief">
        {problem && (
          <>
            <div className="px-problem">
              <p className="label">Problem</p>
              <p>{problem}</p>
            </div>
            <span className="px-brief-link" aria-hidden="true" />
          </>
        )}
        <div className="px-answer">
          <p className="label">Approach</p>
          <p>{approach}</p>
        </div>
      </Reveal>
      {cs?.requirements && (
        <Reveal>
          <h3 className="label px-sub">Requirements</h3>
          <ul className="px-reqs">{cs.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
        </Reveal>
      )}
    </>
  );
}

function Role({ p, cs }) {
  const repo = p.links.find(isRepo);
  const claim =
    cs?.claim ??
    (p.team
      ? `Team project with ${others(p.team.others)}. I authored ${p.team.commits} of the ${p.team.of} commits.`
      : "Solo build. Every commit in the repository is mine, across each layer below.");
  // Without a written breakdown, ownership is shown as the layers the project covers.
  const areas =
    cs?.ownership ??
    layerOrder.filter((l) => p.stack[l]?.length).map((l) => ({ title: layerNames[l], layer: l, tech: p.stack[l] }));

  return (
    <div className="px-role">
      <Reveal className="px-role-card">
        <p className="px-role-big">{claim}</p>
        {cs?.credit && (
          <p className="px-credit">
            {cs.credit.text}{" "}
            <a className="lnk" href={cs.credit.href} target="_blank" rel="noopener">{cs.credit.label} ↗</a>
          </p>
        )}
        <dl>
          <div><dt>Role</dt><dd>{cs?.role ?? (p.team ? "Team project" : "Solo build")}</dd></div>
          <div><dt>Timeline</dt><dd>{cs?.timeframe ?? p.timeline}</dd></div>
          {repo && (
            <div>
              <dt>Evidence</dt>
              <dd><a className="lnk" href={`${repo.href}/commits`} target="_blank" rel="noopener">Commit history ↗</a></dd>
            </div>
          )}
        </dl>
        {p.team && !cs?.ownership && <Todo>List the parts of this project you built</Todo>}
      </Reveal>
      <ul className="px-areas">
        {areas.map((a, k) => (
          <Reveal as="li" key={a.title} className={`px-area L-${a.layer}`} style={{ transitionDelay: `${k * 60}ms` }}>
            <h3>{a.title}</h3>
            {a.body && <p>{a.body}</p>}
            {a.tech && <ul className="chips">{a.tech.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>}
            {a.evidence && <small>{a.evidence}</small>}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function Decisions({ p, cs }) {
  if (cs?.decisions) {
    return (
      <div className="px-adrs">
        {cs.decisions.map((d, k) => (
          <Reveal as="details" className="px-adr" key={d.title} open={k === 0}>
            <summary>
              <span className="label">ADR {String(k + 1).padStart(3, "0")}</span>
              <h3>{d.title}</h3>
            </summary>
            <dl>
              <dt>Context</dt><dd>{d.context}</dd>
              <dt>Decision</dt><dd>{d.decision}</dd>
              <dt>Consequence</dt><dd>{d.consequence}</dd>
            </dl>
          </Reveal>
        ))}
      </div>
    );
  }
  return (
    <div className="px-notes">
      {p.highlights.map((h, k) => (
        <Reveal className="px-note" key={h.title} style={{ transitionDelay: `${(k % 2) * 80}ms` }}>
          <h3>{h.title}</h3>
          <p>{h.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

function referenceTabs(p, cs) {
  const live = p.links.find((l) => l.label === "Live API");
  return [
    ...(cs?.deepDive ?? []).map((d) => ({
      id: d.id,
      label: d.label,
      content: (
        <div className="px-dive">
          <h3>{d.title}</h3>
          <p>{d.body}</p>
          {d.points && <ul className="bullets">{d.points.map((x) => <li key={x}>{x}</li>)}</ul>}
          {d.code && <CodeBlock code={d.code} />}
        </div>
      ),
    })),
    p.api && {
      id: "api",
      label: "REST API",
      content: (
        <>
          <p className="px-note-line">
            {p.api.groups.reduce((n, g) => n + g.endpoints.length, 0)} endpoints
            {p.api.base && <> under <code>{p.api.base}</code></>}, taken from the route files in the repository.
          </p>
          <ApiExplorer api={p.api} origin={live?.href.replace(/\/$/, "")} />
        </>
      ),
    },
    p.graphql && {
      id: "graphql",
      label: "GraphQL",
      content: (
        <>
          <p className="px-note-line">
            One endpoint at <code>{p.graphql.endpoint}</code>, with {p.graphql.queries.length} queries and{" "}
            {p.graphql.mutations.length} mutations defined in the schema.
          </p>
          {[["Queries", p.graphql.queries], ["Mutations", p.graphql.mutations]].map(([kind, ops]) => (
            <div className="px-table" key={kind}>
              <table>
                <caption>{kind}</caption>
                <thead>
                  <tr><th scope="col">Operation</th><th scope="col">Returns</th></tr>
                </thead>
                <tbody>
                  {ops.map(([name, label]) => (
                    <tr key={name}><td><code>{name}</code></td><td>{label}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      ),
    },
    p.models && {
      id: "models",
      label: "Data model",
      content: (
        <div className="px-models">
          {p.models.map((m) => (
            <div className="px-model" key={m.name}>
              <h3><code>{m.name}</code><span>{m.fields.length} fields</span></h3>
              <ul>{m.fields.map((f) => <li key={f}><code>{f}</code></li>)}</ul>
            </div>
          ))}
        </div>
      ),
    },
  ].filter(Boolean);
}

function Results({ cs }) {
  return (
    <>
      {cs.results ? (
        <Reveal as="dl" className="px-results">
          {cs.results.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{typeof r.value === "number" ? <Counter value={r.value} /> : r.value}</dd>
            </div>
          ))}
        </Reveal>
      ) : (
        <Todo>Add measured results only (users, timings, releases). Nothing estimated.</Todo>
      )}
      {cs.outcome && <p className="px-prose">{cs.outcome}</p>}
      <h3 className="label px-sub">Lessons</h3>
      {cs.lessons ? <p className="px-prose">{cs.lessons}</p> : <Todo>What would you do differently next time?</Todo>}
    </>
  );
}

function Close({ p, cs, prev, next }) {
  const takeaways = cs?.takeaways ?? p.highlights?.map((h) => h.title) ?? p.points ?? p.features?.slice(0, 3) ?? [];
  return (
    <section className="px-close" aria-labelledby="px-recap-h">
      <div className="container">
        <Reveal className="px-recap">
          <div>
            <p className="label">Recap</p>
            <h2 id="px-recap-h">{p.name}, in one screen.</h2>
            <div className="px-cta">
              {p.links.map((l) => (
                <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener">
                  {l.label === "Code" ? "Source on GitHub" : l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <dl>
            <div><dt>Built</dt><dd>{p.summary}</dd></div>
            <div><dt>My part</dt><dd>{cs?.role ?? (p.team ? `${p.team.commits} of ${p.team.of} commits in a team of ${p.team.others + 1}` : "Solo build")}</dd></div>
            {takeaways.length > 0 && (
              <div>
                <dt>Highlights</dt>
                <dd><ul className="bullets">{takeaways.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul></dd>
              </div>
            )}
            <div>
              <dt>Stack</dt>
              <dd><ul className="chips">{flatStack(p).map((t) => <li className="chip" key={t}>{t}</li>)}</ul></dd>
            </div>
          </dl>
        </Reveal>

        <nav className="px-nextnav" aria-label="Previous and next project">
          <Link className="px-prev" to={`/projects/${prev.slug}`}>
            <span className="label">← Previous</span>
            <b>{prev.name}</b>
            <span>{prev.tagline}</span>
          </Link>
          {/* Tinted with the next project's own accent, so the handover starts here. */}
          <Link className={`px-next tint px-${next.look.kind}`} style={{ "--ph": next.look.hue }} to={`/projects/${next.slug}`}>
            <span className="label">Next project</span>
            <b>{next.name}</b>
            <span>{next.tagline}</span>
            <i className="px-next-go" aria-hidden="true">→</i>
          </Link>
        </nav>

        <div className="px-related">
          <h2 className="label">Related projects</h2>
          <ul>
            {related(p, [prev, next]).map((r) => (
              <li key={r.slug}>
                <Link to={`/projects/${r.slug}`}>
                  <b>{r.name}</b>
                  <span>{r.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** /projects/:slug. One page for every project: sections appear only where the project has data for them. */
export default function ProjectPage({ project: p }) {
  const cs = caseStudies[p.slug];
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const system = useMemo(() => cs?.system ?? (p.flow ? systemFromFlow(p) : null), [p, cs]);
  const features = cs?.features ?? p.features;
  const tabs = referenceTabs(p, cs);
  const t = cs?.titles ?? {};

  // Chapters in reading order; only the ones this project has content for.
  const chapters = [
    {
      id: "brief",
      label: "Brief",
      title: t.brief ?? "The problem, and the approach.",
      body: <Brief p={p} cs={cs} />,
    },
    {
      id: "role",
      label: "My role",
      title: t.role ?? (p.team ? "My part in the team." : "What I owned."),
      body: <Role p={p} cs={cs} />,
    },
    system && {
      id: "architecture",
      label: "Architecture",
      title: t.system ?? "How the system fits together.",
      lead: "Select a component to see what it owns and what it talks to, or play a trace to follow one path through the system.",
      body: <Reveal><SystemMap system={system} stack={cs?.system ? undefined : p.stack} /></Reveal>,
    },
    {
      id: "stack",
      label: "Stack",
      title: t.stack ?? "The stack, layer by layer.",
      lead: cs?.stackNotes && "Select a technology to see what it does in this system.",
      body: <StackLanes stack={p.stack} notes={cs?.stackNotes} />,
    },
    features?.length > 0 && {
      id: "features",
      label: "Features",
      title: t.features ?? "What it does.",
      lead: cs?.features && !cs.featureLabels && "Each feature twice: what the user sees, and what the code does to make it happen.",
      body: cs?.features ? (
        <FeatureDeck features={cs.features} labels={cs.featureLabels} />
      ) : (
        <ul className="px-feats">
          {features.map((f, k) => (
            <Reveal as="li" key={f} style={{ transitionDelay: `${(k % 2) * 80}ms` }}>{f}</Reveal>
          ))}
        </ul>
      ),
    },
    (cs?.decisions || p.highlights?.length > 0) && {
      id: "decisions",
      label: "Decisions",
      title: t.decisions ?? (cs?.decisions ? "Decisions, and what each one cost." : "Engineering notes."),
      body: <Decisions p={p} cs={cs} />,
    },
    cs && {
      id: "challenges",
      label: "Challenges",
      title: t.challenges ?? "What broke, and what fixed it.",
      lead: cs.challenges && "Written as postmortems: the problem, how it was tracked down, the fix and what changed.",
      body: cs.challenges ? <Postmortems items={cs.challenges} /> : <Todo>Describe the hardest problem in this project and how you solved it</Todo>,
    },
    tabs.length > 0 && {
      id: "reference",
      label: "Deep dive",
      title: t.reference ?? "Technical reference.",
      body: <Reveal><Reference tabs={tabs} /></Reveal>,
    },
    cs && {
      id: "results",
      label: "Results",
      title: t.results ?? "What shipped.",
      body: <Results cs={cs} />,
    },
  ].filter(Boolean);

  return (
    <article className={`px tint px-${p.look.kind}`} style={{ "--ph": p.look.hue }}>
      <Hero p={p} cs={cs} facts={factsFor(p, cs)} />
      <Chapters chapters={chapters}>{p.overview && p.todo && <Todo>{p.todo}</Todo>}</Chapters>
      <Close p={p} cs={cs} prev={prev} next={next} />
    </article>
  );
}
