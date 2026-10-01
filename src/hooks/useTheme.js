import { useSyncExternalStore } from "react";

export const themes = [
  { id: "dark", label: "Dark", icon: "moon", bg: "#05070b" },
  { id: "light", label: "Light", icon: "sun", bg: "#f6f7f9" },
  { id: "paper", label: "E-paper", icon: "paper", bg: "#f4f4f4" },
];

const KEY = "theme";
const listeners = new Set();

// The inline script in index.html sets data-theme before first paint; this reads it back.
const read = () => document.documentElement.dataset.theme || "dark";

export function setTheme(id) {
  const theme = themes.find((t) => t.id === id) ?? themes[0];
  document.documentElement.dataset.theme = theme.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
  try {
    localStorage.setItem(KEY, theme.id);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Current theme id; prerendered HTML always assumes dark. */
export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "dark");
}
