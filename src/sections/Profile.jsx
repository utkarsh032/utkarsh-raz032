import { useState } from "react";
import { Link } from "react-router-dom";
import { BUILD_DATE, useNow } from "../hooks/useNow";
import { certifications, education, homeCertifications, principles, roles } from "../data/experience";
import { layers } from "../data/stack";
import { profile, resumeDoc } from "../data/profile";
import { ViewLink } from "../components/CredentialBits";
import { DocLink } from "../components/DocViewer";
import { toDoc } from "../utils/docs";
import { Icon } from "../components/Icon";
import { Reveal, Section, SectionHeader } from "../components/Section";
import { WindowBar } from "../components/WindowBar";
import "./Profile.css";

export function Method() {
  return (
    <Section id="method" span="02 · method">
      <SectionHeader id="method" num="02" label="How I work" title="Five steps, each backed by something I've actually done.">
        <p>Anyone can list principles. Each step here points to where it happened.</p>
      </SectionHeader>
      <Reveal className="panel pipe">
        <WindowBar file="workflow / how-i-work.yml">
          <span className="wbar-status" aria-hidden="true"><span className="wbar-led" />{principles.length} stages · passing</span>
        </WindowBar>
        <div className="mtrack">
          <span className="mrail" aria-hidden="true"><span className="mfill" /><span className="mpulse" /></span>
          <ol className="method">
            {principles.map((p, i) => (
              <li className="mstep" key={p.title} style={{ "--i": i }}>
                <div className="mhead">
                  <span className="mnode" aria-hidden="true"><Icon name={p.icon} /></span>
                  <span className="mnum">stage {String(i + 1).padStart(2, "0")}</span>
                  <span className="mok" aria-hidden="true">✓</span>
                </div>
                <div className="mcard">
                  <span className="mghost" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <div className="ev">
                    <b>{p.source}</b>
                    <span><i aria-hidden="true">›</i>{p.evidence}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}

const layerIcon = { ui: "layout", api: "server", data: "database", ship: "rocket" };
const isProd = (t) => Boolean(t.prod);

export function Stack() {
  const [prodOnly, setProdOnly] = useState(false);
  const all = layers.flatMap((l) => l.items);
  const prodCount = all.filter(isProd).length;

  return (
    <Section id="stack" span="03 · stack" band>
      <SectionHeader id="stack" num="03" label="Stack by layer" title="My tech stack, organized by where each tool sits in a request.">
        <p>No skill percentages. Each tool says where I&apos;ve used it, and whether that was in production.</p>
      </SectionHeader>
      <Reveal className={`panel stk${prodOnly ? " prod-only" : ""}`}>
        <WindowBar file="stack ls --group-by=layer">
          <div className="seg" role="group" aria-label="Filter tools">
            <button type="button" aria-pressed={!prodOnly} onClick={() => setProdOnly(false)}>
              all <span>{all.length}</span>
            </button>
            <button type="button" aria-pressed={prodOnly} onClick={() => setProdOnly(true)}>
              prod <span>{prodCount}</span>
            </button>
          </div>
        </WindowBar>
        <div className="layers">
          {layers.map((l, i) => {
            const p = l.items.filter(isProd).length;
            return (
              <section className={`layer L-${l.key}`} key={l.key} aria-labelledby={`layer-${l.key}`} style={{ "--i": i }}>
                <header className="layer-h">
                  <span className="layer-ic" aria-hidden="true"><Icon name={layerIcon[l.key]} /></span>
                  <div>
                    <span className="layer-k">L{i + 1} · {l.tag}</span>
                    <h3 id={`layer-${l.key}`}>{l.name}</h3>
                  </div>
                  <span className="layer-n" aria-label={`${l.items.length} tools`}>{l.items.length}</span>
                </header>
                <div className="layer-m">
                  <span className="bar" aria-hidden="true"><span style={{ width: `${(p / l.items.length) * 100}%` }} /></span>
                  <small>{p}/{l.items.length} in production</small>
                </div>
                <ul>
                  {l.items.map((t) => (
                    <li className={`tech${t.prod ? " is-prod" : ""}`} key={t.name}>
                      <b>{t.name}</b>
                      <span className={`ctx ${t.prod ? "prod" : "proj"}`}>{t.prod ? "PROD" : "PROJ"}</span>
                      <small><i aria-hidden="true">{"// "}</i>{t.where}</small>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <footer className="stk-foot">
          <span className="flow" aria-hidden="true">
            {layers.map((l) => <span key={l.key} className={`L-${l.key}`}>{l.tag}</span>)}
          </span>
          <span className="legend">
            <span><span className="ctx prod">PROD</span> used in a production job</span>
            <span><span className="ctx proj">PROJ</span> used in my own shipped projects</span>
          </span>
        </footer>
      </Reveal>
    </Section>
  );
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Nov 2025 — Present" → "11 mos"; inclusive of both end months. */
function tenure(period, now) {
  const parse = (s) => {
    const m = /([a-z]{3})\w*\s+(\d{4})/i.exec(s);
    return m ? { y: +m[2], m: MONTHS.indexOf(m[1].toLowerCase()) } : null;
  };
  const [from, to] = period.split(/\s+[—–-]\s+/);
  const a = parse(from);
  const b = parse(to ?? "") ?? { y: now.getFullYear(), m: now.getMonth() };
  if (!a || a.m < 0) return null;
  const n = (b.y - a.y) * 12 + (b.m - a.m) + 1;
  if (n < 1) return null;
  const yrs = Math.floor(n / 12);
  const mos = n % 12;
  return [yrs && `${yrs} yr${yrs > 1 ? "s" : ""}`, mos && `${mos} mo${mos > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

export function Experience() {
  // Build date on the first render, the real date after hydration (keeps prerendered HTML in sync).
  const now = useNow() ?? BUILD_DATE;
  const moreCerts = certifications.length - homeCertifications.length;
  return (
    <Section id="experience" span="04 · experience">
      <SectionHeader id="experience" num="04" label="Experience" title="Full-stack developer experience, community work and training." />
      <div className="xp">
        <Reveal className="panel glog">
          <WindowBar file="git log --graph --author=utkarsh">
            <span className="wbar-status" aria-hidden="true"><span className="wbar-led" />shipping</span>
          </WindowBar>
          <ol className="tl">
            {roles.map((r, i) => {
              const t = tenure(r.period, now);
              return (
                <li className={`role${r.current ? " current" : ""}`} key={r.org} style={{ "--i": i }}>
                  <span className="node" aria-hidden="true" />
                  <div className="role-meta">
                    {r.current && <span className="ref">HEAD → current</span>}
                    <span className="when">{r.period}</span>
                    {t && <span className="dur">{t}</span>}
                  </div>
                  <h3>
                    {r.title} <span className="at">@ {r.org}</span>
                  </h3>
                  {r.place && <p className="place">{r.place}</p>}
                  <ul className="diff">
                    {r.points.map((p) => (
                      <li key={p}><i aria-hidden="true">+</i><span>{p}</span></li>
                    ))}
                  </ul>
                  {r.tags && <div className="chips">{r.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal as="aside" className="panel train" aria-label="Education and certifications">
          <WindowBar file="~/credentials">
            <Link className="wbar-link" to="/credentials">
              open<span className="sr-only"> all credentials</span>
              <Icon name="maximize" size={13} />
            </Link>
          </WindowBar>
          <div className="tree">
            <h3><Icon name="folder" size={15} />resume/<span>1</span></h3>
            <ul>
              <li className="tr">
                <span className="tr-ic" aria-hidden="true"><Icon name="doc" size={16} /></span>
                <div>
                  <b>{profile.resume.split("/").pop()}</b>
                  <small>PDF · updated each deploy</small>
                </div>
                <span className="tr-acts">
                  <DocLink className="verify" doc={toDoc(resumeDoc)}>
                    view <span aria-hidden="true">↗</span>
                    <span className="sr-only"> resume</span>
                  </DocLink>
                  <a className="verify" href={profile.resume} download aria-label="Download resume (PDF)">
                    <Icon name="download" size={13} />
                  </a>
                </span>
              </li>
            </ul>
            <h3><Icon name="folder" size={15} />education/<span>{education.length}</span></h3>
            <ul>
              {education.map((e) => (
                <li className="tr" key={e.title}>
                  <span className="tr-ic" aria-hidden="true"><Icon name="cap" size={16} /></span>
                  <div>
                    <b>{e.title}</b>
                    <small>{e.where}</small>
                  </div>
                  {e.href ? <ViewLink set="education" href={e.href} title={`${e.title} certificate`} /> : <span className="tr-when">{e.when}</span>}
                </li>
              ))}
            </ul>
            <h3><Icon name="folder" size={15} />certifications/<span>{certifications.length}</span></h3>
            <ul>
              {homeCertifications.map((c) => (
                <li className="tr" key={c.title}>
                  <span className="tr-ic" aria-hidden="true"><Icon name="badge" size={16} /></span>
                  <div>
                    <b>{c.title}</b>
                    <small>{c.by ?? c.length}</small>
                  </div>
                  {c.href ? (
                    <ViewLink set="certifications" href={c.href} title={`${c.title} certificate`} />
                  ) : (
                    <span className="tr-when">—</span>
                  )}
                </li>
              ))}
              {moreCerts > 0 && (
                <li className="tr tr-more">
                  <Link to="/credentials">+{moreCerts} more <span aria-hidden="true">→</span></Link>
                </li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
