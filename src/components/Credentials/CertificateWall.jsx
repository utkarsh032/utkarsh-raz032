import { certificates } from "../../data/credentials";
import { CredentialLink } from "../CredentialBits";
import { Reveal } from "../Section";

/**
 * Each certificate as a document: who issued it, whether its file is here, and where the skill is used.
 * A card with a file opens it in the viewer; the others are plain records.
 */
export function CertificateWall() {
  return (
    <Reveal as="ul" className="cr-wall">
      {certificates.map((c, i) => (
        <li key={c.id} className={`cr-cert${c.doc ? " has-doc" : ""}`} style={{ "--i": i }}>
          <i className="cr-seal" aria-hidden="true" />
          <p className="cr-cert-top">
            <span className="label">Certificate</span>
            {c.status && <span className="cr-status is-filed">{c.status}</span>}
          </p>
          <h3>{c.title}</h3>
          <p className="cr-cert-by">
            {c.issuer && <>Issued by <b>{c.issuer}</b></>}
            {c.length && <>Course length <b>{c.length}</b></>}
          </p>
          {c.usedIn.length > 0 && (
            <dl className="cr-used">
              <dt>Where the skill is used</dt>
              {c.usedIn.map((t) => (
                <dd key={t.name}>
                  <b>{t.name}</b>
                  <span className={`cr-ctx${t.prod ? " is-prod" : ""}`}>{t.prod ? "In production" : "In projects"}</span>
                  <span>{t.where}</span>
                </dd>
              ))}
            </dl>
          )}
          {c.doc && (
            <CredentialLink className="cr-cert-open" set="certifications" href={c.doc.href}>
              View certificate<span className="sr-only">: {c.title}</span> <span aria-hidden="true">→</span>
            </CredentialLink>
          )}
        </li>
      ))}
    </Reveal>
  );
}
