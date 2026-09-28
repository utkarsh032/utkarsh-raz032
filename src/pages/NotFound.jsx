import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function NotFound() {
  const { pathname } = useLocation();
  // The prerendered 404.html serves every unknown URL, so the path is only known in the browser.
  const [path, setPath] = useState(null);
  useEffect(() => setPath(pathname), [pathname]);

  return (
    <section className="section not-found" aria-labelledby="h-404">
      <div className="container" style={{ paddingTop: "var(--nav-h)" }}>
        <p className="label">404 · page not found</p>
        <h1 id="h-404" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.04em", marginTop: 18 }}>
          Nothing is served here
          {path && (
            <>
              {" at "}
              <span className="mono" style={{ color: "var(--blue)", overflowWrap: "anywhere" }}>{path}</span>
            </>
          )}
        </h1>
        <p style={{ marginTop: 18 }}>The page may have moved when the site was rebuilt.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          <Link className="btn btn-primary" to="/">Back to the homepage →</Link>
          <Link className="btn btn-ghost" to="/projects">Browse projects</Link>
        </div>
      </div>
    </section>
  );
}
