import { Link } from "react-router-dom";
import { channelCategories, channels, liveChannels } from "../data/channels";
import { ChannelCard } from "../components/ChannelCard";
import "./Projects.css";
import "./Beyond.css";

// Live channels first within each group, keeping file order otherwise.
const byCategory = channelCategories
  .map((cat) => ({ cat, items: channels.filter((c) => c.category === cat).sort((a, b) => !a.href - !b.href) }))
  .filter((g) => g.items.length);

export default function Beyond() {

  return (
    <div className="pj">
      <header className="pj-head">
        <div className="container">
          <Link className="cs-back" to="/#beyond">← Home</Link>
          <p className="label pj-kicker"><b>Channels</b> · {liveChannels.length} live · {channels.length - liveChannels.length} coming soon</p>
          <h1>Beyond code</h1>
          <p className="pj-lede">
            Where I write, record, practice and take part outside the day job. Everything here links to my own profile
            on each platform.
          </p>
        </div>
      </header>

      <div className="container by">
        {byCategory.map(({ cat, items }) => (
          <section className="by-group" key={cat} aria-labelledby={`by-${cat}`}>
            <h2 className="label" id={`by-${cat}`}>{cat} <span>{items.length}</span></h2>
            <ul className="bc">
              {items.map((c) => <ChannelCard key={c.id} channel={c} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
