export const roles = [
  {
    period: "Nov 2025 — Present",
    current: true,
    title: "Full Stack Developer",
    org: "Ashvad Tech",
    place: "Greater Noida, India",
    points: [
      "Develop and maintain production web applications with Angular, .NET, SQL and REST APIs across frontend, backend and database layers.",
      "Build frontend features with React and Vite alongside the Angular applications.",
      "Implement features and integrate REST APIs that support business workflows and maintainable, scalable development.",
      "Optimize SQL queries and database operations to improve performance and data-access efficiency.",
      "Troubleshoot issues across UI, API and database layers and deliver fixes for production releases.",
    ],
    tags: ["Angular", "React", "Vite", ".NET", "SQL Server", "REST"],
  },
  {
    period: "Sep 2023 — May 2024",
    title: "Community Contributor",
    org: "Communiti.dev",
    points: ["Contributed to the developer community through technical collaboration, discussions and knowledge sharing."],
  },
];

// Newest first. `year` places the entry on the /credentials timeline and `level` says what kind of programme it is.
// `ongoing` marks one with no end date yet; add `href` to attach a document.
export const education = [
  { title: "Master of Computer Applications", level: "Postgraduate degree", when: "2026 —", year: 2026, ongoing: true, where: "Integral University · Lucknow" },
  { title: "Full Stack Web Development", level: "Full-stack programme", when: "Aug 2025", year: 2025, where: "Masai School" },
  { title: "Bachelor of Computer Applications", level: "Undergraduate degree", when: "Jul 2023", year: 2023, where: "Monad University · Hapur" },
];

// `by` is the issuer; `length` is the course length, where that is all the record states. `href` is the certificate file.
// `stack` names entries in data/stack.js, so the certificate can show where the skill is used.
export const certifications = [
  { title: "The Complete SQL Bootcamp", length: "30 h", stack: ["SQL Server · T-SQL"] },
  {
    title: "Complete React Developer",
    by: "ZTM",
    stack: ["React"],
    href: "https://drive.google.com/file/d/1NXs-Cui-IeWQny6sb0vz7Lya8WehsbsO/view?usp=sharing",
  },
  {
    title: "Career Essentials in Generative AI",
    by: "Microsoft · LinkedIn",
    href: "https://drive.google.com/file/d/1ig0zRkknylaekrcZMXn-K8oMjtFqUA21/view?usp=sharing",
  },
  {
    title: "SQL",
    by: "HackerRank",
    stack: ["SQL Server · T-SQL"],
    href: "https://drive.google.com/file/d/1iZ92CT04cZfffKFZdUT_xB3HbeUFz2n2/view?usp=sharing",
  },
];

// Home previews the first four; /credentials lists every one. Reorder the list above to change which lead.
export const homeCertifications = certifications.slice(0, 4);

export const principles = [
  {
    title: "Understand",
    body: "Follow the request through every layer before changing any of them.",
    source: "Production work",
    evidence: "Troubleshooting across UI, API and database layers for production releases.",
    icon: "search",
  },
  {
    title: "Define the contract",
    body: "Agree on the interface first, then let implementations vary.",
    source: "NOTO",
    evidence: "One storage contract with Dexie, SQLite and in-memory adapters.",
    icon: "contract",
  },
  {
    title: "Build",
    body: "Small, typed pieces, checked by tests at more than one level.",
    source: "NOTO",
    evidence: "TypeScript throughout. Vitest unit tests and Playwright end-to-end tests.",
    icon: "code",
  },
  {
    title: "Debug",
    body: "Measure first, then fix the root cause, not the symptom.",
    source: "Production work",
    evidence: "Optimized SQL queries and data access to improve application performance.",
    icon: "pulse",
  },
  {
    title: "Ship",
    body: "Automate the release, and have it fail loudly when something is wrong.",
    source: "NOTO",
    evidence: "The release script stops if the target environment is missing. It never guesses.",
    icon: "rocket",
  },
];
