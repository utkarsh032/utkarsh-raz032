// An example request through the stack I work in day to day (Angular → .NET → SQL Server).
// Timings are illustrative and labelled as such in the console footer.
const TOTAL_MS = 200;
const spans = [
  { layer: "ui", tag: "ui", name: "OrdersComponent.load()", start: 0, ms: 11 },
  { layer: "ui", tag: "http", name: "AuthInterceptor · JWT", start: 11, ms: 5, depth: 1 },
  { layer: "api", tag: "api", name: "OrdersController.Get", start: 17, ms: 126, depth: 1 },
  { layer: "api", tag: "svc", name: "OrderService.ListOpen", start: 23, ms: 104, depth: 2, dim: true },
  { layer: "data", tag: "sql", name: "SELECT … WHERE Status=@s", start: 31, ms: 58, depth: 2 },
  { layer: "data", tag: "sql", name: "IX_Orders_Status · seek", start: 31, ms: 7, depth: 2, dim: true, note: "idx" },
  { layer: "ui", tag: "ui", name: "render · 24 rows", start: 156, ms: 17 },
];

const pct = (ms) => `${(ms / TOTAL_MS) * 100}%`;

export function TraceView() {
  return (
    <>
      <div className="req">
        <span className="verb">GET</span>
        <span>/api/orders?status=open</span>
        <span className="req-status"><b>200</b>184 ms</span>
      </div>
      <ol className="spans" aria-label="Request spans">
        {spans.map((s, i) => (
          <li className="span" key={i}>
            <span className={`ly t-${s.layer}`}>{s.tag}</span>
            <span className={`nm d${s.depth ?? 0}`}>{s.name}</span>
            <span className="track">
              <i
                className={`bar b-${s.layer}${s.dim ? " dim" : ""}`}
                style={{ left: pct(s.start), width: pct(s.ms), animationDelay: `${0.1 + i * 0.15}s` }}
                data-ms={s.note ?? `${s.ms}ms`}
              />
              <span className="sr-only">{`${s.ms} milliseconds, starting at ${s.start}`}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="axis" aria-hidden="true">
        <span />
        <span />
        <div><span>0</span><span>50</span><span>100</span><span>150</span><span>ms</span></div>
      </div>
    </>
  );
}
