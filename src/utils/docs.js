import { createContext, useContext } from "react";

export const DocContext = createContext(() => {});

const driveId = (href) => href.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1];

/** Turns `{ title, href, meta? }` into everything the viewer needs: an embeddable source, a download URL and a file name. */
export function toDoc({ title, href, meta }) {
  const id = driveId(href);
  if (id) {
    return { title, meta, href, kind: "drive", embed: `https://drive.google.com/file/d/${id}/preview`, download: `https://drive.google.com/uc?export=download&id=${id}` };
  }
  const file = href.split("/").pop();
  return { title, meta, href, kind: "pdf", file, embed: `${href}#toolbar=0&navpanes=0&view=FitH`, download: href };
}

/** Opens a document (or a set of them, starting at `index`) in the viewer. */
export const useDocViewer = () => useContext(DocContext);
