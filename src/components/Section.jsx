import { useReveal } from "../hooks/motion";

/** A numbered span in the page trace. `span` feeds the trace rail label. */
export function Section({ id, span, band, className = "", labelledBy, children, ...rest }) {
  return (
    <section
      id={id}
      className={`section${band ? " band" : ""} ${className}`}
      aria-labelledby={labelledBy ?? (id ? `h-${id}` : undefined)}
      data-span={span}
      {...rest}
    >
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({ id, num, label, title, children }) {
  const ref = useReveal();
  return (
    <div className="sh reveal" ref={ref}>
      <div>
        <div className="label">
          <b>{num}</b> {label}
        </div>
        <h2 id={`h-${id}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

/** Any element that fades up once when it enters the viewport. */
export function Reveal({ as: Tag = "div", className = "", ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${className}`} {...rest} />;
}
