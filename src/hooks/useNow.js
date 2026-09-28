import { useEffect, useState } from "react";
import github from "../data/github.json";

/** The date the site was built (written by scripts/fetch-github.mjs before each build). */
export const BUILD_DATE = new Date(`${github.updated}T00:00:00Z`);

/**
 * The current time, available only after hydration. The first render (prerendered HTML
 * and the browser's hydration pass) gets `null`, so time-dependent text can't mismatch.
 * Pass `intervalMs` to keep it ticking.
 */
export function useNow(intervalMs) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    if (!intervalMs) return;
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
