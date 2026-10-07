// Content for /beyond: how I work, shown through things that happened.
//
// Content rules: every case, decision and number here is documented in a repository, on the resume
// (data/experience.js) or elsewhere on this site, and names its source. A code sample that is not from a
// repository says so in its label. Rules without evidence don't go in.
//
// layers      the hero stack; each layer under the first is a chapter of the page
// stages      the eight questions asked of every problem; cases answer them with what was done
// faultLayers the layers of a system, top to bottom; faults were seen in one and caused in another
// tradeoffs   decisions as a record: requirement, constraint, two options, what was gained, what was paid.
//             The second option is the one that was chosen; `lean` is the end of `axis` it favours (0 or 1).
// choosing    how a tool gets picked, each question answered by a real choice
// principles  rules with the evidence behind them; `related` draws the links between them, `short` labels the node
// pipeline    the path a change takes in NOTO, as a map for components/SystemMap
// loop        the learning loop; `categories` are channel categories from data/channels.js
// growth      the same career as widening scope: technology, responsibility, complexity, ownership

import { excerpts } from "./excerpts";

const NOTO = "https://github.com/utkarsh032/NOTO/blob/main/";
const noto = (path) => ({ label: path, href: NOTO + path });

export const layers = [
  { id: "code", label: "Code", gloss: "What a repository shows", to: "/projects" },
  { id: "process", label: "Problems", gloss: "How I work one, from report to fix" },
  { id: "systems", label: "Systems", gloss: "Where I look when something breaks" },
  { id: "decisions", label: "Decisions", gloss: "What each choice gained, and what it cost" },
  { id: "principles", label: "Principles", gloss: "The rules I keep, and the work behind them" },
  { id: "production", label: "Production", gloss: "What happens after it works on my machine" },
  { id: "learning", label: "People", gloss: "Where I learn, write and explain" },
  { id: "growth", label: "Growth", gloss: "How the scope of my work has widened" },
];

export const stages = [
  { id: "problem", label: "Problem", ask: "What is wrong, in one sentence?" },
  { id: "understand", label: "Understand", ask: "What exactly happens, and what is unaffected?" },
  { id: "investigate", label: "Investigate", ask: "Which part of the system is responsible?" },
  { id: "model", label: "Model", ask: "Why does the system behave this way?" },
  { id: "decide", label: "Decide", ask: "Which change removes the cause, and what does it cost?" },
  { id: "build", label: "Build", ask: "What is the smallest change that does it properly?" },
  { id: "validate", label: "Validate", ask: "How do I know it worked?" },
  { id: "improve", label: "Improve", ask: "What stops this kind of problem coming back?" },
];

export const cases = [
  {
    id: "silent-exit",
    title: "The app that exited without a word",
    where: "NOTO desktop · 1.1.1",
    sources: [noto("docs/releases/1.1.1.md"), noto("apps/desktop/vite.main.config.ts")],
    steps: {
      problem: "The installed desktop app showed no window, no message and no log. It simply exited.",
      understand:
        "The process ended with status 0 before the first window was created. Documents were untouched: they live in SQLite under the user data directory, and the fault never reached them.",
      investigate:
        "The app opens its database during startup, before any window exists. In the packaged build that call failed with “DatabaseSync is not a constructor”, and the error was discarded.",
      model:
        "node:sqlite is still experimental, so it is missing from builtinModules. The bundler used that list to decide what to leave external, treated the module as an ordinary dependency, could not resolve it, and substituted an empty module. It printed a warning and reported success.",
      decide: "Two changes. Declare the module external explicitly. And the one that matters more: make any import the main-process bundler cannot resolve fail the build.",
      build: "A named list of experimental built-ins, and a warning handler that throws, with the fix written into the error message.",
      validate: "Released as 1.1.1, with the cause and both changes described in its notes.",
      improve: "This shape of defect can no longer pass as a successful build. The warning that hid it is now an error.",
    },
    code: {
      at: "build",
      excerpt: excerpts.notoBundler,
      why: "A warning is easy to scroll past. Promoting it to an error moves the failure from a user's machine to the build.",
    },
  },
  {
    id: "apk-size",
    title: "A 104 MB download",
    where: "NOTO Android",
    sources: [noto("docs/development/android-studio.md")],
    steps: {
      problem: "The published Android APK was 104 MB.",
      understand: "The Expo template builds one universal APK that holds four ABIs: armeabi-v7a, arm64-v8a, x86 and x86_64.",
      investigate: "It stores the native libraries uncompressed, once per ABI: React Native, Hermes, fbjni, Fresco, reanimated, the Expo modules and SQLite.",
      model: "Those libraries shipped four times over. About three quarters of the download was code that no single phone could use.",
      decide: "Give each ABI its own APK, and turn on the release-build shrinking the template leaves off.",
      build:
        "A config plugin edits the generated Android project, because that folder is regenerated on every prebuild and can't be edited by hand. It sets ABI splits, R8, resource shrinking and compressed libraries, and drops Fresco's unused GIF and WebP codecs.",
      validate: "Measured on a clean prebuild and release build: the arm64 APK went from 104 MB to 16.0 MB. The 32-bit build is 15.1 MB.",
      improve: "The reasoning and the measurements are written into the development guide, next to the build commands.",
    },
  },
  {
    id: "android-editor",
    title: "Editing on a phone flattened the document",
    where: "NOTO Android · 1.2.0 to 1.3.0",
    sources: [noto("docs/releases/1.2.0.md"), noto("docs/releases/1.3.0.md")],
    steps: {
      problem: "Opening a formatted document on Android and typing one character replaced its headings, tables, images and links with plain paragraphs.",
      understand: "The mobile editor read a document as plain text and wrote it back the same way. That had been true since the phone got an editor; tables and pictures made it expensive.",
      investigate: "Android had its own smaller screens. Every feature had to be ported a second time, so the phone trailed each release.",
      model: "Tiptap and ProseMirror need a DOM. A native React Native editor could not load the shared editor package at all.",
      decide: "Stop porting and run the real interface on the phone. Until that shipped, say so: 1.2.0 went out with the limitation written in its release notes.",
      build: "The Expo app became a shell. It packages the shared interface into the APK and serves it over a postMessage bridge to native SQLite, the arrangement Electron already used over IPC.",
      validate: "From 1.3.0, tabs, find and replace, history and formatting on Android are the same code as on desktop. Documents stay on the device as before.",
      improve: "Two things a WebView can't do, printing and saving a file, stay native and are reached over the same bridge.",
    },
  },
];

export const faultLayers = [
  { id: "interface", label: "Interface", sub: "what the user sees" },
  { id: "state", label: "State", sub: "what the app believes" },
  { id: "database", label: "Database", sub: "rows and constraints" },
  { id: "network", label: "Network", sub: "requests and origins" },
  { id: "build", label: "Build", sub: "bundler, dependencies" },
  { id: "pipeline", label: "Pipeline", sub: "tests, CI, release" },
  { id: "infrastructure", label: "Infrastructure", sub: "runners, hosts, the OS" },
];

export const faults = [
  {
    id: "cors",
    title: "Sign-in failed, but only once deployed",
    seen: "interface",
    cause: "network",
    symptom: "The sign-in form said “Could not reach the server. Check your connection.”",
    why: "The Edge Functions allowed browser requests from noto.app, a domain that does not exist yet, and from nowhere else. The browser refused every call before sending it, so nothing reached a function and nothing could log it.",
    hid: "localhost was allowed by a separate rule, so it never failed in development. And the message sent people to check a network that was fine.",
    fix: "The allow-list now names the address the app is actually served from.",
    sources: [noto("docs/releases/1.4.1.md")],
  },
  {
    id: "cascade",
    title: "Saving a document deleted its attachments",
    seen: "interface",
    cause: "database",
    symptom: "On the desktop, saving a document could delete the files attached to it.",
    why: "Saves used INSERT OR REPLACE. With foreign keys on, SQLite resolves that conflict by deleting the old row first, and the delete cascades: the document's files, versions and tag index went with it.",
    fix: "An upsert that updates the row in place, so nothing is ever deleted on save.",
    sources: [noto("docs/releases/1.5.0.md"), noto("packages/database/src/sqlite/sqlite-database.ts")],
    code: {
      before: {
        label: "What it replaced (illustrative, not from the repository)",
        text: ["INSERT OR REPLACE INTO documents (id, title, content, updated_at)", "VALUES (?, ?, ?, ?)"].join("\n"),
      },
      after: excerpts.notoUpsert,
      why: "REPLACE is a delete followed by an insert. With cascading foreign keys, the delete is not harmless.",
    },
  },
  {
    id: "flaky",
    title: "The flaky test was telling the truth",
    seen: "pipeline",
    cause: "state",
    symptom: "An end-to-end test, “opens a file from disk”, failed now and then for a long time.",
    why: "A keyboard shortcut pressed as the workspace appeared ran a stale handler. The test was not unreliable. The app had a race, and the test kept finding it.",
    fix: "A shortcut pressed at that moment now runs the handler registered once the workspace is ready.",
    sources: [noto("R&D/Noto_Audit_and_Implementation_Plan.md"), noto("docs/releases/1.5.0.md")],
  },
  {
    id: "duplicate",
    title: "The editor would not mount in development",
    seen: "interface",
    cause: "build",
    symptom: "Under the dev server the editor failed to mount, with errors from inside ProseMirror.",
    why: "The ProseMirror entry points were pre-bundled separately, each with its own private copy of prosemirror-view. Decorations made by one copy were handed to the other.",
    fix: "Every package the editor reaches ProseMirror through is listed for pre-bundling together, so there is one copy.",
    sources: [noto("apps/web/vite.config.ts"), noto("R&D/Noto_Audit_and_Implementation_Plan.md")],
  },
  {
    id: "hung-release",
    title: "A release cancelled by a step that never failed",
    seen: "pipeline",
    cause: "infrastructure",
    symptom: "Version 1.1.2 was cancelled at the 45-minute limit. Four working installers were built and discarded.",
    why: "hdiutil, which builds the macOS disk image, intermittently stops responding on hosted build machines: no output, no error, nothing in the log. The other four platforms had finished in under three minutes.",
    fix: "Each packaging attempt has its own deadline and is retried, so a stall costs minutes instead of the release.",
    sources: [noto("docs/releases/1.1.3.md")],
  },
];

export const tradeoffs = [
  {
    id: "local-first",
    title: "Local storage is the source of truth",
    axis: ["Always available", "Always consistent"],
    lean: 0,
    requirement: "A notes app that is complete offline, on every platform, with no account.",
    constraint: "Devices that edit offline will disagree, and something has to settle it afterwards.",
    options: ["Cloud first: one copy on a server, and the app waits for it", "Local first: every device owns a full copy, and sync comes after"],
    gained: "Every app works with no network and no account.",
    paid: "Sync becomes a design problem of its own: an outbox, version checks and a conflict rule.",
    source: { label: "NOTO · brief", to: "/projects/noto#brief" },
  },
  {
    id: "contract",
    title: "One storage contract, three adapters",
    axis: ["Per-platform freedom", "One behaviour"],
    lean: 1,
    requirement: "The same storage behaviour on web, desktop and Android.",
    constraint: "The browser has IndexedDB. Desktop and Android have SQLite.",
    options: ["Write queries per platform", "One contract, with an adapter per engine"],
    gained: "Query semantics are written once, and one contract test suite runs against all three engines.",
    paid: "Every storage feature has to be expressed in both IndexedDB and SQL.",
    source: { label: "NOTO · decisions", to: "/projects/noto#decisions" },
  },
  {
    id: "webview",
    title: "Android runs the same interface in a WebView",
    axis: ["One codebase", "Native rendering"],
    lean: 0,
    requirement: "The same editor on Android as on web and desktop.",
    constraint: "Tiptap and ProseMirror need a DOM.",
    options: ["A native React Native editor, ported feature by feature", "The shared interface in a WebView, bridged to native SQLite"],
    gained: "Nothing is ported. Tabs, find and replace, history and formatting are the same code.",
    paid: "A bridge: every query crosses postMessage as JSON.",
    source: { label: "NOTO · decisions", to: "/projects/noto#decisions" },
  },
  {
    id: "conflicts",
    title: "Conflicts never drop text",
    axis: ["Automatic merging", "A predictable outcome"],
    lean: 1,
    requirement: "Two devices can edit the same document while offline.",
    constraint: "Whatever the rule is, every device has to reach the same answer.",
    options: ["Merge the two bodies automatically", "Keep the local body, save the other as a version; last writer wins for the rest"],
    gained: "No merge logic to get wrong, and no paragraph lost without anyone noticing.",
    paid: "Sometimes a person reconciles two versions by hand.",
    note: "Built and tested; the sync engine is not switched on in the apps yet.",
    source: { label: "NOTO · deep dive", to: "/projects/noto#reference" },
  },
  {
    id: "reload-user",
    title: "Reload the user on every request",
    axis: ["Current permissions", "Fewer queries"],
    lean: 0,
    requirement: "Admin-only operations have to respect a role that can change.",
    constraint: "A token carries the role it was issued with, for seven days.",
    options: ["Trust the role inside the token", "Load the user from the database and check that record"],
    gained: "A role change applies on the next request.",
    paid: "One extra database query on every authenticated request.",
    source: { label: "OneMart · decisions", to: "/projects/onemart#decisions" },
  },
  {
    id: "release-guard",
    title: "Releases fail rather than guess",
    axis: ["Convenience", "Safety"],
    lean: 1,
    requirement: "A desktop package has to point at the right update feed.",
    constraint: "Two packages of the same version differ only in that feed, and the file name doesn't show it.",
    options: ["Default to an environment when none is given", "Refuse to build without one"],
    gained: "A package can't silently ship pointing at the wrong feed.",
    paid: "One more argument on every release, and a stopped run when it is forgotten.",
    source: { label: "NOTO · deep dive", to: "/projects/noto#reference" },
  },
];

export const choosing = [
  {
    ask: "What is the problem, exactly?",
    answer: "NOTO started from one sentence: a notes app that is complete offline on every platform. The stack followed from that, not the other way round.",
  },
  {
    ask: "What does the platform already give me?",
    answer: "IndexedDB in the browser, SQLite built into Node on the desktop, SQLite on Android. Each runtime uses the store it already has.",
  },
  {
    ask: "Which constraint can't I design around?",
    answer: "The editor needs a DOM. That one fact decided how the Android app was built.",
  },
  {
    ask: "Can I replace it later?",
    answer: "Storage sits behind one contract and the account backend is chosen at build time, so either can change without touching the interface.",
  },
  {
    ask: "What will it cost to run?",
    answer: "The product needs no server to work. The website is a separate static app, so a visitor after a download link never loads the editor.",
  },
  {
    ask: "Is there a simpler thing that works?",
    answer: "This site is React, Vite and plain CSS tokens, with no UI framework. NOTO's conflict rule has no merge algorithm.",
  },
];

export const principles = [
  {
    id: "understand",
    title: "Understand before changing",
    short: "Understand first",
    rule: "Follow the request through every layer before changing any of them.",
    evidence: [
      { text: "At work: troubleshooting across UI, API and database layers for production releases.", source: "Resume" },
      { text: "NOTO: the Android formatting bug was fixed by changing what runs on the phone, not by patching the flattening.", to: "/projects/noto#challenges" },
    ],
    related: ["debug", "cost"],
  },
  {
    id: "contract",
    title: "Define the contract first",
    short: "Contract first",
    rule: "Agree on the interface first, then let implementations vary.",
    evidence: [
      { text: "NOTO: one storage contract, with in-memory, Dexie and SQLite adapters behind it.", to: "/projects/noto#reference" },
      { text: "One contract test suite runs against all three engines." },
      { text: "The SQLite adapter talks to a small driver interface, implemented once over Electron IPC and once over the Android bridge." },
    ],
    related: ["simple", "cost"],
    code: {
      after: excerpts.notoContract,
      why: "Application code depends on this interface only, so the engine underneath can differ per platform.",
    },
  },
  {
    id: "simple",
    title: "Simplicity wins",
    short: "Simplicity",
    rule: "Prefer the simple solution that is easy to understand and maintain.",
    evidence: [
      { text: "NOTO's conflict rule has no merge algorithm: a delete wins, two bodies are both kept, the rest is last-writer-wins.", to: "/projects/noto#decisions" },
      { text: "Book Store: the whole API is five endpoints in a single Express file.", to: "/projects/book-store" },
      { text: "This site: React, Vite and plain CSS with design tokens. No UI framework." },
    ],
    related: ["cost", "contract"],
  },
  {
    id: "debug",
    title: "Debug the system, not the error",
    short: "Debug the system",
    rule: "An error message is often only the visible symptom. Measure first, then fix the root cause.",
    evidence: [
      { text: "“Could not reach the server” was a CORS allow-list, not a network fault.", href: "#systems" },
      { text: "A long-standing flaky test turned out to be a real race in the app.", href: "#systems" },
      { text: "At work: optimising SQL queries and data access to improve application performance.", source: "Resume" },
    ],
    related: ["understand", "production"],
  },
  {
    id: "cost",
    title: "Architecture has a cost",
    short: "Count the cost",
    rule: "Every abstraction, dependency and layer adds complexity. Write the price down next to the decision.",
    evidence: [
      { text: "Each NOTO decision records its consequence, including what it costs.", to: "/projects/noto#decisions" },
      { text: "The Android WebView saves a second codebase and costs a JSON bridge on every query.", href: "#decisions" },
      { text: "OneMart reloads the user on every request: current roles, one extra query.", to: "/projects/onemart#decisions" },
    ],
    related: ["simple", "contract"],
  },
  {
    id: "performance",
    title: "Performance is a feature",
    short: "Performance",
    rule: "Fast software is a better experience. Measure it, change it, measure again.",
    evidence: [
      { text: "Android APK: 104 MB to 16.0 MB, measured on a clean release build.", href: "#process" },
      { text: "Web entry bundle: 1,012 kB to 376 kB in NOTO 1.3.0.", to: "/projects/noto#results" },
      { text: "At work: optimising SQL queries and database operations.", source: "Resume" },
    ],
    related: ["debug", "production"],
  },
  {
    id: "production",
    title: "Production is the real test",
    short: "Production",
    rule: "Code is not finished when it compiles, or when it runs on my machine.",
    evidence: [
      { text: "A crash that only happened in the packaged app.", href: "#process" },
      { text: "A sign-in failure that only happened once deployed.", href: "#systems" },
      { text: "At work: delivering fixes for production releases.", source: "Resume" },
    ],
    related: ["loud", "debug"],
  },
  {
    id: "loud",
    title: "Fail loudly",
    short: "Fail loudly",
    rule: "Automate the release, and have it fail loudly when something is wrong.",
    evidence: [
      { text: "The release script refuses to build without a named environment.", to: "/projects/noto#reference" },
      { text: "An unresolved import in the main process stops the build.", href: "#process" },
      { text: "A release tag has to be reachable from main, and a version can't be released twice.", href: "#production" },
      { text: "The API's rate limits fail closed." },
    ],
    related: ["production", "own"],
    code: {
      before: {
        label: "The tempting version (illustrative, not from the repository)",
        text: ["# No environment given? Assume the usual one.", "if (-not $Environment) { $Environment = 'Production' }"].join("\n"),
      },
      after: excerpts.notoRelease,
      why: "A default is a guess. This one would ship a package pointed at the wrong update feed, with nothing in its name to show it.",
    },
  },
  {
    id: "own",
    title: "Own the outcome",
    short: "Own the outcome",
    rule: "Don't only complete the ticket. Understand the problem and what it does to the person using the software.",
    evidence: [
      { text: "Every NOTO release has written notes, including what is still broken.", href: NOTO + "docs/releases" },
      { text: "1.2.0 shipped with the Android limitation stated in its notes rather than hidden.", href: "#process" },
      { text: "Buttons for unfinished features are hidden rather than apologising when pressed." },
      { text: "Runbooks for deploying the API and for moving accounts between backends.", href: NOTO + "docs/deployment" },
    ],
    related: ["loud", "understand"],
  },
];

// Phases map onto the site's layer colours: develop · verify · release · operate.
export const pipeline = {
  desc: "The path a change takes in NOTO. Work lands on a feature branch and merges into dev. CI checks formatting, lint and types, runs unit and integration tests against a real PostgreSQL, builds every app, and runs Playwright end-to-end tests. A version tag cut from main starts a release: packaging with a deadline and retry per attempt, then a GitHub Release with checksums. The desktop app updates itself when asked, the API exposes health checks, and each release is written up.",
  cols: 4,
  nodes: [
    {
      id: "branch",
      label: "branch",
      sub: "feature → dev → main",
      layer: "ui",
      tag: "Develop",
      at: [0, 0],
      does: "Work lands on a feature branch and merges into dev. Non-production branches are built and deployed too, which makes dev a staging site.",
      tech: ["Git", "GitHub", "Cloudflare Workers Builds"],
    },
    {
      id: "static",
      label: "format · lint · types",
      sub: "on every pull request",
      layer: "api",
      tag: "Verify",
      at: [1, 0],
      does: "CI checks formatting, lints and typechecks every workspace before any test runs.",
      tech: ["Prettier", "ESLint", "tsc"],
    },
    {
      id: "test",
      label: "unit + integration",
      sub: "against a real PostgreSQL",
      layer: "api",
      tag: "Verify",
      at: [2, 0],
      does: "Vitest runs the unit suites, the storage contract against all three engines, and the API suites against a PostgreSQL started inside the job.",
      tech: ["Vitest", "PostgreSQL"],
    },
    {
      id: "build",
      label: "build",
      sub: "an unresolved import is an error",
      layer: "api",
      tag: "Verify",
      at: [3, 0],
      does: "Every buildable app is built. Since 1.1.1, an import the main-process bundler can't resolve stops the build instead of printing a warning.",
      tech: ["Vite", "Turborepo"],
    },
    {
      id: "e2e",
      label: "end to end",
      sub: "Playwright on the built app",
      layer: "api",
      tag: "Verify",
      at: [0, 1],
      does: "Playwright drives the built web app in Chromium. It runs on pushes to main and dev, and on pull requests that ask for it.",
      tech: ["Playwright"],
    },
    {
      id: "tag",
      label: "tag",
      sub: "cut from main only",
      layer: "ship",
      tag: "Release",
      at: [1, 1],
      does: "A release starts from a version tag. The workflow refuses a tag that isn't reachable from main, and refuses to release the same version twice.",
      tech: ["GitHub Actions"],
    },
    {
      id: "package",
      label: "package",
      sub: "deadline + retry per attempt",
      layer: "ship",
      tag: "Release",
      at: [2, 1],
      does: "Five desktop builds and the Android APKs. Each packaging attempt has its own deadline and is retried, and the Windows update manifest is verified before anything is published.",
      tech: ["Electron Forge", "Gradle"],
    },
    {
      id: "publish",
      label: "publish",
      sub: "release + checksums",
      layer: "ship",
      tag: "Release",
      at: [3, 1],
      does: "A GitHub Release with composed notes and SHA-256 sums for every artifact. The web app and the website deploy from main.",
      tech: ["GitHub Releases", "Cloudflare Workers"],
    },
    {
      id: "update",
      label: "update",
      sub: "never restarts on its own",
      layer: "data",
      tag: "Operate",
      at: [0, 2],
      does: "The desktop app checks its update feed and installs when the user asks. It never restarts by itself.",
      tech: ["Electron autoUpdater"],
    },
    {
      id: "observe",
      label: "observe",
      sub: "health checks · visible errors",
      layer: "data",
      tag: "Operate",
      at: [1, 2],
      does: "The API exposes /healthz and /readyz. In the app, a screen that fails to draw says what went wrong and offers a way back instead of blanking the window.",
    },
    {
      id: "writeup",
      label: "write it down",
      sub: "release notes · what broke",
      layer: "data",
      tag: "Operate",
      at: [2, 2],
      does: "Each release has notes that include what broke and why. Two of the gates on this map exist because of them: the build error and the packaging retry.",
    },
  ],
  edges: [
    { from: "branch", to: "static" },
    { from: "static", to: "test" },
    { from: "test", to: "build" },
    { from: "build", to: "e2e" },
    { from: "e2e", to: "tag" },
    { from: "tag", to: "package" },
    { from: "package", to: "publish" },
    { from: "publish", to: "update" },
    { from: "update", to: "observe" },
    { from: "observe", to: "writeup" },
  ],
  traces: [
    {
      label: "A change",
      steps: [
        { node: "branch", note: "A feature branch merges into dev, which is built and deployed as staging." },
        { node: "static", note: "Formatting, lint and types. Cheap checks first." },
        { node: "test", note: "Unit and integration suites, with the API tests on a real database." },
        { node: "build", note: "Every app builds. A missing module fails here, not on a user's machine." },
        { node: "e2e", note: "Playwright runs against the built web app, not the dev server." },
      ],
    },
    {
      label: "A release",
      steps: [
        { node: "tag", note: "A version tag on main. A tag from anywhere else is refused." },
        { node: "package", note: "Packaging can hang, so each attempt has a deadline and a retry." },
        { node: "publish", note: "Artifacts go out with their checksums and the release notes." },
        { node: "update", note: "Installed apps find the update and wait for the user to install it." },
        { node: "observe", note: "Failures are meant to be visible: health checks on the API, a real message on a broken screen." },
        { node: "writeup", note: "What broke goes into the notes, and sometimes into a new gate." },
      ],
    },
  ],
  footnote: "Source: .github/workflows, noto-release.ps1 and docs/releases in the NOTO repository.",
};

export const loop = [
  {
    id: "hit",
    label: "Hit a problem",
    text: "Something doesn't work, at work or in a project of my own. Production code since November 2025, NOTO since August 2026.",
  },
  {
    id: "fundamentals",
    label: "Learn the why",
    text: "Go under the API to the reason. Formal study runs alongside: a Master of Computer Applications in progress, a full-stack programme at Masai School, and courses in SQL and React.",
    to: { label: "Education and certifications", path: "/#experience" },
  },
  {
    id: "follow",
    label: "Follow, then rewrite",
    text: "The SQL data warehouse came from working through a public course end to end, then writing my own version of its loader. Its page says which parts are whose.",
    to: { label: "SQL Data Warehouse · my role", path: "/projects/sql-data-warehouse#role" },
  },
  {
    id: "build",
    label: "Build something real",
    text: "The projects on this site, from a static landing page to an app that runs on three platforms.",
    to: { label: "All projects", path: "/projects" },
  },
  {
    id: "break",
    label: "Break it, trace it",
    text: "When NOTO fails, the failure is traced to its cause and written into the release notes.",
    to: { label: "NOTO · postmortems", path: "/projects/noto#challenges" },
  },
  {
    id: "practise",
    label: "Practise",
    text: "Data structures and algorithms, kept up as a habit so the fundamentals stay sharp.",
    categories: ["Practice"],
  },
  {
    id: "write",
    label: "Write it down",
    text: "Longer write-ups on how I approach software: habits, trade-offs and lessons from shipping.",
    categories: ["Writing"],
  },
  {
    id: "explain",
    label: "Explain it",
    text: "Video walkthroughs of things I build and learn, and taking part in developer communities.",
    categories: ["Video", "Community"],
  },
];

export const growth = [
  {
    when: "2023",
    title: "Pages",
    tech: "HTML, CSS and JavaScript, then React",
    responsibility: "A landing page, start to finish",
    complexity: "Responsive layout, accessibility, reduced motion",
    ownership: "Deployed and live on Netlify",
    projects: ["omnifood", "destination"],
  },
  {
    when: "2023",
    title: "Full-stack apps",
    tech: "MongoDB, Express, React and Node.js",
    responsibility: "Client, API and database for one app",
    complexity: "Authentication, CRUD, state that survives a reload",
    ownership: "A storefront with its own admin area",
    projects: ["book-store", "bharat-estate"],
    also: "Bachelor of Computer Applications, July 2023 · Community contributor at Communiti.dev, September 2023 to May 2024",
  },
  {
    when: "2024",
    title: "APIs and a team",
    tech: "GraphQL with Apollo, sessions, Redux",
    responsibility: "A schema and its resolvers, then a share of a team codebase",
    complexity: "Session auth, aggregation for charts, emailed one-time passwords, lesson progress",
    ownership: "134 of 158 commits on a three-person project",
    projects: ["expenses-tracker", "udemy-clone"],
  },
  {
    when: "2025",
    title: "Backends that defend themselves",
    tech: "JWT and roles, request protection, durable workflows, a CMS with error monitoring",
    responsibility: "The whole API: routes, guards, data model, deployment",
    complexity: "Role checks, stock that can't race, reminders that retry",
    ownership: "One pull request per feature on OneMart",
    projects: ["subscription-tracker", "onemart", "bookheaven", "kanbanflow", "likho"],
    also: "Full Stack Web Development, Masai School, August 2025",
  },
  {
    when: "Nov 2025",
    title: "Production",
    tech: "Angular, React, .NET, SQL Server, REST",
    responsibility: "Features and fixes across frontend, backend and database",
    complexity: "Maintaining production web applications across three layers",
    ownership: "Fixes delivered for production releases",
    also: "Full Stack Developer, Ashvad Tech",
  },
  {
    when: "2026",
    title: "Systems",
    tech: "A TypeScript monorepo: React, Electron, Expo, SQLite, Hono, PostgreSQL",
    responsibility: "Architecture, three apps, an API and the release pipeline",
    complexity: "One interface on three runtimes, offline-first data, a sync protocol",
    ownership: "Tagged releases, release notes and postmortems",
    projects: ["noto"],
    also: "Master of Computer Applications, Integral University, 2026 onwards",
  },
];
