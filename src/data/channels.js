// Work outside the day job: where I write, teach, and practice.
// This file is the single source for these links: the home section, /beyond page, footer, and command menu all read it.
// Home shows only live channels; /beyond shows everything, with empty-`href` entries as "coming soon" cards.
// `featured` is optional; drop it in when there's a piece worth pointing at.
// `icon` falls back to `id`; see components/Icon.jsx for available names.
export const channels = [
  {
    id: "youtube",
    category: "Video",
    name: "YouTube",
    handle: "@utkarshraz9900",
    href: "https://www.youtube.com/@utkarshraz9900",
    verb: "watch",
    blurb: "Video walkthroughs of things I build and learn: web development, tooling, and working through problems on camera.",
  },
  {
    id: "medium",
    category: "Writing",
    name: "Medium",
    handle: "@utkarshraj525",
    href: "https://medium.com/@utkarshraj525",
    verb: "read",
    blurb: "Longer write-ups on how I approach software: habits, trade-offs, and lessons from shipping.",
    featured: {
      title: "The 80/20 rule in software development: identifying the vital few tasks that drive results",
      href: "https://medium.com/@utkarshraj525/the-80-20-rule-in-software-development-identifying-the-vital-few-tasks-that-drive-results-3e2b33f1cdc3",
    },
  },
  {
    id: "leetcode",
    category: "Practice",
    name: "LeetCode",
    handle: "utkarshraj525",
    href: "https://leetcode.com/u/utkarshraj525/",
    verb: "practice",
    blurb: "Regular data structures and algorithms practice to keep problem-solving sharp.",
  },

  // ---- Coming soon: fill in `href`, `handle`, and `blurb` to make these live. ----
  {
    id: "linkedin-posts",
    category: "Community",
    icon: "linkedin",
    name: "LinkedIn posts",
    handle: "",
    href: "", // e.g. https://www.linkedin.com/in/utkarsh-raj032official/recent-activity/all/
    verb: "follow",
    blurb: "",
  },
  {
    id: "x",
    category: "Community",
    name: "X",
    handle: "",
    href: "",
    verb: "follow",
    blurb: "",
  },
  {
    id: "devto",
    category: "Writing",
    icon: "pen",
    name: "Dev.to",
    handle: "",
    href: "",
    verb: "read",
    blurb: "",
  },
  {
    id: "hashnode",
    category: "Writing",
    icon: "pen",
    name: "Hashnode",
    handle: "",
    href: "",
    verb: "read",
    blurb: "",
  },
  {
    id: "substack",
    category: "Writing",
    name: "Newsletter",
    handle: "",
    href: "",
    verb: "subscribe",
    blurb: "",
  },
  {
    id: "stackoverflow",
    category: "Community",
    name: "Stack Overflow",
    handle: "",
    href: "",
    verb: "answers",
    blurb: "",
  },
  {
    id: "opensource",
    category: "Community",
    icon: "merge",
    name: "Open source",
    handle: "",
    href: "", // e.g. https://github.com/pulls?q=is:pr+author:utkarsh032+-user:utkarsh032
    verb: "contributions",
    blurb: "",
  },
  {
    id: "codeforces",
    category: "Practice",
    icon: "trophy",
    name: "Codeforces",
    handle: "",
    href: "",
    verb: "practice",
    blurb: "",
  },
  {
    id: "codechef",
    category: "Practice",
    icon: "trophy",
    name: "CodeChef",
    handle: "",
    href: "",
    verb: "practice",
    blurb: "",
  },
  {
    id: "gfg",
    category: "Practice",
    icon: "code",
    name: "GeeksforGeeks",
    handle: "",
    href: "",
    verb: "practice",
    blurb: "",
  },
  {
    id: "talks",
    category: "Video",
    icon: "mic",
    name: "Talks",
    handle: "",
    href: "",
    verb: "watch",
    blurb: "",
  },
];

export const channelCategories = ["Video", "Writing", "Practice", "Community"];

export const liveChannels = channels.filter((c) => c.href);
