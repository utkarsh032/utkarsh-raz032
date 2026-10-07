import { Link } from "react-router-dom";
import { certificates, documentCount, programmes, resume } from "../data/credentials";
import { useMagnetic, useSpotlight } from "../hooks/motion";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Chapters } from "../components/Chapters";
import { Counter } from "../components/Counter";
import { DocLink } from "../components/DocViewer";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Section";
import { CertificateWall } from "../components/Credentials/CertificateWall";
import { DocumentStack } from "../components/Credentials/DocumentStack";
import { EducationTimeline } from "../components/Credentials/EducationTimeline";
import { EvidenceChain } from "../components/Credentials/EvidenceChain";
import { OpenRecords } from "../components/Credentials/OpenRecords";
import { ResumeSheet } from "../components/Credentials/ResumeSheet";
import "../styles/tint.css";
import "./Credentials.css";

// Indigo ink, as an oklch hue (see styles/tint.css).
const HUE = 278;

// What the page holds, counted from its own data.
const readout = [
  { value: documentCount, label: "Documents you can open" },
  { value: programmes.length, label: "Programmes of formal study" },
  { value: certificates.length, label: "Certificates" },
  { value: String(programmes[0].year), label: "On record since" },
];

function Hero() {
  const spot = useSpotlight();
  const primary = useMagnetic();
  return (
    <header className="cr-hero" ref={spot}>
      <span className="cr-glow" aria-hidden="true" />
      <div className="container">
        <Breadcrumbs trail={[["Home", "/"], ["Credentials", "/credentials"]]} />
        <div className="cr-hero-grid">
          <div className="cr-intro">
            <p className="label cr-kicker"><b>Credentials</b> · the record under the work</p>
            <h1>The evidence behind the work.</h1>
            <p className="cr-lede">
              The projects show what I can build. This is the paper trail under them: the resume, the formal study and
              the certificates. Where a document exists, it opens right here.
            </p>
            <p className="cr-margin">
              A status on this page means only what the record shows: in progress, completed, or a document on file.
              Nothing is marked verified. The documents are there so you can check.
            </p>
            <div className="cr-cta">
              <span className="cr-magnet" ref={primary}>
                <DocLink className="btn btn-primary" doc={resume.doc}>
                  View resume <Icon name="maximize" size={15} />
                </DocLink>
              </span>
              <a className="btn btn-ghost" href={resume.href} download>
                <Icon name="download" size={15} /> Download PDF
              </a>
              <a className="btn btn-ghost" href="#education">Read the record <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <DocumentStack />
        </div>
        <dl className="cr-readout">
          {readout.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{typeof r.value === "number" ? <Counter value={r.value} /> : r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

const openEnded = programmes[programmes.length - 1].ongoing;

// Chapters in reading order. The first three are the sheets in the hero.
const chapters = [
  {
    id: "resume",
    label: "Resume",
    title: "One page, kept current.",
    lead: "The short version of everything else on this site. The preview is rendered from the PDF when the site is built, so what you see is the file you get.",
    body: <ResumeSheet />,
  },
  {
    id: "education",
    label: "Education",
    title: "Formal study, in order.",
    lead: `${programmes.length} programmes, oldest first.${openEnded ? " The last one has no end date yet." : ""}`,
    body: <EducationTimeline />,
  },
  {
    id: "certifications",
    label: "Certifications",
    title: "Certificates, and where the skill is used.",
    lead: "A certificate proves a course was finished, not that the skill is used. Where it is used, the card says where.",
    body: <CertificateWall />,
  },
  {
    id: "open",
    label: "In progress",
    title: "The record isn't closed.",
    lead: "Every entry here has a start date and no end date. It is the part of this page that will have changed the next time you look.",
    body: <OpenRecords />,
  },
];

/** /credentials: the foundation and the evidence. Projects show what was built; /beyond shows the thinking. */
export default function Credentials() {
  return (
    <article className="cr tint" style={{ "--ph": HUE }}>
      <Hero />
      <Chapters chapters={chapters} />
      <section className="cr-close" aria-labelledby="cr-close-h">
        <div className="container">
          <Reveal>
            <p className="label">What it adds up to</p>
            <h2 id="cr-close-h">More than documents.</h2>
            <p className="cr-close-lede">
              A degree and a certificate say what I studied. On their own they prove little, so read them as the first
              links in a chain: what was studied, what is used, what was built, and what is running in production.
            </p>
          </Reveal>
          <EvidenceChain />
          <Reveal className="cr-cta">
            <Link className="btn btn-primary" to="/projects">See what I built <span aria-hidden="true">→</span></Link>
            <Link className="btn btn-ghost" to="/beyond">See how I think <span aria-hidden="true">→</span></Link>
            <Link className="btn btn-ghost" to="/#contact">Get in touch</Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
