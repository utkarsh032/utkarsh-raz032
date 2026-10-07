import { prefersReducedMotion, useOnEnter } from "../hooks/motion";

const COUNT_MS = 900;

/** Counts up to `value` the first time it scrolls into view. Without JS it shows the final number. */
export function Counter({ value }) {
  const ref = useOnEnter((el) => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      el.textContent = Math.round(value * (1 - (1 - t) ** 3)).toLocaleString("en");
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  });
  return <span ref={ref}>{value.toLocaleString("en")}</span>;
}
