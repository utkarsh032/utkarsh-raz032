import "./WindowBar.css";

/** Editor-style title bar for `.panel` cards. */
export function WindowBar({ file, children }) {
  return (
    <div className="wbar">
      <span className="wbar-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="wbar-file" aria-hidden="true">{file}</span>
      {children}
    </div>
  );
}
