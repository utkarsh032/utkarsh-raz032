import { ringPoints } from "../../utils/ring";

// Ring radii, as percentages of the box. Narrower than tall so the labels at either side stay inside it.
const RX = 32;
const RY = 38;

/**
 * Items placed on a ring around a hub. `chords` are pairs of ids joined across the ring;
 * `loop` draws the ring itself, flowing in reading order, and numbers the items.
 * On narrow screens the ring becomes a wrapping list of the same buttons.
 */
export function RingMap({ items, active, onSelect, hub, chords = [], loop = false, label }) {
  const pts = ringPoints(items.length, RX, RY);
  const at = Object.fromEntries(items.map((it, i) => [it.id, pts[i]]));
  const near = new Set(chords.flat());

  return (
    <div className="by-ring">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {loop ? (
          <ellipse className="flow" cx="50" cy="50" rx={RX} ry={RY} />
        ) : (
          items.map((it) => (
            <line key={it.id} x1="50" y1="50" x2={at[it.id][0]} y2={at[it.id][1]} className={it.id === active ? "on" : undefined} />
          ))
        )}
        {chords.map(([a, b]) => (
          <line key={a + b} className="flow" x1={at[a][0]} y1={at[a][1]} x2={at[b][0]} y2={at[b][1]} />
        ))}
      </svg>
      <span className="by-hub" aria-hidden="true">{hub}</span>
      <ul aria-label={label}>
        {items.map((it, i) => (
          <li key={it.id} style={{ left: `${pts[i][0]}%`, top: `${pts[i][1]}%` }}>
            <button
              type="button"
              className={`by-node${near.has(it.id) && it.id !== active ? " is-near" : ""}`}
              aria-pressed={it.id === active}
              style={{ "--w": it.weight ?? 2 }}
              onClick={() => onSelect(it.id)}
            >
              {loop && <span className="by-node-no" aria-hidden="true">{i + 1}</span>}
              {it.label}
              {it.badge != null && <span className="by-node-badge" aria-hidden="true">{it.badge}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
