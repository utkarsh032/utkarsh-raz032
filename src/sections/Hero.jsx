import github from "../data/github.json";
import { profile } from "../data/profile";
import { useMagnetic } from "../hooks/motion";
import { Console } from "../components/Console/Console";
import { Icon } from "../components/Icon";
import "./Hero.css";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();

export function Hero() {
  const primary = useMagnetic();
  const readout = [
    { value: "Nov 2025", label: "Shipping production code since" },
    { value: github.publicRepos, label: "Public repositories on GitHub" },
    { value: github.flagship.commits, label: "Commits to NOTO since Aug 2026" },
    { value: "3 → 1", label: "Platforms from one codebase" },
  ];

  return (
    <section className="hero" id="top" aria-labelledby="h-hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <h1 id="h-hero">
              <span className="idline">
                <span className="dot" aria-hidden="true" />
                {profile.name}, {profile.role.toLowerCase()} <span aria-hidden="true">·</span> {profile.location}
              </span>
              <span className="h1-line">
                From the click
                <br />
                to the <em>query.</em>
              </span>
            </h1>
            <p className="hero-sub">
              I build web software across the whole request: <strong>Angular and React</strong> interfaces,{" "}
              <strong>.NET and Node.js</strong> REST APIs, and the <strong>SQL Server</strong> database underneath. By day I ship production
              features across that stack. On my own time I&apos;m building NOTO, a local-first notes app that runs on web,
              desktop and Android from one codebase.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#work" ref={primary}>
                See the systems <span aria-hidden="true">→</span>
              </a>
              <a className="btn btn-ghost" href="#contact">Get in touch</a>
              <div className="hero-social">
                <a className="icon-btn" href={profile.links.github} target="_blank" rel="noopener" aria-label="GitHub">
                  <Icon name="github" />
                </a>
                <a className="icon-btn" href={profile.links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                  <Icon name="linkedin" />
                </a>
                <a className="icon-btn" href="#contact" aria-label="Email address">
                  <Icon name="mail" />
                </a>
              </div>
            </div>
          </div>
          <Console />
        </div>

        <dl className="readout">
          {readout.map((r) => (
            <div key={r.label}>
              <dt className="sr-only">{r.label}</dt>
              <dd>
                <b>{r.value}</b>
                <span aria-hidden="true">{r.label}</span>
              </dd>
            </div>
          ))}
          <p className="readout-meta">SOURCE: GITHUB + RESUME · AS OF {formatDate(github.updated)} · REFRESHED ON EACH DEPLOY</p>
        </dl>
      </div>
    </section>
  );
}
