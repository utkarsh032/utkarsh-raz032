import { useTabs } from "../../hooks/useTabs";
import { Sources } from "./Figure";

/**
 * Decisions as records: what was required, what constrained it, the two options,
 * and the part most write-ups leave out, which is what the chosen one cost.
 */
export function TradeOffs({ items }) {
  const { selected, getTabProps } = useTabs(items.map((t) => t.id), undefined, undefined, true);

  return (
    <div className="by-trade">
      <div className="by-picks" role="tablist" aria-label="Decisions" aria-orientation="vertical">
        {items.map((t, i) => (
          <button key={t.id} id={`td-t-${t.id}`} aria-controls={`td-p-${t.id}`} className="by-pick" {...getTabProps(t.id, i)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {t.title}
          </button>
        ))}
      </div>

      {items.map((t) => (
        <div key={t.id} className="by-trade-panel" role="tabpanel" id={`td-p-${t.id}`} aria-labelledby={`td-t-${t.id}`} hidden={selected !== t.id}>
          <p className="by-axis" style={{ "--x": t.lean ? "86%" : "14%" }}>
            <span className={t.lean === 0 ? "is-lean" : undefined}>{t.axis[0]}</span>
            <i aria-hidden="true" />
            <span className={t.lean === 1 ? "is-lean" : undefined}>{t.axis[1]}</span>
            <span className="sr-only">. This decision favours {t.axis[t.lean].toLowerCase()}.</span>
          </p>
          <dl className="by-record">
            <div><dt>Requirement</dt><dd>{t.requirement}</dd></div>
            <div><dt>Constraint</dt><dd>{t.constraint}</dd></div>
            <div>
              <dt>Options</dt>
              <dd>
                <ul className="by-options">
                  <li>{t.options[0]}<em>not chosen</em></li>
                  <li className="is-chosen">{t.options[1]}<em>chosen</em></li>
                </ul>
              </dd>
            </div>
            <div className="is-gain"><dt>Gained</dt><dd>{t.gained}</dd></div>
            <div className="is-paid"><dt>Paid</dt><dd>{t.paid}</dd></div>
          </dl>
          {t.note && <p className="by-aside">{t.note}</p>}
          <Sources items={[t.source]} />
        </div>
      ))}
    </div>
  );
}
