import { resume } from "../../data/credentials";
import { roles } from "../../data/experience";
import { profile } from "../../data/profile";
import { useMagnetic, useTilt } from "../../hooks/motion";
import { DocLink } from "../DocViewer";
import { Icon } from "../Icon";
import { Reveal } from "../Section";

const current = roles.find((r) => r.current);
const { preview } = resume;

/** The resume as an object on a desk: page one of the real PDF, then what the file says about itself. */
export function ResumeSheet() {
  const tilt = useTilt();
  const primary = useMagnetic();

  return (
    <div className="cr-resume">
      <Reveal className="cr-desk">
        <div className="cr-desk-stage" ref={tilt}>
          <div className="cr-paper-marks">
            <DocLink className="cr-paper" doc={resume.doc}>
              <picture>
                {preview.avif && <source srcSet={preview.avif} type="image/avif" />}
                <img src={preview.webp} width={preview.width} height={preview.height} alt={`Page one of ${profile.name}'s resume`} loading="lazy" decoding="async" />
              </picture>
              <span className="sr-only"> (opens in the document viewer)</span>
            </DocLink>
          </div>
        </div>
        <p className="cr-desk-tag">{resume.file}</p>
        <p className="cr-desk-tag cr-desk-page">page 1 of {resume.pages}</p>
        <p className="cr-desk-tag cr-desk-open" aria-hidden="true">click to open <Icon name="maximize" size={12} /></p>
      </Reveal>

      <Reveal className="cr-resume-info">
        <p className="label">The primary record</p>
        <h3>{resume.title}</h3>
        <p className="cr-resume-role">{profile.tagline}</p>
        <dl className="cr-facts">
          {current && (
            <div>
              <dt>Now</dt>
              <dd>{current.title} at {current.org}<small>{current.period}</small></dd>
            </div>
          )}
          <div><dt>Based in</dt><dd>{profile.location}</dd></div>
          <div><dt>Format</dt><dd>PDF · {resume.pages} page{resume.pages === 1 ? "" : "s"} · {resume.size}</dd></div>
          {resume.modified && <div><dt>Last modified</dt><dd>{resume.modified}</dd></div>}
        </dl>
        <div className="cr-cta">
          <span className="cr-magnet" ref={primary}>
            <DocLink className="btn btn-primary" doc={resume.doc}>
              View resume <Icon name="maximize" size={15} />
            </DocLink>
          </span>
          <a className="btn btn-ghost" href={resume.href} download>
            <Icon name="download" size={15} /> Download PDF
          </a>
        </div>
        <p className="cr-hint">Opens in the viewer on this page, with print, full screen and a link to the original file.</p>
      </Reveal>
    </div>
  );
}
