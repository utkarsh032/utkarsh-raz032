import { lazy, Suspense, useState } from "react";
import { BUILD_DATE, useNow } from "../hooks/useNow";
import { Link } from "react-router-dom";
import github from "../data/github.json";
import { profile, navSections, resumeDoc } from "../data/profile";
import { channels, liveChannels } from "../data/channels";
import { ChannelCard } from "../components/ChannelCard";
import { DocLink } from "../components/DocViewer";
import { toDoc } from "../utils/docs";
import { Icon } from "../components/Icon";
import { WindowBar } from "../components/WindowBar";
import { useMagnetic, useOnEnter } from "../hooks/motion";
import { copyText } from "../utils/clipboard";
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
      <SectionHeader id="beyond" num="06" label="Beyond code" title="Writing, teaching, and practice outside the day job." />
      <ul className="bc">
        {liveChannels.map((c) => <ChannelCard key={c.id} channel={c} />)}
      </ul>
      <Reveal className="more-work">
        <p>
          <b>All channels</b>
          <span>Video, writing, practice and community{upcoming > 0 && `, with ${upcoming} more on the way`}.</span>
        </p>
        <Link className="btn btn-ghost" to="/beyond">
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

/** Drafts an email in the visitor's own mail app. There is no backend, so nothing is sent from the site. */
function Composer() {
  const send = useMagnetic();
  const [topic, setTopic] = useState(profile.openTo[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");

  const who = name.trim();
  const subject = who ? `${topic.subject} from ${who}` : topic.subject;
  const body = [message.trim(), who && `— ${who}`].filter(Boolean).join("\n\n");
  const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

  const copy = async () => setNote((await copyText(profile.email)) ? "Email address copied" : "Select the address to copy");
  const submit = (e) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <Reveal className="panel compose">
      <WindowBar file="mail / new-message.eml">
        <span className="wbar-status"><span className="wbar-led" aria-hidden="true" />{profile.availability.toLowerCase()}</span>
      </WindowBar>
      <form className="compose-body" onSubmit={submit}>
        <div className="compose-row">
          <span className="compose-k">to</span>
          <span className="compose-to">{profile.email}</span>
          <button className="compose-copy" type="button" onClick={copy}>copy</button>
        </div>
        <fieldset className="compose-row compose-topics">
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
          />
        </div>
        <label className="sr-only" htmlFor="c-msg">Message</label>
        <textarea
          id="c-msg"
          className="compose-msg"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you building, and where could I help?"
        />
        <div className="compose-foot">
          <p className="compose-hint">Opens in your email app with this filled in. Nothing is sent from this site.</p>
          <button className="btn btn-primary" type="submit" ref={send}>Open in email <span aria-hidden="true">→</span></button>
        </div>
        <p className="mail-note" role="status">{note}</p>
      </form>
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
          {navSections.map((s) => <SectionLink key={s.id} id={s.id}>{s.label}</SectionLink>)}
          <a href={profile.links.github} target="_blank" rel="noopener">GitHub</a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          {liveChannels.map((c) => <a key={c.id} href={c.href} target="_blank" rel="noopener">{c.name}</a>)}
        </nav>
        <div className="copy">
          <span>© {year} {profile.name}</span>
          <span>Built with React + Vite · no trackers</span>
        </div>
      </div>
    </footer>
  );
}
