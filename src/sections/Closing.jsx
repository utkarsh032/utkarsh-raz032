import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BUILD_DATE, useNow } from "../hooks/useNow";
import { Link } from "react-router-dom";
import github from "../data/github.json";
import { profile, navSections, resumeDoc } from "../data/profile";
import { channels, homeChannels, liveChannels } from "../data/channels";
import { ChannelCard } from "../components/ChannelCard";
import { DocLink } from "../components/DocViewer";
import { toDoc } from "../utils/docs";
import { Icon } from "../components/Icon";
import { WindowBar } from "../components/WindowBar";
import { useMagnetic, useOnEnter } from "../hooks/motion";
import { copyText } from "../utils/clipboard";
import { CONTACT_LIMITS, sendMessage } from "../utils/contact";
import { SectionLink } from "../components/SectionLink";
import { Reveal, Section, SectionHeader } from "../components/Section";
import "./Closing.css";

const Calendar = lazy(() => import("../components/ContributionCalendar"));

const shortDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function GitHub() {
  // Only fetch the calendar library and contribution data once the section is near.
  const [near, setNear] = useState(false);
  const ref = useOnEnter(() => setNear(true));

  return (
    <Section id="github" span="05 · github" band>
      <SectionHeader id="github" num="05" label="GitHub" title="Building in public on GitHub.">
        <a className="btn btn-ghost" href={profile.links.github} target="_blank" rel="noopener">github.com/{profile.githubUser} ↗</a>
      </SectionHeader>
      <div className="gh">
        <Reveal className="gh-card gh-cal">
          <div ref={ref} className="gh-cal-inner">
            {near ? (
              <Suspense fallback={<p className="gh-wait">Loading contributions…</p>}>
                <Calendar username={profile.githubUser} />
              </Suspense>
            ) : (
              <p className="gh-wait">Loading contributions…</p>
            )}
          </div>
        </Reveal>
        <Reveal className="gh-card">
          <dl className="ghs">
            <div><dt>Public repositories</dt><dd>{github.publicRepos}</dd></div>
            <div><dt>On GitHub since</dt><dd>{github.since}</dd></div>
            <div><dt>Commits · {github.flagship.name}</dt><dd>{github.flagship.commits}</dd></div>
          </dl>
          <p className="label gh-recent-h">Recently pushed</p>
          <ul className="recent">
            {github.recent.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener">
                  {r.name}
                  <span>{[r.language, shortDate(r.pushed)].filter(Boolean).join(" · ")}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

export function Beyond() {
  const upcoming = channels.length - liveChannels.length;
  return (
    <Section id="beyond" span="06 · beyond">
      <SectionHeader id="beyond" num="06" label="Beyond code" title="Writing, teaching, and practice outside the day job.">
        <p>
          The code is one layer. How I work a problem, trace a bug and price a decision is on its own page.{" "}
          <Link className="lnk" to="/beyond">How I think <span aria-hidden="true">→</span></Link>
        </p>
      </SectionHeader>
      <ul className="bc bc-row">
        {homeChannels.map((c) => <ChannelCard key={c.id} channel={c} />)}
      </ul>
      <Reveal className="more-work">
        <p>
          <b>All {liveChannels.length} channels</b>
          <span>Video, writing, practice and community{upcoming > 0 && `, with ${upcoming} more on the way`}.</span>
        </p>
        <Link className="btn btn-ghost" to="/beyond#channels">
          View all <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </Section>
  );
}

/** Live local time in my timezone, refreshed every 30 seconds. "--:--" until hydrated (see useNow). */
function useLocalTime(timeZone) {
  const now = useNow(30_000);
  return now ? now.toLocaleTimeString("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }) : "--:--";
}

/** Sends a message through the contact function, falling back to the visitor's mail app if the service is down. */
function Composer() {
  const send = useMagnetic();
  const [topic, setTopic] = useState(profile.openTo[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // Honeypot: hidden from people, filled in by bots.
  const [status, setStatus] = useState({ state: "idle" }); // idle | sending | sent | error
  const [note, setNote] = useState("");
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  const who = name.trim();
  const subject = who ? `${topic.subject} from ${who}` : topic.subject;
  const body = [message.trim(), who && `— ${who}`].filter(Boolean).join("\n\n");
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
  const sending = status.state === "sending";

  const copy = async () => setNote((await copyText(profile.email)) ? "Email address copied" : "Select the address to copy");
  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setNote("");
    setStatus({ state: "sending" });
    const res = await sendMessage({ topic: topic.id, name, email, message, company, startedAt: startedAt.current });
    if (res.ok) {
      setStatus({ state: "sent", to: email.trim() });
      setMessage("");
    } else {
      setStatus({ state: "error", error: res.error, retryable: res.retryable });
    }
  };
  const reset = () => {
    startedAt.current = Date.now();
    setStatus({ state: "idle" });
  };

  return (
    <Reveal className="panel compose">
      <WindowBar file="mail / new-message.eml">
        <span className="wbar-status"><span className="wbar-led" aria-hidden="true" />{profile.availability.toLowerCase()}</span>
      </WindowBar>
      {status.state === "sent" ? (
        <div className="compose-sent" role="status">
          <p className="cmd"><b>$</b> sent · 200 OK</p>
          <h3>Message sent.</h3>
          <p>Thanks{who && `, ${who}`}. I&apos;ll reply to <span className="mono">{status.to}</span>, usually within a couple of days.</p>
          <button className="btn btn-ghost btn-sm" type="button" onClick={reset}>Write another</button>
        </div>
      ) : (
        <form className="compose-body" onSubmit={submit} aria-busy={sending}>
          <div className="compose-row">
            <span className="compose-k">to</span>
            <span className="compose-to">{profile.email}</span>
            <button className="compose-copy" type="button" onClick={copy}>copy</button>
          </div>
          <fieldset className="compose-row compose-topics" disabled={sending}>
            <legend className="compose-k">about</legend>
            <div className="topics">
              {profile.openTo.map((t) => (
                <label key={t.id} className="topic">
                  <input type="radio" name="topic" value={t.id} checked={topic.id === t.id} onChange={() => setTopic(t)} />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="compose-row">
            <label className="compose-k" htmlFor="c-name">from</label>
            <input
              id="c-name"
              className="compose-in"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name}
              readOnly={sending}
            />
          </div>
          <div className="compose-row">
            <label className="compose-k" htmlFor="c-email">reply</label>
            <input
              id="c-email"
              className="compose-in"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={CONTACT_LIMITS.email}
              required
              readOnly={sending}
            />
          </div>
          <div className="compose-trap" aria-hidden="true">
            <label htmlFor="c-company">Company</label>
            <input id="c-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <label className="sr-only" htmlFor="c-msg">Message</label>
          <textarea
            id="c-msg"
            className="compose-msg"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What are you building, and where could I help?"
            maxLength={CONTACT_LIMITS.message}
            required
            readOnly={sending}
          />
          <div className="compose-foot">
            <p className="compose-hint">Sent straight to my inbox. Your email is only used to reply.</p>
            <button className="btn btn-primary" type="submit" ref={send} disabled={sending}>
              {sending ? "Sending…" : "Send message"} <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className={`mail-note${status.state === "error" ? " is-error" : ""}`} role="status">
            {status.state === "error" ? (
              <>
                {status.error}
                {status.retryable && <> <a href={mailto}>Open in your email app instead →</a></>}
              </>
            ) : note}
          </p>
        </form>
      )}
    </Reveal>
  );
}

export function Contact() {
  const time = useLocalTime(profile.timezone);

  return (
    <Section id="contact" span="07 · contact" className="contact">
      <div className="ct">
        <div className="ct-intro">
          <p className="cmd"><b>$</b> ./contact --open</p>
          <h2 id="h-contact">Have a problem worth solving?</h2>
          <p className="contact-lede">
            I&apos;m interested in engineering problems, products that need building properly, and full-stack roles where
            I can own features from the click to the query.
          </p>

          <dl className="ct-facts">
            <div>
              <dt>Status</dt>
              <dd>{profile.available && <span className="dot" aria-hidden="true" />}{profile.availability}</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Local time</dt>
              <dd><span className="mono">{time}</span> <small>{profile.timezoneLabel}</small></dd>
            </div>
          </dl>

          <p className="label ct-elsewhere">Elsewhere</p>
          <ul className="ct-links">
            <li><a href={profile.links.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" size={16} />LinkedIn</a></li>
            <li><a href={profile.links.github} target="_blank" rel="noopener"><Icon name="github" size={16} />GitHub</a></li>
            {liveChannels.map((c) => (
              <li key={c.id}><a href={c.href} target="_blank" rel="noopener"><Icon name={c.icon ?? c.id} size={16} />{c.name}</a></li>
            ))}
            <li><DocLink doc={toDoc(resumeDoc)}><Icon name="doc" size={16} />Resume</DocLink></li>
          </ul>
        </div>
        <Composer />
      </div>
    </Section>
  );
}

const inCategories = (...cats) => liveChannels.filter((c) => cats.includes(c.category));

// Footer link columns, grouped so the list stays scannable as channels are added.
const footGroups = [
  {
    label: "Connect",
    links: [
      { name: "GitHub", href: profile.links.github },
      { name: "LinkedIn", href: profile.links.linkedin },
      ...inCategories("Community"),
    ],
  },
  { label: "Writing & video", links: inCategories("Writing", "Video") },
  { label: "Practice", links: inCategories("Practice") },
].filter((g) => g.links.length);

export function Footer() {
  const year = (useNow() ?? BUILD_DATE).getFullYear();
  return (
    <footer className="footer">
      <div className="container foot">
        <div>
          <SectionLink id="top" className="brand">
            <span className="mark" aria-hidden="true">{profile.initials}</span>
            {profile.name}
          </SectionLink>
          <p className="foot-role">{profile.tagline}</p>
          <p className="foot-motto">“{profile.motto}”</p>
        </div>
        <nav aria-label="Footer">
          <div className="foot-col">
            <p className="label">Site</p>
            <ul>
              {navSections.map((s) => <li key={s.id}><SectionLink id={s.id}>{s.label}</SectionLink></li>)}
            </ul>
          </div>
          {footGroups.map((g) => (
            <div className="foot-col" key={g.label}>
              <p className="label">{g.label}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.name}><a href={l.href} target="_blank" rel="noopener">{l.name}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="copy">
          <span>© {year} {profile.name}</span>
          <span>Built with React + Vite · no trackers</span>
        </div>
      </div>
    </footer>
  );
}
