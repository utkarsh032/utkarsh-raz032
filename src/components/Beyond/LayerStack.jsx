import { Link } from "react-router-dom";

/**
 * The hero diagram: code is the top layer, and each layer under it is a chapter of the page.
 * It doubles as the table of contents, so every layer is a link.
 */
export function LayerStack({ layers }) {
  return (
    <ol className="by-stack" aria-label="What this page goes through, layer by layer">
      {layers.map((l, i) => {
        const inner = (
          <>
            <span className="by-stack-no">{String(i).padStart(2, "0")}</span>
            <b>{l.label}</b>
            <span className="by-stack-gloss">{l.gloss}</span>
            <i aria-hidden="true">{l.to ? "→" : "↓"}</i>
          </>
        );
        return (
          <li key={l.id} style={{ "--i": i }}>
            {l.to ? <Link to={l.to}>{inner}</Link> : <a href={`#${l.id}`}>{inner}</a>}
            {i === 0 && (
              <p className="by-waterline" aria-hidden="true">
                <span>↑ what a repository shows</span>
                <span>what this page is about ↓</span>
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
