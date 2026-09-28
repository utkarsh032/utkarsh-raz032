import { Link } from "react-router-dom";
import { flatStack, layerNames, layerOrder, projects } from "../data/projects";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Flow, LayerStrip } from "../components/ProjectBits";
import { Reveal } from "../components/Section";
import "./Projects.css";

function Block({ n, id, title, children }) {
  return (
    <Reveal as="section" className="pd-sec" id={id} aria-labelledby={`pd-${id}-h`}>
      <p className="label"><b>{String(n).padStart(2, "0")}</b></p>
      <h2 id={`pd-${id}-h`}>{title}</h2>
      {children}
    </Reveal>
  );
}

const Method = ({ m }) => <span className={`http http-${m.toLowerCase()}`}>{m}</span>;

/** Projects that share the category or the most stack items, for internal linking. */
function related(p) {
  const mine = new Set(flatStack(p));
  return projects
    .filter((o) => o !== p)
    .map((o) => ({ o, score: (o.category === p.category ? 3 : 0) + flatStack(o).filter((t) => mine.has(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.o);
}

/** Project page for projects without a long-form case study. */
export default function ProjectDetail({ project: p }) {
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const live = p.links.find((l) => l.label.startsWith("Live"));
  const layers = layerOrder.filter((l) => p.stack[l]?.length);

  // Sections in reading order; only the ones this project has data for.
  const sections = [
    { id: "overview", title: "Overview", show: true },
    { id: "problem", title: "The problem it solves", show: Boolean(p.problem) },
    { id: "features", title: "What it does", show: Boolean(p.features?.length) },
    { id: "flow", title: "How it works", show: Boolean(p.flow) },
    { id: "api", title: "API reference", show: Boolean(p.api) },
    { id: "graphql", title: "GraphQL operations", show: Boolean(p.graphql) },
    { id: "models", title: "Data model", show: Boolean(p.models?.length) },
    { id: "highlights", title: "Engineering highlights", show: Boolean(p.highlights?.length) },
    { id: "stack", title: "Tech stack", show: true },
  ].filter((s) => s.show);
  const num = Object.fromEntries(sections.map((s, k) => [s.id, k + 1]));
  const title = Object.fromEntries(sections.map((s) => [s.id, s.title]));
  const block = (id, children) => (
    <Block n={num[id]} id={id} title={title[id]}>
      {children}
    </Block>
  );

  return (
    <article className="pd">
      <header className="pd-head">
        <div className="container">
          <Breadcrumbs trail={[["Home", "/"], ["Projects", "/projects"], [p.name, `/projects/${p.slug}`]]} />
          <p className="pd-kicker">
            <span className="label">{p.year} · {p.category} · {p.language}</span>
            {p.live && <span className="chip chip-live">● live</span>}
          </p>
          <h1>{p.name}</h1>
          <p className="pd-tag">{p.tagline}</p>
          <p className="pd-sum">{p.summary}</p>
          <div className="pd-actions">
            {live && (
              <a className="btn btn-primary" href={live.href} target="_blank" rel="noopener">
                Open live {live.label === "Live API" ? "API" : "demo"} ↗
              </a>
            )}
            {p.links.filter((l) => l !== live).map((l) => (
              <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noopener">
                {l.label === "Code" ? "View source on GitHub" : l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="container pd-layout">
        <div className="pd-main">
          {block("overview", p.overview ? <p>{p.overview}</p> : <p className="todo">TODO · {p.todo}</p>)}

          {p.problem && block("problem", <p>{p.problem}</p>)}

          {p.features?.length > 0 &&
            block("features", <ul className="pd-features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>)}

          {p.flow && block("flow", <Flow steps={p.flow} label={p.flowLabel} />)}

          {p.api &&
            block(
              "api",
              <>
                <p className="pd-note">
                  {p.api.groups.reduce((n, g) => n + g.endpoints.length, 0)} REST endpoints
                  {p.api.base && <> under <code>{p.api.base}</code></>}, taken from the route files in the repository.
                </p>
                {p.api.groups.map((g) => (
                  <div className="pd-table" key={g.name}>
                    <table>
                      <caption>
                        {g.name}
                        {(p.api.base || g.prefix) && <code>{p.api.base}{g.prefix}</code>}
                      </caption>
                      <thead>
                        <tr><th scope="col">Method</th><th scope="col">Endpoint</th><th scope="col">Purpose</th></tr>
                      </thead>
                      <tbody>
                        {g.endpoints.map(([m, path, label]) => (
                          <tr key={m + path}>
                            <td><Method m={m} /></td>
                            <td><code>{p.api.base}{g.prefix}{path === "/" && (p.api.base || g.prefix) ? "" : path}</code></td>
                            <td>{label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}

          {p.graphql &&
            block(
              "graphql",
              <>
                <p className="pd-note">
                  One endpoint at <code>{p.graphql.endpoint}</code>, with {p.graphql.queries.length} queries and{" "}
                  {p.graphql.mutations.length} mutations defined in the schema.
                </p>
                {[["Queries", p.graphql.queries], ["Mutations", p.graphql.mutations]].map(([kind, ops]) => (
                  <div className="pd-table" key={kind}>
                    <table>
                      <caption>{kind}</caption>
                      <thead>
                        <tr><th scope="col">Operation</th><th scope="col">Returns</th></tr>
                      </thead>
                      <tbody>
                        {ops.map(([name, label]) => (
                          <tr key={name}>
                            <td><code>{name}</code></td>
                            <td>{label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}

          {p.models?.length > 0 &&
            block(
              "models",
              <div className="pd-models">
                {p.models.map((m) => (
                  <div className="pd-model" key={m.name}>
                    <h3><code>{m.name}</code><span>{m.fields.length} fields</span></h3>
                    <ul>{m.fields.map((f) => <li key={f}><code>{f}</code></li>)}</ul>
                  </div>
                ))}
              </div>
            )}

          {p.highlights?.length > 0 &&
            block(
              "highlights",
              <div className="pd-highlights">
                {p.highlights.map((h) => (
                  <div className="pd-hl" key={h.title}>
                    <h3>{h.title}</h3>
                    <p>{h.body}</p>
                  </div>
                ))}
              </div>
            )}

          {block(
            "stack",
            <div className="pd-layers">
              {layers.map((l) => (
                <div key={l} className={`pd-layer L-${l}`}>
                  <h3>{layerNames[l]}</h3>
                  <ul className="chips">{p.stack[l].map((t) => <li className="chip" key={t}>{t}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          <section className="pd-related" aria-labelledby="pd-related-h">
            <h2 id="pd-related-h" className="label">Related projects</h2>
            <ul>
              {related(p).map((r) => (
                <li key={r.slug}>
                  <Link to={`/projects/${r.slug}`}>
                    <span className="label">{r.year} · {r.category}</span>
                    <b>{r.name}</b>
                    <span className="pd-related-tag">{r.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <nav className="pd-next" aria-label="Previous and next project">
            <Link to={`/projects/${prev.slug}`}><span className="label">← Previous</span>{prev.name}</Link>
            <Link to={`/projects/${next.slug}`}><span className="label">Next →</span>{next.name}</Link>
          </nav>
        </div>

        <aside className="pd-aside" aria-label="Project facts">
          <dl>
            <div><dt>Year</dt><dd>{p.year}</dd></div>
            <div><dt>Type</dt><dd>{p.category}</dd></div>
            <div><dt>Language</dt><dd>{p.language}</dd></div>
            <div><dt>Status</dt><dd>{p.live ? "Live" : "Source only"}</dd></div>
          </dl>
          <LayerStrip stack={p.stack} labelled />
          <div className="pd-aside-links">
            {p.links.map((l) => (
              <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <nav className="pd-toc" aria-label="On this page">
            <p className="label">On this page</p>
            <ol>
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ol>
          </nav>
          {p.overview && p.todo && <p className="todo">TODO · {p.todo}</p>}
        </aside>
      </div>
    </article>
  );
}
