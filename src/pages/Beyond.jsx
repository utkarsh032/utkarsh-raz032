import { Link } from "react-router-dom";
import { cases, choosing, faultLayers, faults, growth, layers, loop, pipeline, principles, stages, tradeoffs } from "../data/beyond";
import { channelCategories, channels, liveChannels } from "../data/channels";
import { useSpotlight } from "../hooks/motion";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ChannelCard } from "../components/ChannelCard";
import { Chapters } from "../components/Chapters";
import { Counter } from "../components/Counter";
import { Reveal } from "../components/Section";
import { SystemMap } from "../components/SystemMap";
import { FaultTrace } from "../components/Beyond/FaultTrace";
import { Figure } from "../components/Beyond/Figure";
import { GrowthLadder } from "../components/Beyond/GrowthLadder";
import { LayerStack } from "../components/Beyond/LayerStack";
import { LearningLoop } from "../components/Beyond/LearningLoop";
import { PrincipleGraph } from "../components/Beyond/PrincipleGraph";
import { ProcessWalk } from "../components/Beyond/ProcessWalk";
import { TradeOffs } from "../components/Beyond/TradeOffs";
import "../styles/tint.css";
import "./Beyond.css";

// Blueprint blue, as an oklch hue (see styles/tint.css).
const HUE = 255;

// Live channels first within each group, keeping file order otherwise.
const byCategory = channelCategories
  .map((cat) => ({ cat, items: channels.filter((c) => c.category === cat).sort((a, b) => !a.href - !b.href) }))
  .filter((g) => g.items.length);

// What the page holds, counted from its own data.
const readout = [
  { value: cases.length, label: "Problems worked from report to fix" },
  { value: faults.length, label: "Faults traced to their cause" },
  { value: tradeoffs.length, label: "Decisions with their price" },
  { value: principles.length, label: "Rules, each with evidence" },
];

function Hero() {
  const spot = useSpotlight();
  return (
    <header className="by-hero" ref={spot}>
      <span className="by-glow" aria-hidden="true" />
      <div className="container">
        <Breadcrumbs trail={[["Home", "/"], ["Beyond code", "/beyond"]]} />
        <div className="by-hero-grid">
          <div>
            <p className="label by-kicker"><b>How I think</b> · the part a repository doesn&apos;t show</p>
            <h1>Beyond code.</h1>
            <p className="by-lede">
              Code is the visible layer. Under it are the things that decide whether the code is any good: how a problem
              gets worked, where I look when something breaks, what each decision cost, and what happens after it runs
              on my machine.
            </p>
            <p className="by-margin">
              Everything here happened. Each figure links to the release note, source file or page it comes from.
            </p>
            <div className="by-cta">
              <a className="btn btn-primary" href="#process">Start with a real bug <span aria-hidden="true">↓</span></a>
              <Link className="btn btn-ghost" to="/projects">See what I built <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <LayerStack layers={layers} />
        </div>
        <dl className="by-readout">
          {readout.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd><Counter value={r.value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

function Channels() {
  return (
    <div className="by-channels" id="channels">
      <Reveal>
        <h3>Where it happens</h3>
        <p className="by-channels-lede">
          {liveChannels.length} channels live, {channels.length - liveChannels.length} on the way. Each links to my own
          profile on that platform.
        </p>
      </Reveal>
      {byCategory.map(({ cat, items }) => (
        <section className="by-group" key={cat} aria-labelledby={`by-${cat}`}>
          <h4 className="label" id={`by-${cat}`}>{cat} <span>{items.length}</span></h4>
          <ul className="bc">
            {items.map((c) => <ChannelCard key={c.id} channel={c} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}

// Chapters in reading order. Each one is a layer of the stack in the hero.
const chapters = [
  {
    id: "process",
    label: "Problems",
    title: "How I work a problem.",
    lead: "The same eight questions, in the same order. Pick a case to see what each one looked like when it was real.",
    body: (
      <Figure n={1} title="A problem, worked" meta={`${cases.length} cases · ${stages.length} stages`}>
        <ProcessWalk stages={stages} cases={cases} />
      </Figure>
    ),
  },
  {
    id: "systems",
    label: "Systems",
    title: "A bug is rarely where it appears.",
    lead: "Five faults from NOTO, drawn against the layers of the system. Each was seen in one layer and caused in another.",
    body: (
      <>
        <Figure n={2} title="Fault trace" meta={`${faults.length} faults · ${faultLayers.length} layers`}>
          <FaultTrace layers={faultLayers} faults={faults} />
        </Figure>
        <Reveal as="p" className="by-moral">
          None of these was fixed in the layer where it was first seen. That is why I trace before I patch.
        </Reveal>
      </>
    ),
  },
  {
    id: "decisions",
    label: "Decisions",
    title: "Every decision has a price.",
    lead: "Knowing a technology matters less than knowing what choosing it costs. Each record names the requirement, the option that lost, and what the winner cost.",
    body: (
      <>
        <Figure n={3} title="Decision record" meta={`${tradeoffs.length} decisions`}>
          <TradeOffs items={tradeoffs} />
        </Figure>
        <Reveal>
          <h3 className="by-sub">How I choose a tool</h3>
          <p className="by-sub-lede">Six questions, in the order I ask them. Each answer is a choice I actually made.</p>
        </Reveal>
        <ol className="by-choose">
          {choosing.map((q, i) => (
            <Reveal as="li" key={q.ask} style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
              <b>{q.ask}</b>
              <p>{q.answer}</p>
            </Reveal>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "principles",
    label: "Principles",
    title: "Rules I keep, and where they came from.",
    lead: "Each rule connects to the work behind it. The number on a node is how many pieces of evidence it has, and bigger nodes have more.",
    body: (
      <Figure n={4} title="Principles" meta={`${principles.length} rules · ${principles.reduce((n, p) => n + p.evidence.length, 0)} pieces of evidence`}>
        <PrincipleGraph principles={principles} />
      </Figure>
    ),
  },
  {
    id: "production",
    label: "Production",
    title: "Working on my machine is where it starts.",
    lead: "The path a change takes in NOTO, from a branch to a release someone installs. Select a stage to see what it checks, or play a trace. Some of these gates exist because something once got through.",
    body: (
      <Figure n={5} title="From branch to release" meta={`${pipeline.nodes.length} stages`}>
        <SystemMap system={pipeline} />
      </Figure>
    ),
  },
  {
    id: "learning",
    label: "People",
    title: "How I get better, and where I show the work.",
    lead: "A loop, not a list of technologies. Each step points to where it happens.",
    body: (
      <>
        <Figure n={6} title="The loop" meta={`${loop.length} steps`}>
          <LearningLoop steps={loop} />
        </Figure>
        <Channels />
      </>
    ),
  },
  {
    id: "growth",
    label: "Growth",
    title: "From pages to systems.",
    lead: "The same person with a wider scope each time: more technology, then more responsibility, more complexity and more ownership.",
    body: <GrowthLadder stages={growth} />,
  },
];

/** /beyond: how I think. The projects show what was built; this page shows the reasoning under it. */
export default function Beyond() {
  return (
    <article className="by tint" style={{ "--ph": HUE }}>
      <Hero />
      <Chapters name="Beyond code" chapters={chapters} />
      <section className="by-close" aria-labelledby="by-close-h">
        <div className="container">
          <Reveal>
            <p className="label">The other half</p>
            <h2 id="by-close-h">This page is how I think. The projects are what came of it.</h2>
            <div className="by-cta">
              <Link className="btn btn-primary" to="/projects">See what I built <span aria-hidden="true">→</span></Link>
              <Link className="btn btn-ghost" to="/#contact">Get in touch</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
