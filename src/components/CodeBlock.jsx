import { useEffect, useState } from "react";
import { copyText } from "../utils/clipboard";
import { Icon } from "./Icon";
import "./CodeBlock.css";

export function CopyButton({ text, label }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button type="button" className={`copy-btn${done ? " is-done" : ""}`} aria-label={label} onClick={async () => setDone(await copyText(text))}>
      <Icon name={done ? "check" : "copy"} size={14} />
      <span className="sr-only" role="status">{done ? "Copied" : ""}</span>
    </button>
  );
}

const isComment = (line) => /^\s*(\/\/|--|#|\/?\*)/.test(line);

/**
 * A code excerpt, numbered from `code.from`. With `code.file` it is a verbatim excerpt from a repository;
 * `code.label` captions anything else, such as an illustrative snippet.
 */
export function CodeBlock({ code }) {
  const name = code.file ?? code.label;
  return (
    <figure className="codeblock">
      <figcaption>
        <span>{name}</span>
        <CopyButton text={code.text} label={`Copy the code from ${name}`} />
      </figcaption>
      <pre tabIndex={0} role="region" aria-label={`Code from ${name}`}>
        <code style={{ counterReset: `ln ${(code.from ?? 1) - 1}` }}>
          {code.text.split("\n").map((line, i) => (
            <span key={i} className={isComment(line) ? "cm" : undefined}>{line}{"\n"}</span>
          ))}
        </code>
      </pre>
      {code.note && <p className="codeblock-note">{code.note}</p>}
    </figure>
  );
}
