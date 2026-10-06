import { useEffect, useState } from "react";
import { layerNames, layerOrder } from "../../data/projects";
import { prefersReducedMotion, useOnEnter } from "../../hooks/motion";
import { useTabs } from "../../hooks/useTabs";
import { copyText } from "../../utils/clipboard";
import { Icon } from "../Icon";
import { Reveal } from "../Section";

const COUNT_MS = 900;

/** Counts up to `value` the first time it scrolls into view. Without JS it shows the final number. */
export function Counter({ value }) {
  const ref = useOnEnter((el) => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      el.textContent = Math.round(value * (1 - (1 - t) ** 3)).toLocaleString("en");
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  });
  return <span ref={ref}>{value.toLocaleString("en")}</span>;
}

export function CopyButton({ text, label }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button type="button" className={`px-copy${done ? " is-done" : ""}`} aria-label={label} onClick={async () => setDone(await copyText(text))}>
      <Icon name={done ? "check" : "copy"} size={14} />
      <span className="sr-only" role="status">{done ? "Copied" : ""}</span>
    </button>
  );
}

const isComment = (line) => /^\s*(\/\/|--|#|\/?\*)/.test(line);

/** A verbatim excerpt from the project's repository, numbered as it is in the file. */
export function CodeBlock({ code }) {
  return (
    <figure className="px-code">
      <figcaption>
        <span>{code.file}</span>
        <CopyButton text={code.text} label={`Copy the excerpt from ${code.file}`} />
      </figcaption>
      <pre tabIndex={0} role="region" aria-label={`Code from ${code.file}`}>
        <code style={{ counterReset: `ln ${code.from - 1}` }}>
          {code.text.split("\n").map((line, i) => (
            <span key={i} className={isComment(line) ? "cm" : undefined}>{line}{"\n"}</span>
          ))}
        </code>
      </pre>
      {code.note && <p className="px-code-note">{code.note}</p>}
    </figure>
  );
}

/** The stack as lanes, one per layer. A technology with a note explains what it does here. */
export function StackLanes({ stack, notes = {} }) {
  const layers = layerOrder.filter((l) => stack[l]?.length);
  const [active, setActive] = useState(() => layers.flatMap((l) => stack[l]).find((t) => notes[t]) ?? null);
  return (
    <Reveal className="px-lanes">
      {layers.map((l) => (
        <div key={l} className={`px-lane L-${l}`}>
          <h3>{layerNames[l]}</h3>
          <ul>
            {stack[l].map((t) => (
              <li key={t}>
                {notes[t] ? (
                  <button
                    type="button"
                    className="chip px-tech"
                    aria-pressed={active === t}
                    onClick={() => setActive(t)}
                    onMouseEnter={() => setActive(t)}
                    onFocus={() => setActive(t)}
                  >
                    {t}
                  </button>
                ) : (
                  <span className="chip">{t}</span>
                )}
              </li>
            ))}
          </ul>
          {stack[l].includes(active) && (
            <p className="px-lane-note" aria-live="polite"><b>{active}</b>{notes[active]}</p>
          )}
        </div>
      ))}
    </Reveal>
  );
}

/** Features as a tab list: what the user sees on one side, what happens underneath on the other. */
export function FeatureDeck({ features, labels = ["On screen", "Under the hood"] }) {
  const { selected, getTabProps } = useTabs(features.map((f) => f.title), undefined, undefined, true);
  return (
    <Reveal className="px-deck">
      <div className="px-deck-tabs" role="tablist" aria-label="Features" aria-orientation="vertical">
        {features.map((f, i) => (
          <button key={f.title} id={`fd-t${i}`} aria-controls={`fd-p${i}`} className="px-deck-tab" {...getTabProps(f.title, i)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.title}
          </button>
        ))}
      </div>
      {features.map((f, i) => (
        <div key={f.title} className="px-deck-panel" role="tabpanel" id={`fd-p${i}`} aria-labelledby={`fd-t${i}`} hidden={selected !== f.title}>
          <div>
            <p className="label">{labels[0]}</p>
            <p>{f.sees}</p>
          </div>
          <div>
            <p className="label">{labels[1]}</p>
            <ol>{f.under.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
        </div>
      ))}
    </Reveal>
  );
}

const ALL = "All";

/** REST reference with a router filter. Each row can copy its path, or its full URL when the API is live. */
export function ApiExplorer({ api, origin }) {
  const [group, setGroup] = useState(ALL);
  const guarded = api.groups.some((g) => g.endpoints.some((e) => e[3]));
  const shown = api.groups.filter((g) => group === ALL || g.name === group);
  return (
    <div className="px-api">
      <div className="px-filters" role="group" aria-label="Filter by router">
        {[ALL, ...api.groups.map((g) => g.name)].map((name) => (
          <button key={name} type="button" className="px-filter" aria-pressed={group === name} onClick={() => setGroup(name)}>
            {name}
            <span>{name === ALL ? api.groups.reduce((n, g) => n + g.endpoints.length, 0) : api.groups.find((g) => g.name === name).endpoints.length}</span>
          </button>
        ))}
      </div>
      {shown.map((g) => (
        <div className="px-table" key={g.name}>
          <table>
            <caption>
              {g.name}
              {(api.base || g.prefix) && <code>{api.base}{g.prefix}</code>}
            </caption>
            <thead>
              <tr>
                <th scope="col">Method</th>
                <th scope="col">Endpoint</th>
                <th scope="col">Purpose</th>
                {guarded && <th scope="col">Guard</th>}
                <th scope="col"><span className="sr-only">Copy</span></th>
              </tr>
            </thead>
            <tbody>
              {g.endpoints.map(([m, path, label, guard]) => {
                const full = `${api.base}${g.prefix}${path === "/" && (api.base || g.prefix) ? "" : path}`;
                return (
                  <tr key={m + path}>
                    <td><span className={`http http-${m.toLowerCase()}`}>{m}</span></td>
                    <td><code>{full}</code></td>
                    <td>{label}</td>
                    {guarded && <td className="px-guard">{guard ?? "public"}</td>}
                    <td><CopyButton text={origin ? `${origin}${full}` : full} label={`Copy ${m} ${full}`} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const phases = [
  ["problem", "Problem"],
  ["investigation", "Investigation"],
  ["solution", "Solution"],
  ["result", "Result"],
];

/** Engineering postmortems. A phase with nothing recorded stays visible as a TODO, never filled in. */
export function Postmortems({ items }) {
  return (
    <div className="px-pms">
      {items.map((c, i) => (
        <Reveal as="article" className="px-pm" key={c.title}>
          <header>
            <span className="label">PM-{String(i + 1).padStart(2, "0")}</span>
            <h3>{c.title}</h3>
          </header>
          <ol className="px-pm-steps">
            {phases.map(([key, label]) => (
              <li key={key} className={`pm-${key}`}>
                <span className="label">{label}</span>
                {c[key] ? <p>{c[key]}</p> : <p className="todo">TODO · not recorded</p>}
              </li>
            ))}
          </ol>
          {c.source && <p className="px-pm-src">Source: {c.source}</p>}
        </Reveal>
      ))}
    </div>
  );
}

/** Tabbed technical reference. Every panel is in the HTML, so prerendered pages carry all of it. */
export function Reference({ tabs }) {
  const { selected, getTabProps } = useTabs(tabs.map((t) => t.id));
  return (
    <div className="px-ref">
      <div className="px-tabs" role="tablist" aria-label="Technical reference">
        {tabs.map((t, i) => (
          <button key={t.id} id={`rf-t-${t.id}`} aria-controls={`rf-p-${t.id}`} className="px-tab" {...getTabProps(t.id, i)}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} className="px-panel" role="tabpanel" id={`rf-p-${t.id}`} aria-labelledby={`rf-t-${t.id}`} hidden={selected !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
