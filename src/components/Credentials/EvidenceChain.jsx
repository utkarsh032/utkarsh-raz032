import { Link } from "react-router-dom";
import { chain } from "../../data/credentials";
import { Counter } from "../Counter";
import { Reveal } from "../Section";

/** The record as one link in a chain: what was studied, then used, then built, then shipped. Each link is a page. */
export function EvidenceChain() {
  return (
    <Reveal as="ol" className="cr-chain" aria-label="From study to production">
      {chain.map((c) => {
        const inner = (
          <>
            <b>{typeof c.value === "number" ? <Counter value={c.value} /> : c.value}</b>
            <span>{c.label}</span>
            {c.note && <small>{c.note}</small>}
          </>
        );
        return <li key={c.label}>{c.to ? <Link to={c.to}>{inner}</Link> : <a href={c.href}>{inner}</a>}</li>;
      })}
    </Reveal>
  );
}
