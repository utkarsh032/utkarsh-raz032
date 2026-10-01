import { useEffect, useRef, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { useTheme } from "../hooks/useTheme";

// Blue ramp matching the layer palette (level 0 → 4). E-paper reuses the light ramp, greyed by the root filter.
const theme = {
  dark: ["#131a28", "#1b3263", "#2a55ad", "#4d8dff", "#9dbdff"],
  light: ["#e4e8ee", "#b3cbfb", "#7ea6f6", "#2563eb", "#143a94"],
};

const WEEKS = 53;
const MIN_BLOCK = 11; // Below this the card scrolls sideways instead.
const MAX_BLOCK = 28;

/** Block size and gap that make a year of weeks span the given width. */
function fit(width) {
  const margin = width >= 1000 ? 4 : 3;
  const size = Math.floor((width + margin) / WEEKS) - margin;
  return { size: Math.min(MAX_BLOCK, Math.max(MIN_BLOCK, size)), margin };
}

export default function ContributionCalendar({ username }) {
  const colorScheme = useTheme() === "dark" ? "dark" : "light";
  const ref = useRef(null);
  const [block, setBlock] = useState({ size: MIN_BLOCK, margin: 3 });

  // Grow the blocks so the grid fills the card instead of sitting in one corner.
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const next = fit(entry.contentRect.width);
      setBlock((prev) => (prev.size === next.size && prev.margin === next.margin ? prev : next));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <GitHubCalendar
        username={username}
        colorScheme={colorScheme}
        theme={theme}
        blockSize={block.size}
        blockMargin={block.margin}
        blockRadius={Math.round(block.size / 5)}
        fontSize={12}
        errorMessage="Contribution data couldn't be loaded right now. The profile link above always works."
      />
    </div>
  );
}
