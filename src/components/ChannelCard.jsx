import { Icon } from "./Icon";
import { Reveal } from "./Section";
import "./ChannelCard.css";

export function ChannelCard({ channel: c }) {
  const head = (
    <>
      <span className="bc-ic" aria-hidden="true"><Icon name={c.icon ?? c.id} size={20} /></span>
      <span className="bc-name">{c.name}</span>
      <span className="bc-handle">{c.href ? c.handle : "coming soon"}</span>
    </>
  );

  // Channels without a link yet render as a plain card rather than a dead link.
  if (!c.href) {
    return (
      <Reveal as="li" className={`bc-card bc-soon bc-${c.id}`}>
        <div className="bc-main">{head}</div>
        <p className="bc-blurb">{c.blurb || "Coming soon."}</p>
        <span className="bc-cta mono">soon</span>
      </Reveal>
    );
  }

  return (
    <Reveal as="li" className={`bc-card bc-${c.id}`}>
      <a className="bc-main" href={c.href} target="_blank" rel="noopener">
        {head}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="bc-blurb">{c.blurb}</p>
      {c.featured && (
        <a className="bc-feat" href={c.featured.href} target="_blank" rel="noopener">
          <span className="label">Latest</span>
          <span className="bc-feat-t">{c.featured.title}</span>
        </a>
      )}
      <span className="bc-cta mono" aria-hidden="true">{c.verb} ↗</span>
    </Reveal>
  );
}
