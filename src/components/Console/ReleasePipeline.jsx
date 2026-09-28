// The gates NOTO's release script runs before packaging (from the NOTO README).
const gates = ["lint", "typecheck", "vitest", "playwright e2e", "bake env", "package"];

export function ReleasePipeline() {
  return (
    <>
      <div className="pipe-h">
        <span>noto · pnpm release:desktop</span>
        <span className="pipe-arg">-Environment Staging</span>
      </div>
      <ol className="pipe" aria-label="Release gates">
        {gates.map((g, i) => (
          <li className="step" key={g}>
            <span className="ck" aria-hidden="true">✓</span>
            <span>{g}</span>
            <span className="meter" aria-hidden="true"><i style={{ animationDelay: `${0.1 + i * 0.3}s` }} /></span>
            <span className="pc">pass</span>
          </li>
        ))}
      </ol>
      <p className="pipe-out">
        A build with no environment set <span className="warn">fails</span> instead of guessing. You can&apos;t tell a
        package built for the wrong update feed from its file name.
      </p>
    </>
  );
}
