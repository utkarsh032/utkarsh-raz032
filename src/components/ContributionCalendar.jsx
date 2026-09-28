import GitHubCalendar from "react-github-calendar";

// Blue ramp matching the layer palette (level 0 → 4).
const theme = { dark: ["#131a28", "#1b3263", "#2a55ad", "#4d8dff", "#9dbdff"] };

export default function ContributionCalendar({ username }) {
  return (
    <GitHubCalendar
      username={username}
      colorScheme="dark"
      theme={theme}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
      fontSize={12}
      errorMessage="Contribution data couldn't be loaded right now. The profile link above always works."
    />
  );
}
