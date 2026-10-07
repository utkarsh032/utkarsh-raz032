import { docSets } from "../data/credentials";
import { DocLink } from "./DocViewer";
import "./CredentialBits.css";

/** Opens a credential's file in the viewer, paging through the rest of its set ("education" or "certifications"). */
export function CredentialLink({ set, href, children, ...rest }) {
  const docs = docSets[set];
  const index = docs.findIndex((d) => d.href === href);
  return (
    <DocLink doc={docs[index]} docs={docs} index={index} {...rest}>
      {children}
    </DocLink>
  );
}

/** The small "view ↗" pill. Shared by the home panel and /credentials. */
export function ViewLink({ set, href, title }) {
  return (
    <CredentialLink className="verify" set={set} href={href}>
      view <span aria-hidden="true">↗</span>
      <span className="sr-only"> {title}</span>
    </CredentialLink>
  );
}
