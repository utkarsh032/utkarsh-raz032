import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect in the browser, useEffect during prerendering (avoids the SSR warning). */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const query = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

// One shared IntersectionObserver for every reveal on the page.
let observer;
const callbacks = new WeakMap();
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          callbacks.get(e.target)?.();
          observer.unobserve(e.target);
          callbacks.delete(e.target);
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
  }
  return observer;
}

/**
 * Calls `onEnter` once, the first time the element scrolls into view.
 * `onWait` runs instead when the element starts off-screen, so hidden states are
 * only ever applied by code that has actually hydrated.
 */
export function useOnEnter(onEnter, onWait) {
  const ref = useRef(null);
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already on screen (e.g. prerendered HTML being hydrated): mark it before the first paint.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      cb.current(el);
      return;
    }
    onWait?.(el);
    const io = getObserver();
    callbacks.set(el, () => cb.current(el));
    io.observe(el);
    return () => {
      io.unobserve(el);
      callbacks.delete(el);
    };
  }, []);
  return ref;
}

/**
 * Adds `className` when the element enters the viewport, and `pending` while it waits
 * off-screen. Style hidden states with `.pending:not(.in)`. No re-render.
 */
export function useReveal(className = "in") {
  return useOnEnter(
    (el) => el.classList.add(className),
    (el) => el.classList.add("pending")
  );
}

/** Pulls the element up to 6px toward the pointer. Fine pointers only. */
export function useMagnetic() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}
