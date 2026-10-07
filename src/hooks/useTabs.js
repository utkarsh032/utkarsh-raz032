import { useRef, useState } from "react";

/**
 * WAI-ARIA tabs with roving tabindex and arrow-key navigation.
 * Returns the selected key and a prop getter for each tab button.
 * `vertical` also moves with the up and down arrows, for tab lists drawn as a column.
 */
export function useTabs(keys, initial = keys[0], onChange, vertical = false) {
  const [selected, setSelected] = useState(initial);
  const refs = useRef({});

  const select = (key) => {
    setSelected(key);
    onChange?.(key);
  };

  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, ...(vertical && { ArrowDown: 1, ArrowUp: -1 }) }[e.key];
    let next;
    if (step) next = keys[(i + step + keys.length) % keys.length];
    else if (e.key === "Home") next = keys[0];
    else if (e.key === "End") next = keys[keys.length - 1];
    if (!next) return;
    e.preventDefault();
    refs.current[next]?.focus();
    select(next);
  };

  const getTabProps = (key, i) => ({
    ref: (el) => (refs.current[key] = el),
    role: "tab",
    type: "button",
    "aria-selected": selected === key,
    tabIndex: selected === key ? 0 : -1,
    onClick: () => select(key),
    onKeyDown: (e) => onKeyDown(e, i),
  });

  return { selected, getTabProps };
}
