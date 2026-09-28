import { useId } from "react";
import { useReveal } from "../hooks/motion";
import "./ArchDiagram.css";

const tone = { ui: "var(--blue)", api: "var(--violet)", data: "var(--cyan)", ship: "var(--magenta)" };

/**
 * Data-driven architecture diagram. Edges draw in when the diagram enters
 * the viewport, then data flows slowly along them. Text alternative via <title>/<desc>.
 */
export function ArchDiagram({ diagram, note }) {
  const ref = useReveal("drawn");
  const id = useId();
  return (
    <figure className="diagram" ref={ref}>
      <div className="diagram-scroll">
        <svg viewBox={diagram.viewBox} role="img" aria-labelledby={`${id}t ${id}d`}>
          <title id={`${id}t`}>{diagram.title}</title>
          <desc id={`${id}d`}>{diagram.desc}</desc>
          <g>
            {diagram.edges.map((e, i) => (
              <path key={i} className="edge" d={e.d} stroke={tone[e.tone]} style={{ transitionDelay: `${i * 0.08}s` }} />
            ))}
          </g>
          {diagram.nodes.map((n) => {
            const cx = n.x + n.w / 2;
            const tall = Boolean(n.ctx);
            return (
              <g key={n.title} className="node">
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" style={n.tone ? { stroke: tone[n.tone] } : undefined} />
                <text x={cx} y={n.y + (tall ? 23 : 21)} className="n-title">{n.title}</text>
                {tall && <text x={cx} y={n.y + 42} className="n-ctx">{n.ctx}</text>}
                <text x={cx} y={n.y + (tall ? 62 : 37)} className="n-sub">{n.sub}</text>
              </g>
            );
          })}
          {diagram.footnote && (
            <text x="20" y="306" className="n-foot">{diagram.footnote}</text>
          )}
        </svg>
      </div>
      {note && <figcaption>{note}</figcaption>}
    </figure>
  );
}
