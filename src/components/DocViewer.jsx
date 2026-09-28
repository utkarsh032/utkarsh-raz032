import { useCallback, useEffect, useRef, useState } from "react";
import { DocContext, useDocViewer } from "../utils/docs";
import { copyText } from "../utils/clipboard";
import { Icon } from "./Icon";
import "./DocViewer.css";

/**
 * A normal link to the file, so middle-click, ctrl-click and no-JS still open it in a new tab.
 * A plain click opens it in the viewer instead.
 */
export function DocLink({ doc, docs, index = 0, children, ...rest }) {
  const open = useDocViewer();
  const onClick = (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open(docs ?? [doc], docs ? index : 0);
  };
  return (
    <a href={doc.href} target="_blank" rel="noopener" aria-haspopup="dialog" onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

export function DocViewerProvider({ children }) {
  const [state, setState] = useState(null);
  const open = useCallback((docs, index = 0) => setState({ docs, index }), []);
  return (
    <DocContext.Provider value={open}>
      {children}
      <DocViewer state={state} setState={setState} onClose={() => setState(null)} />
    </DocContext.Provider>
  );
}

function DocViewer({ state, setState, onClose }) {
  const dialog = useRef(null);
  const frame = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [max, setMax] = useState(false);
  const [note, setNote] = useState("");
  const doc = state?.docs[state.index];
  const count = state?.docs.length ?? 0;
  // Browsers without a built-in PDF viewer (most mobile ones) can't show a PDF in a frame.
  const canEmbed = doc?.kind === "drive" || typeof navigator === "undefined" || navigator.pdfViewerEnabled !== false;

  useEffect(() => {
    const d = dialog.current;
    if (state && !d.open) {
      d.showModal();
      document.documentElement.classList.add("doc-open");
    } else if (!state && d.open) {
      d.close();
    }
    if (!state) {
      document.documentElement.classList.remove("doc-open");
      setMax(false);
    }
  }, [state]);

  useEffect(() => {
    setLoaded(false);
    setNote("");
  }, [doc?.href]);

  const go = (step) => setState((s) => s && { ...s, index: (s.index + step + s.docs.length) % s.docs.length });

  const onKeyDown = (e) => {
    if (count > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key.toLowerCase() === "f" && !e.metaKey && !e.ctrlKey) {
      setMax((m) => !m);
    }
  };

  const flash = (text) => {
    setNote(text);
    setTimeout(() => setNote(""), 1600);
  };

  const copyLink = async () => {
    const url = new URL(doc.href, window.location.href).href;
    flash((await copyText(url)) ? "Link copied" : url);
  };

  // Printing reaches into the frame, so it only works for same-origin PDFs; otherwise open the file to print from there.
  const print = () => {
    try {
      frame.current.contentWindow.print();
    } catch {
      window.open(doc.href, "_blank", "noopener");
    }
  };

  return (
    <dialog
      ref={dialog}
      className={`docv${max ? " max" : ""}`}
      aria-label={doc ? `${doc.title}, document viewer` : "Document viewer"}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      {doc && (
        <>
          <header className="docv-bar">
            <span className="docv-dots" aria-hidden="true">
              <button type="button" tabIndex={-1} onClick={onClose} title="Close" />
              <button type="button" tabIndex={-1} onClick={() => setMax(false)} title="Restore" />
              <button type="button" tabIndex={-1} onClick={() => setMax(true)} title="Maximize" />
            </span>
            <div className="docv-title">
              <b>{doc.title}</b>
              {doc.meta && <small>{doc.meta}</small>}
            </div>
            {count > 1 && (
              <div className="docv-pager">
                <button type="button" className="docv-btn" onClick={() => go(-1)} aria-label="Previous document"><Icon name="chevron-left" size={16} /></button>
                <span aria-live="polite">{state.index + 1} / {count}</span>
                <button type="button" className="docv-btn" onClick={() => go(1)} aria-label="Next document"><Icon name="chevron-right" size={16} /></button>
              </div>
            )}
            <div className="docv-tools">
              <span className="docv-note" role="status">{note}</span>
              <a className="docv-btn" href={doc.download} download={doc.file ?? true} title="Download">
                <Icon name="download" size={16} /><span>Download</span>
              </a>
              {doc.kind === "pdf" && canEmbed && (
                <button type="button" className="docv-btn hide-sm" onClick={print} title="Print">
                  <Icon name="print" size={16} /><span className="sr-only">Print</span>
                </button>
              )}
              <button type="button" className="docv-btn hide-sm" onClick={copyLink} title="Copy link">
                <Icon name="link" size={16} /><span className="sr-only">Copy link</span>
              </button>
              <a className="docv-btn" href={doc.href} target="_blank" rel="noopener" title="Open in new tab">
                <Icon name="external" size={16} /><span className="sr-only">Open in new tab</span>
              </a>
              <button type="button" className="docv-btn hide-sm" onClick={() => setMax((m) => !m)} aria-pressed={max} title={max ? "Restore (F)" : "Maximize (F)"}>
                <Icon name={max ? "minimize" : "maximize"} size={16} /><span className="sr-only">{max ? "Restore size" : "Maximize"}</span>
              </button>
              <button type="button" className="docv-btn" onClick={onClose} title="Close (Esc)" autoFocus>
                <Icon name="close" size={16} /><span className="sr-only">Close</span>
              </button>
            </div>
          </header>
          <div className="docv-body">
            {canEmbed ? (
              <>
                {!loaded && <div className="docv-loading" aria-hidden="true"><span /></div>}
                <iframe
                  key={doc.embed}
                  ref={frame}
                  src={doc.embed}
                  title={doc.title}
                  allow="fullscreen"
                  onLoad={() => setLoaded(true)}
                />
              </>
            ) : (
              <div className="docv-fallback">
                <Icon name="folder" size={28} />
                <p>This browser can&apos;t preview PDFs inline.</p>
                <div>
                  <a className="btn btn-primary btn-sm" href={doc.href} target="_blank" rel="noopener">Open PDF</a>
                  <a className="btn btn-ghost btn-sm" href={doc.download} download={doc.file ?? true}>Download</a>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
