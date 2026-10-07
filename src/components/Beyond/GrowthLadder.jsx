import { Link } from "react-router-dom";
import { projectBySlug } from "../../data/projects";
import { Reveal } from "../Section";

const facets = [
  ["tech", "Technology"],
  ["responsibility", "Responsibility"],
  ["complexity", "Complexity"],
  ["ownership", "Ownership"],
];

/** A career as widening scope instead of a list of years. The bar under each stage grows with it. */
export function GrowthLadder({ stages }) {
  return (
    <ol className="by-growth">
      {stages.map((g, i) => (
        <Reveal as="li" key={g.title} style={{ "--i": i, "--n": stages.length }}>
          <div>
            <p className="label">{g.when}</p>
            <h3>{g.title}</h3>
            <i className="by-scope" aria-hidden="true" />
          </div>
          <dl>
            {facets.map(([key, label]) => (
              <div key={key}><dt>{label}</dt><dd>{g[key]}</dd></div>
            ))}
          </dl>
          <p className="by-growth-foot">
            {g.projects?.map((slug) => (
              <Link key={slug} className="chip" to={`/projects/${slug}`}>{projectBySlug[slug].name}</Link>
            ))}
            {g.also && <span>{g.also}</span>}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
