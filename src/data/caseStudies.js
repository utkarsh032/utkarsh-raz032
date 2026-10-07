// Long-form content for /projects/:slug, keyed by project slug. projects.js holds the card, stack and reference data.
//
// Content rules: every statement here was checked against the project's repository (code, release notes, docs).
// `null` fields render as a visible TODO, so gaps stay visible instead of being filled with invented detail.
//
// role, timeframe, status   shown in the hero
// claim        the ownership statement that opens "My role"; credit links the work it follows, if any
// facts        headline numbers in the hero: [{ value, label }]
// titles       chapter headings written as statements: { brief, role, system, stack, features, decisions, … }
// ownership    [{ title, layer, body, evidence }], layer is ui · api · data · ship
// system       architecture map: nodes placed on a grid ({ at: [column, row], span }), edges between them,
//              and traces that walk one scenario through the nodes. `soon` marks a part that is built but not wired.
// stackNotes   { technology: what it does in this system }
// features     [{ title, sees, under: [] }], with featureLabels naming the two columns
// decisions    [{ title, context, decision, consequence }]
// challenges   postmortems: [{ title, problem, investigation, solution, result, source }]
// deepDive     reference tabs: [{ id, label, title, body, points, code }]
// results      measured numbers only: [{ value, label }]

import { excerpts } from "./excerpts";

export const caseStudies = {
  noto: {
    oneLine:
      "A local-first notes and document workspace. One interface runs on web, desktop and Android, and every app is complete offline, with no account.",
    role: "Solo: architecture, apps, API and release pipeline",
    timeframe: "Aug 2026 — present",
    status: "v1.5.0 · in active development",
    claim:
      "Solo project. I own the architecture and the code on every platform: the shared packages, the three app shells, the API and the release pipeline.",
    facts: [
      { value: 3, label: "Runtimes from one UI shell" },
      { value: 3, label: "Storage engines behind one contract" },
      { value: 61, label: "Test files: 45 unit, 16 end-to-end" },
    ],
    titles: {
      brief: "Complete offline, on every platform.",
      system: "One shell, one storage contract, three drivers.",
      features: "What you see, and what runs underneath.",
      challenges: "What broke, and what fixed it.",
      results: "What shipped, measured.",
    },
    overview:
      "NOTO keeps local storage as the primary working layer, so every app is fully usable offline and without an account. Web, desktop and Android render the same shell from one UI package and differ only in the storage driver underneath, inside a pnpm and Turborepo monorepo. Accounts are optional. The sync engine and its server are built and tested, and not yet switched on in the apps.",
    problem:
      "Notes tools tend to force a trade-off: an offline-first app tied to one device, or a cloud app that stops working without a connection. The goal was a workspace that is complete offline on every platform, with the cloud as an addition rather than a requirement.",
    requirements: [
      "Fully usable offline, with no account",
      "Web, desktop and Android from the same product code",
      "One storage behaviour on every platform",
      "Cloud services layered on top, never required",
      "Releases that can't target the wrong update feed",
    ],
    ownership: [
      {
        title: "Architecture",
        layer: "api",
        body: "The monorepo layout, the storage contract and the single seam that lets three runtimes share one interface.",
        evidence: "packages/database/src/types.ts · packages/ui/src/app/data-context.ts",
      },
      {
        title: "Shared interface and editor",
        layer: "ui",
        body: "The NotoApp shell and design system, and an editor on Tiptap with custom search, invisible-character and keymap extensions.",
        evidence: "packages/ui · packages/editor · packages/core",
      },
      {
        title: "Storage",
        layer: "data",
        body: "One contract with nine repositories and three adapters, versioned migrations, and an outbox written in the same transaction as every change.",
        evidence: "packages/database",
      },
      {
        title: "App shells",
        layer: "ui",
        body: "Web on Vite, desktop on Electron with SQLite in the main process and a Quick Note dock, Android as an Expo shell around a WebView bridge.",
        evidence: "apps/web · apps/desktop · apps/mobile · apps/mobile-webview",
      },
      {
        title: "API and sync",
        layer: "api",
        body: "A Hono and PostgreSQL API for accounts, workspaces and sync, and a client sync engine with a written conflict rule. Built and tested; not yet switched on in the apps.",
        evidence: "apps/api · packages/sync · packages/backend",
      },
      {
        title: "Release and CI",
        layer: "ship",
        body: "An environment-aware release script, five GitHub Actions workflows, and tagged releases that build Windows, macOS, Linux and Android artifacts.",
        evidence: "noto-release.ps1 · .github/workflows",
      },
    ],
    system: {
      desc: "NOTO architecture. The shared shell in @noto/ui reads and writes through NotoDataContext, which is backed by the NotoDatabase contract in @noto/database. Three adapters implement the contract: Dexie on IndexedDB for web, SQLite over Electron IPC for desktop, and SQLite over a WebView bridge for Android. Each store keeps an outbox that the sync engine in @noto/sync will push to the API in apps/api; that last part is built but not yet wired into the apps.",
      cols: 3,
      nodes: [
        {
          id: "ui",
          label: "@noto/ui",
          sub: "NotoApp shell · design system",
          layer: "ui",
          at: [0, 0],
          span: 3,
          does: "The whole interface: routing, tabs, the editor, the command palette and settings. Every platform renders this same shell. On web and desktop, every screen but Home is loaded on demand.",
          tech: ["React 19", "Tailwind CSS 4", "Tiptap 3", "Zustand"],
        },
        {
          id: "ctx",
          label: "NotoDataContext",
          sub: "the platform seam",
          layer: "api",
          at: [0, 1],
          span: 3,
          does: "The one interface the shell reads and writes data through. Each app provides it at its root, so the shell never imports a storage engine and never knows which platform it is on.",
        },
        {
          id: "db",
          label: "@noto/database",
          sub: "NotoDatabase · 9 repositories",
          layer: "data",
          at: [0, 2],
          span: 3,
          does: "The storage contract. Workspaces, folders, documents, files, memory, versions, the outbox, sync state and local state, each as a repository. Every write stores the row and its outbox entry in one transaction.",
          tech: ["Schema v3", "Soft deletes", "Outbox"],
        },
        {
          id: "web",
          label: "Web",
          sub: "Dexie · IndexedDB",
          layer: "data",
          at: [0, 3],
          does: "The Dexie adapter. The web app reads through live queries, so two open browser tabs stay in step without extra code.",
          tech: ["Dexie 4", "Vite 8"],
        },
        {
          id: "desktop",
          label: "Desktop",
          sub: "SQLite over IPC",
          layer: "data",
          at: [1, 3],
          does: "The SQLite adapter with an IPC driver. SQL runs in Electron's main process on node:sqlite in WAL mode; the sandboxed renderer reaches it through checked channels named noto:<area>:<verb>.",
          tech: ["Electron 43", "node:sqlite"],
        },
        {
          id: "android",
          label: "Android",
          sub: "SQLite over a WebView bridge",
          layer: "data",
          at: [2, 3],
          does: "The same SQLite adapter with a bridge driver. The interface runs in a WebView and posts each query to the Expo shell, which runs it on expo-sqlite and resolves the reply by id.",
          tech: ["Expo 57", "expo-sqlite", "react-native-webview"],
        },
        {
          id: "sync",
          label: "@noto/sync",
          sub: "engine + conflict rule · not wired yet",
          layer: "ship",
          at: [0, 4],
          span: 2,
          soon: true,
          does: "Drains the outbox: pushes up to 200 changes or 4 MB at a time, pulls pages of 500 after a cursor, and resolves conflicts on the device. Built and tested, including against the real server. No app starts it yet.",
        },
        {
          id: "api",
          label: "apps/api",
          sub: "Hono · PostgreSQL",
          layer: "api",
          at: [2, 4],
          soon: true,
          does: "Accounts, workspaces and the sync routes. Each change is applied as a version-checked upsert in one transaction, under row-level security scoped to the signed-in user.",
          tech: ["Hono", "Kysely", "PostgreSQL", "argon2id"],
        },
      ],
      edges: [
        { from: "ui", to: "ctx" },
        { from: "ctx", to: "db" },
        { from: "db", to: "web" },
        { from: "db", to: "desktop" },
        { from: "db", to: "android" },
        { from: "web", to: "sync" },
        { from: "desktop", to: "sync" },
        { from: "android", to: "sync" },
        { from: "sync", to: "api" },
      ],
      traces: [
        {
          label: "Save an edit",
          steps: [
            { node: "ui", note: "You type. The editor waits 600 ms, then saves. It also flushes when the tab is hidden or the editor closes." },
            { node: "ctx", note: "The shell calls the data context. It has no idea which platform it is running on." },
            { node: "db", note: "documents.put writes the row and its outbox entry in one transaction." },
            { node: "desktop", note: "On desktop the SQL crosses IPC to SQLite in the main process. On web it is a Dexie transaction; on Android it crosses the bridge." },
          ],
        },
        {
          label: "Open on Android",
          steps: [
            { node: "android", note: "The Expo shell loads the interface from the app's own assets. Nothing is fetched." },
            { node: "ui", note: "NotoApp starts inside the WebView. It is the same build of @noto/ui." },
            { node: "ctx", note: "The mobile build provides the data context with a bridge-backed database." },
            { node: "db", note: "The SQLite adapter runs unchanged. Only its driver differs." },
            { node: "android", note: "Each query is posted to native code as { id, channel, payload } and answered by resolving the same id." },
          ],
        },
        {
          label: "Sync (built, not on yet)",
          steps: [
            { node: "desktop", note: "Every local write is already queued in the outbox, one entry per entity." },
            { node: "sync", note: "The engine pushes the oldest entries and pulls what other devices changed. A stale change comes back as a conflict and is resolved here." },
            { node: "api", note: "The server applies each change as a version-checked upsert. This path is tested against PostgreSQL; no app starts the engine yet." },
          ],
        },
      ],
      footnote: "+ @noto/core (commands, stores) · @noto/editor (Tiptap) · @noto/backend · @noto/config · @noto/types",
    },
    stackNotes: {
      React: "Version 19. One component tree, NotoApp, rendered by all three apps.",
      TypeScript: "Every package is consumed as TypeScript source, so packages/* have no build step.",
      "Tailwind CSS": "Version 4, driven by semantic design tokens in @noto/config, so a theme is a variable swap.",
      Tiptap: "Editor foundation on ProseMirror, with three custom extensions: search, invisible characters, and a keymap built from the command registry.",
      Zustand: "Stores in @noto/core for settings, interface state and tabs.",
      Electron: "Desktop shell. The renderer is sandboxed with context isolation; SQLite and file access stay in the main process behind checked IPC.",
      Expo: "Android shell: a WebView for the interface, plus native SQLite, print, share and app lock.",
      Hono: "HTTP framework for apps/api: accounts, workspaces and the sync routes.",
      PostgreSQL: "Server database, with row-level security scoped to the signed-in user in each transaction.",
      Kysely: "Typed query builder over pg.",
      Supabase: "The original account backend, still selectable at build time.",
      Dexie: "The IndexedDB adapter on web. Live queries keep open tabs in step.",
      SQLite: "node:sqlite in the Electron main process and expo-sqlite on Android, behind one SQL driver interface.",
      pnpm: "Workspaces for six apps, eight packages and shared tooling.",
      Turborepo: "The task graph for build, lint, typecheck and tests.",
      Vitest: "Unit tests, including one storage contract suite that runs against all three engines.",
      Playwright: "End-to-end specs, run against the built web app.",
      "GitHub Actions": "Five workflows: CI, web, desktop, mobile and tagged release.",
      "Cloudflare Workers": "Hosts the web app and the website as static assets.",
    },
    features: [
      {
        title: "Autosave and crash recovery",
        sees: "The document saves as you type and shows whether it is saved, unsaved or saving. After a crash, NOTO offers the unsaved text back.",
        under: [
          "Edits debounce for 600 ms, and flush when the tab is hidden, the editor closes, or you save or print",
          "A recovery snapshot is written on every edit to the local_state table, not to browser storage that can be cleared",
          "On reopening, the snapshot is offered back as a choice",
        ],
      },
      {
        title: "The same editor on a phone",
        sees: "Tabs, find and replace, formatting, tables and task lists on Android, identical to desktop.",
        under: [
          "The Expo shell loads the @noto/ui build from the app's own assets",
          "The WebView posts { id, channel, payload } to native code, and the reply is resolved by id",
          "Printing and saving a file stay native, reached across the same bridge",
        ],
      },
      {
        title: "Quick Note dock",
        sees: "Close the main window on desktop and a small always-on-top dock stays on screen for a quick note.",
        under: [
          "A second frameless window loads the same renderer bundle at #/dock",
          "Closing the main window hides it and shows the dock; the app holds a single-instance lock",
          "The main process owns the dock's position, and answers whether a press was a click or a drag",
        ],
      },
      {
        title: "Command palette and shortcuts",
        sees: "Ctrl or Cmd + K opens a palette of every command, and the same commands have keyboard shortcuts.",
        under: [
          "One registry, CORE_COMMANDS, defines each command and its accelerator",
          "The editor's keymap is built from that registry",
          "Desktop global shortcuts look their keys up in the same registry",
        ],
      },
      {
        title: "Version history",
        sees: "Each document keeps its own history on the device. You can preview a version, compare two and restore one.",
        under: [
          "At most one automatic version every ten minutes, and the newest 50 are kept",
          "Versions stay local; they are not queued for sync",
          "Comparison uses a diff in @noto/core",
        ],
      },
      {
        title: "Files in and out",
        sees: "Open and save real files on disk. Export Markdown, text, HTML, JSON and Word; import text, Markdown, JSON and HTML.",
        under: [
          "The browser uses the File System Access API; desktop goes through native dialogs",
          "On desktop, reads and writes are allowed only for paths a dialog or the OS handed over",
          "Word export is written by NOTO's own DOCX writer",
        ],
      },
    ],
    decisions: [
      {
        title: "One storage contract, three adapters",
        context: "Web has IndexedDB; desktop and Android have SQLite. Writing queries per platform would let behaviour drift.",
        decision:
          "packages/database defines one contract, NotoDatabase, with in-memory, Dexie and SQLite adapters. The SQLite adapter talks to a small driver interface, implemented once over Electron IPC and once over the Android bridge.",
        consequence:
          "Query semantics are written once, and one contract test suite runs against all three engines. The cost is that every storage feature has to be expressed in both IndexedDB and SQL.",
      },
      {
        title: "Android runs the same interface in a WebView",
        context: "Tiptap and ProseMirror need a DOM, so a native React Native editor could not load @noto/editor at all.",
        decision:
          "The Expo app is a shell. It packages the @noto/ui build into the APK and bridges to native SQLite over postMessage, the same shape as Electron IPC.",
        consequence:
          "Tabs, find and replace, history and formatting are not ported; they are the same code running on Android. The price is a bridge: every query crosses it as JSON.",
      },
      {
        title: "Write the outbox before sync exists",
        context: "Sync was planned from the start, but it was not the first thing to ship.",
        decision: "Every local write stores its row and an outbox entry in the same transaction, one entry per entity.",
        consequence:
          "The apps already carry an ordered record of unsynced changes, so switching sync on is wiring an engine, not migrating data. Until then, nothing drains the outbox.",
      },
      {
        title: "Conflicts never drop text",
        context: "Two devices can edit the same document while offline.",
        decision:
          "A delete beats an edit. If two bodies differ, the local one stays in the editor and the server's is kept as a version. Everything else is last-writer-wins on the update time.",
        consequence:
          "There is no merge logic to get wrong and no silently lost paragraph. Sometimes a person has to reconcile two versions by hand. The rule is built and tested, and not yet live.",
      },
      {
        title: "The marketing website is a separate app",
        context: "A visitor who only wants a download link shouldn't download the editor, the stores and the storage layer.",
        decision: "apps/website is its own static application. It shares design tokens and release metadata with the product, and none of its interface code.",
        consequence: "The public site stays small, and the product bundle stays free of marketing concerns.",
      },
      {
        title: "Releases fail rather than guess",
        context: "Two packages of the same version differ only in their update feed, which you can't tell from the file name.",
        decision:
          "The release script builds from environment overlay files. A non-interactive run with no environment fails, and a missing field aborts the build by name.",
        consequence: "A package can't silently ship pointing at the wrong feed, and adding an overlay file adds an environment everywhere at once.",
      },
    ],
    challenges: [
      {
        title: "The packaged desktop app exited at startup, silently",
        problem: "The installed Windows app showed no window, no message and no log. It simply exited.",
        investigation:
          "Documents are stored through Node's built-in node:sqlite. That module is still experimental and missing from builtinModules, the list the main-process bundler used to decide what to leave external. It was bundled as an ordinary dependency, could not be resolved, and was replaced with an empty module, with a warning rather than a failure. The database then opened against nothing, before the first window existed, and the error was discarded.",
        solution: "node:sqlite is declared external explicitly, and an import the bundler cannot resolve now fails the build outright.",
        result: "Fixed in 1.1.1. The second change is the lasting one: this shape of defect can no longer pass as a successful build.",
        source: "docs/releases/1.1.1.md",
      },
      {
        title: "Editing a formatted document on Android flattened it",
        problem:
          "The Android editor read a document as plain text and wrote it back the same way. Opening one with headings, tables, images or links and typing a single character replaced all of it with unformatted paragraphs.",
        investigation:
          "Tiptap and ProseMirror need a DOM, so a native React Native editor could not load @noto/editor at all. Android had its own smaller screens, and trailed every release by however long it took to port a feature a second time.",
        solution:
          "The Expo app became a shell around the real interface. It packages the @noto/ui build into the APK and serves it over a postMessage bridge to native SQLite, the arrangement Electron already used over IPC.",
        result: "From 1.3.0, tabs, find and replace, history and formatting are not ported to Android. They are the same code running there, and documents stay on the device as before.",
        source: "docs/releases/1.2.0.md · docs/releases/1.3.0.md",
      },
      {
        title: "A hung macOS build cost a release",
        problem:
          "Version 1.1.2 was never published. macOS on Apple Silicon sat in the packaging step for the full 45-minute limit while the other four platforms finished in under three, and the timeout cancelled the whole run. Four working installers were built and discarded.",
        investigation:
          "hdiutil, which builds the macOS disk image, intermittently stops responding on hosted build machines: no output, no error, nothing in the log. Packaging is the one release step that hangs rather than fails.",
        solution: "Each packaging attempt now has its own deadline and is retried. Every job also builds the tag it was asked for, not the branch the run started from.",
        result: "A stall that clears on a second try costs a few minutes instead of the release, and a genuinely broken build fails loudly instead of reading as cancelled.",
        source: "docs/releases/1.1.3.md",
      },
      {
        title: "A 104 MB Android download",
        problem: "The published Android APK was 104 MB.",
        investigation:
          "The Expo template builds one universal APK holding four ABIs and stores the native libraries uncompressed. React Native, Hermes, the Expo modules and SQLite shipped four times over, about three quarters of a download that no single phone could use.",
        solution:
          "A config plugin edits the generated Android project: one APK per ABI, R8 and resource shrinking, a compressed JS bundle and native libraries, and Fresco's unused GIF and WebP codecs removed.",
        result: "Measured on a clean release build: the arm64 APK went from 104 MB to 16.0 MB, and the 32-bit build is 15.1 MB.",
        source: "docs/development/android-studio.md",
      },
      {
        title: "Sign-in failed only in production",
        problem: "Signing in and creating an account failed on the deployed web app with “Could not reach the server. Check your connection.”",
        investigation:
          "The Edge Functions allowed browser requests only from noto.app, a domain that does not exist yet. Every call from the real address was refused by the browser before it was sent, so nothing reached a function and nothing could log it. localhost was allowed by a separate rule, which kept the fault invisible until deployment.",
        solution: "The CORS allow-list now names the address NOTO is actually served from.",
        result: "Sign-in works on the deployed web app, from 1.4.1.",
        source: "docs/releases/1.4.1.md",
      },
    ],
    deepDive: [
      {
        id: "contract",
        label: "Storage contract",
        title: "One interface, three engines",
        body: "Application and interface code depends on NotoDatabase only. Dexie implements it on web. One SQLite adapter implements it on desktop and Android, over a driver that crosses Electron IPC or the WebView bridge.",
        points: [
          "Nine repositories: workspaces, folders, documents, files, memory, versions, outbox, sync and local state",
          "Schema version 3, migrated through PRAGMA user_version on SQLite and Dexie versions on web",
          "Rows are soft-deleted with a deleted_at tombstone",
          "One contract test suite runs against the in-memory adapter, node:sqlite and fake-indexeddb, including upgrades from version 1",
        ],
        code: excerpts.notoContract,
      },
      {
        id: "bridge",
        label: "Android bridge",
        title: "A request, an id, a reply",
        body: "The interface inside the WebView can't open a database. It posts a request to the Expo shell and keeps a promise under the request's id; native code runs the work and resolves that id.",
        points: [
          "Ten channels: SQL execute and select, print, file save, session load, save and clear, intake, and two for app lock",
          "Transactions are plain BEGIN, COMMIT and ROLLBACK sent from the WebView",
          "The interface is built as one classic script, because a module script is CORS-checked against the file:// origin",
        ],
        code: excerpts.notoBridge,
      },
      {
        id: "sync",
        label: "Sync",
        title: "Built and tested, not switched on",
        body: "Every local write already lands in an outbox, in the same transaction as the row. The engine that drains it is tested with two engines talking to the real server routes on PostgreSQL. No app starts it yet, so this is design and code, not a shipped feature.",
        points: [
          "Push takes the oldest entries, up to 200 changes or 4 MB; pull pages 500 at a time after a stored cursor",
          "The server applies each change as a version-checked upsert in one transaction",
          "A failed pass retries at 1 s, 2 s, 4 s and so on, capped at five minutes, with jitter",
          "The conflict rule below: a delete wins, two bodies are never merged or dropped, the rest is last-writer-wins",
        ],
        code: excerpts.notoConflict,
      },
      {
        id: "desktop",
        label: "Desktop security",
        title: "The renderer is not trusted",
        body: "The desktop renderer runs the same web code as the browser, so the main process treats it as untrusted. Everything privileged sits behind IPC that checks who is calling.",
        points: [
          "Context isolation on, Node integration off and the sandbox on, for both windows",
          "Every privileged handler rejects a caller that is not the app's own top-level frame",
          "New windows are denied, navigation away from the app is blocked, and external links must be https",
          "The SQL channel refuses ATTACH, DETACH, VACUUM INTO and load_extension, and allows only four pragmas",
          "File reads and writes are limited to paths a dialog or the OS handed over",
        ],
      },
      {
        id: "release",
        label: "Release",
        title: "Fail rather than guess",
        body: "A Production and a Staging package of the same version are identical apart from the update feed baked into them. The release script therefore refuses to pick an environment on its own.",
        points: [
          "Environments are overlay files; a missing required field aborts the build and names the field",
          "Runs format check, lint, typecheck and tests, then packages and checks the executable exists",
          "Verifies the Squirrel release manifest and writes SHA-256 sums for every artifact",
          "Every abort restores the generated environment file and prints what was found and how to fix it",
        ],
        code: excerpts.notoRelease,
      },
      {
        id: "testing",
        label: "Testing and CI",
        title: "Tested at three levels",
        body: "Units for the logic, a contract suite for the storage engines, and end-to-end specs against the built web app.",
        points: [
          "45 Vitest files and 16 Playwright specs",
          "API suites run against a real PostgreSQL database, created and dropped per file",
          "CI runs format check, lint, typecheck and tests on every pull request",
          "A version tag builds Windows, macOS, Linux and Android artifacts and publishes a GitHub Release with checksums",
          "An Android emulator smoke test runs through Maestro",
        ],
      },
    ],
    results: [
      { value: "104 → 16 MB", label: "Android APK, arm64" },
      { value: "1,012 → 376 kB", label: "Web entry bundle, in 1.3.0" },
      { value: 5, label: "Desktop builds per release: Windows, macOS, Linux" },
      { value: "1.5.0", label: "Current version" },
    ],
    outcome:
      "Web, desktop and Android run one interface on one storage contract. Releases are cut from tags by CI, and the release script refuses to build a package for an unknown update feed.",
    lessons: null,
    takeaways: [
      "One UI shell on three runtimes",
      "One storage contract, tested against three engines",
      "A sync engine with a written conflict rule, tested against PostgreSQL",
      "A release pipeline that fails rather than guesses",
    ],
  },

  onemart: {
    oneLine:
      "The backend of a marketplace: authentication, catalog, cart, wishlist, orders, payment records, vendor onboarding and sales analytics, as one REST API.",
    role: "Solo build",
    timeframe: "Sep 2025",
    claim: "Solo build. Every commit is mine: eight routers, seven models and the guards in front of them, merged as one pull request per feature.",
    facts: [
      { value: 28, label: "REST endpoints" },
      { value: 8, label: "Routers" },
      { value: 7, label: "Mongoose models" },
      { value: 4, label: "Aggregation reports" },
    ],
    titles: {
      brief: "Three kinds of user, one API.",
      system: "The path of a request.",
      features: "What a client can do, and what the server does about it.",
    },
    overview:
      "OneMart is built with Node.js, Express 5 and MongoDB. Eight routers cover authentication, the product catalog, cart, wishlist, orders, payment records, vendor onboarding and sales analytics. Requests carry a JWT, and handlers check the caller's role before anything that changes the catalog, an order's status, a payment or a vendor's standing.",
    problem:
      "A marketplace has three kinds of users (customers, vendors and administrators), and each should reach only its own part of the API. Catalog and order data also has to support analytics without moving the work into application code.",
    requirements: [
      "Authentication with hashed passwords and tokens",
      "Customer, vendor and admin roles",
      "Product catalog, cart, wishlist and order workflows",
      "Payment records for orders",
      "Sales reports computed in the database",
    ],
    ownership: [
      {
        title: "API surface",
        layer: "api",
        body: "28 endpoints across eight Express routers, each feature merged through its own pull request.",
        evidence: "server.js · API/Routers",
      },
      {
        title: "Authentication and access control",
        layer: "api",
        body: "Token issuing and verification, password hashing in a pre-save hook, and role checks on admin-only operations.",
        evidence: "API/middleware · API/Controllers/authController.js",
      },
      {
        title: "Data model",
        layer: "data",
        body: "Seven Mongoose models with enums, references and unique keys, including one cart and one wishlist per user.",
        evidence: "API/Schemas",
      },
      {
        title: "Analytics",
        layer: "data",
        body: "Four aggregation pipelines over orders: a sales summary, revenue by month, top products and top customers.",
        evidence: "API/Controllers/adminAnalytics/analyticsController.js",
      },
    ],
    system: {
      desc: "OneMart request path. A client sends JSON to the Express app, which mounts eight routers under /api. Protected routes pass through the protect middleware, which verifies the JWT and reloads the user. Admin-only operations then check the user's role. A controller per domain handles the request and reads or writes MongoDB through seven Mongoose models.",
      cols: 1,
      nodes: [
        {
          id: "client",
          label: "client",
          sub: "JSON · Bearer token",
          layer: "ui",
          tag: "Caller",
          at: [0, 0],
          does: "Any HTTP client. It sends JSON and, after logging in, an Authorization: Bearer token.",
        },
        {
          id: "app",
          label: "Express app",
          sub: "8 routers under /api",
          layer: "api",
          at: [0, 1],
          does: "server.js parses JSON, mounts the eight routers, and ends with one error-handling middleware. Guards are attached per route, not per router.",
          tech: ["Node.js", "Express 5"],
        },
        {
          id: "protect",
          label: "protect",
          sub: "JWT · user reloaded",
          layer: "api",
          at: [0, 2],
          does: "Verifies the bearer token, then loads the user from MongoDB. Authorization uses that record, not the role inside the token, so a role change applies on the next request.",
          tech: ["jsonwebtoken"],
        },
        {
          id: "roles",
          label: "role checks",
          sub: "admin · owner",
          layer: "api",
          at: [0, 3],
          does: "Admin-only operations check the reloaded user's role: isAdmin middleware on the vendor routes, and a check inside the product, order and payment handlers. An order can be read by its owner or an admin.",
        },
        {
          id: "controllers",
          label: "controllers",
          sub: "one per domain",
          layer: "api",
          at: [0, 4],
          does: "Auth, product, cart, wishlist, order, transaction, vendor and analytics. Each returns JSON; the order, product and payment handlers validate object ids first.",
        },
        {
          id: "db",
          label: "MongoDB",
          sub: "7 models · aggregation",
          layer: "data",
          at: [0, 5],
          does: "User, Product, Cart, Wishlist, Order, Payment and Vendor. The sales reports run here as aggregation pipelines on the orders collection.",
          tech: ["MongoDB", "Mongoose 8"],
        },
      ],
      edges: [
        { from: "client", to: "app" },
        { from: "app", to: "protect" },
        { from: "protect", to: "roles" },
        { from: "roles", to: "controllers" },
        { from: "app", to: "controllers" },
        { from: "protect", to: "controllers" },
        { from: "controllers", to: "db" },
      ],
      traces: [
        {
          label: "Add to cart",
          steps: [
            { node: "client", note: "POST /api/cart/add with a product id and a quantity." },
            { node: "app", note: "The cart router picks the request up." },
            { node: "protect", note: "The token is verified and the user loaded. No role is needed here." },
            { node: "controllers", note: "addToCart reserves stock with a single conditional update, then saves the cart line with the price at that moment." },
            { node: "db", note: "The update matches only while stock is at least the quantity. No match returns 400, Insufficient stock." },
          ],
        },
        {
          label: "Approve a vendor",
          steps: [
            { node: "client", note: "PATCH /api/vendors/:id/status from an administrator." },
            { node: "app", note: "The vendor router picks the request up." },
            { node: "protect", note: "The token is verified and the user reloaded from the database." },
            { node: "roles", note: "isAdmin answers 403 unless that user's role is admin." },
            { node: "controllers", note: "updateVendorStatus sets the vendor to pending, approved or rejected." },
            { node: "db", note: "The vendor document is updated." },
          ],
        },
      ],
    },
    stackNotes: {
      "Node.js": "The runtime. The project is ES modules throughout.",
      Express: "Version 5. Eight routers mounted under /api, with guards attached per route.",
      JWT: "Seven-day tokens carrying the user id and role, sent in the Authorization header.",
      bcrypt: "Hashes passwords in a pre-save hook. The password field is left out of queries unless asked for.",
      MongoDB: "Seven collections. The sales reports run as aggregation pipelines on orders.",
      Mongoose: "Schemas with enums, references and unique keys; one cart and one wishlist per user.",
      Render: "Hosts the API as a web service.",
    },
    features: [
      {
        title: "Sign up and log in",
        sees: "A client registers with a name, email and password, or logs in, and gets a token back.",
        under: [
          "User.create triggers the pre-save hook, which salts and hashes the password with bcrypt",
          "generateToken signs { id, role } with a seven-day expiry",
          "Unknown email and wrong password get the same 401, so the response doesn't reveal which accounts exist",
        ],
      },
      {
        title: "Browse the catalog",
        sees: "Anyone can list products with paging, keyword search and sorting, or open a single product.",
        under: [
          "GET /api/product and /api/product/:id are the public routes",
          "Keyword search matches by regular expression; category is indexed",
          "Object ids are validated before the query runs",
        ],
      },
      {
        title: "Add to cart",
        sees: "A signed-in customer adds a product and a quantity, or is told there is not enough stock.",
        under: [
          "One findOneAndUpdate matches only while stock is at least the quantity, and decrements it in the same operation",
          "The cart line stores priceAtAdd, taken from the product, not from the request",
          "Removing a line puts its quantity back into stock",
        ],
      },
      {
        title: "Place and track an order",
        sees: "A customer creates an order, lists their own orders and opens one. An admin moves it from processing to shipped to delivered.",
        under: [
          "An order references its user and each product",
          "Reading one is limited to its owner or an admin",
          "Status changes check for the admin role",
        ],
      },
      {
        title: "Record a payment",
        sees: "A payment is recorded against an order by cash on delivery, card, UPI or wallet.",
        under: [
          "createPayment rejects an amount that doesn't equal the order total",
          "A payment starts as pending; only an admin can mark it completed or failed",
          "The transaction id is unique but optional, through a sparse index",
        ],
      },
      {
        title: "Vendor onboarding",
        sees: "A signed-in user registers a business and can read their vendor profile. An admin lists vendors and approves or rejects them.",
        under: [
          "One vendor profile per user, enforced by a unique key",
          "A vendor is pending, approved or rejected",
          "The list and status routes sit behind protect and isAdmin",
        ],
      },
      {
        title: "Sales reports",
        sees: "Four reports: a sales summary, revenue by month, the five best-selling products and the five highest-spending customers.",
        under: [
          "Each report is one aggregation pipeline on the orders collection",
          "Top products unwinds order items, groups by product, sorts, limits to five and joins product details",
          "The work happens in MongoDB, not in application code",
        ],
      },
    ],
    decisions: [
      {
        title: "JWT with bcrypt-hashed credentials",
        context: "The API is stateless and consumed by separate clients.",
        decision:
          "Passwords are hashed with bcrypt in a pre-save hook. Requests carry a seven-day JWT in the Authorization header, which the protect middleware verifies.",
        consequence: "No server-side session store is needed, and credentials are never stored in plain text.",
      },
      {
        title: "Reload the user on every request",
        context: "A token carries the role it was issued with, and roles change: a user becomes a vendor when they register a business.",
        decision: "protect verifies the token, then loads the user from MongoDB and authorizes against that record instead of the token's role claim.",
        consequence: "A role change applies on the next request. The cost is one extra query per authenticated request.",
      },
      {
        title: "Reserve stock with one conditional update",
        context: "Two customers can add the last unit of a product at the same moment.",
        decision: "addToCart uses a single findOneAndUpdate that matches only while stock is at least the requested quantity, and decrements in the same operation.",
        consequence: "Concurrent requests can't take stock below zero, without a transaction. Stock is held from the moment an item is in a cart.",
      },
      {
        title: "Reports as aggregation pipelines",
        context: "The reports read across every order.",
        decision: "Each report is an aggregation pipeline: $group for totals, $unwind and $lookup for the product and customer rankings.",
        consequence: "Reports run in the database rather than in application code.",
      },
    ],
    challenges: null,
    deepDive: [
      {
        id: "auth",
        label: "Authentication",
        title: "Token in, user record out",
        body: "protect is the guard on 24 of the 28 endpoints. It reads the bearer token, verifies it, and attaches the user loaded from the database, without the password.",
        points: [
          "Tokens are signed with JWT_SECRET and expire after seven days",
          "The role comes from the database on each request, so it is always current",
          "Admin-only handlers then check that role; orders also accept their owner",
        ],
        code: excerpts.onemartGuard,
      },
      {
        id: "stock",
        label: "Stock",
        title: "A stock check that can't race",
        body: "Checking stock and then decrementing it in two steps lets two requests both pass the check. Here the check is the filter of the update itself.",
        points: ["The update matches only while stock ≥ quantity", "No match means not enough stock: 400", "Removing a cart line adds the quantity back"],
        code: excerpts.onemartStock,
      },
      {
        id: "analytics",
        label: "Analytics",
        title: "Top products, in one pipeline",
        body: "Order items are unwound, grouped by product with units sold and revenue, sorted, limited to five and joined to their product documents.",
        code: excerpts.onemartTopProducts,
      },
    ],
    results: null,
    lessons: null,
    takeaways: [
      "28 endpoints across eight routers",
      "The caller's role is re-read from the database on every request",
      "Stock reserved with one atomic update",
      "Four sales reports as aggregation pipelines",
    ],
  },

  "sql-data-warehouse": {
    oneLine: "A SQL Server warehouse that merges CRM and ERP sales data into one analytical model, built by working through a public course project.",
    role: "Course project, implemented end to end",
    timeframe: "Mar 2026",
    claim:
      "A course project. I built this warehouse by following Data With Baraa's SQL Data Warehouse project: the layering, cleansing rules and star schema are the course's design. The bronze load procedure and its logging are my own version.",
    credit: {
      text: "Based on",
      label: "Data With Baraa · SQL Data Warehouse Project",
      href: "https://github.com/DataWithBaraa/sql-data-warehouse-project",
    },
    facts: [
      { value: 6, label: "Source CSV files" },
      { value: 116294, label: "Source rows" },
      { value: 12, label: "Bronze and silver tables" },
      { value: 3, label: "Gold views" },
    ],
    titles: {
      brief: "Two systems, one model.",
      role: "What I did, and what the course designed.",
      system: "Bronze, silver, gold.",
      features: "What each layer does to the data.",
      decisions: "Why the pipeline is shaped this way.",
    },
    overview:
      "A data warehouse on SQL Server that consolidates sales data from two source systems, a CRM and an ERP, delivered as six CSV files. Data lands in a bronze schema as delivered, is cleaned and standardised into silver, and is exposed in gold as two dimension views and a fact view.",
    problem:
      "Two source systems describe the same customers and products in different formats and with data-quality issues. Analysts need one clean, unified model they can query directly.",
    requirements: [
      "Import CRM and ERP data from CSV",
      "Cleanse, validate and resolve data-quality issues before loading",
      "Combine both sources into one model optimized for analytical queries",
      "Scope: latest dataset only, with no historization",
      "Document the data model for business and analytics users",
    ],
    ownership: [
      {
        title: "Bronze load procedure",
        layer: "data",
        body: "My version of the course's loader: truncate and BULK INSERT for six tables, with a timed log line per table and a total for the batch.",
        evidence: "scripts/bronze/proc_load_bronze.sql",
      },
      {
        title: "Silver and gold scripts",
        layer: "data",
        body: "Implemented as the course defines them: the cleansing rules, the star schema and the rule for which source wins.",
        evidence: "scripts/silver · scripts/gold",
      },
      {
        title: "Checks and documentation",
        layer: "ship",
        body: "The course's quality-check queries, data catalog and naming conventions, kept alongside the scripts.",
        evidence: "tests · docs",
      },
    ],
    system: {
      desc: "Warehouse data flow. Three CRM files and three ERP files are bulk loaded into six bronze tables as delivered. A stored procedure rebuilds six silver tables from bronze with cleansing and standardisation. Gold is three views over silver: dim_customers, dim_products and fact_sales.",
      cols: 2,
      nodes: [
        {
          id: "crm",
          label: "CRM",
          sub: "cust_info · prd_info · sales_details",
          layer: "ui",
          tag: "Source",
          at: [0, 0],
          does: "The customer master, the product master with a row per product version, and sales order lines. 79,289 rows in three CSV files.",
        },
        {
          id: "erp",
          label: "ERP",
          sub: "CUST_AZ12 · LOC_A101 · PX_CAT_G1V2",
          layer: "ui",
          tag: "Source",
          at: [1, 0],
          does: "Customer birthdate and gender, customer country, and product categories. 37,005 rows in three CSV files.",
        },
        {
          id: "bronze",
          label: "bronze",
          sub: "6 tables · as delivered",
          layer: "data",
          tag: "Raw layer",
          at: [0, 1],
          span: 2,
          does: "bronze.load_bronze truncates each table and reloads it with BULK INSERT, skipping the header row. Columns keep the source's names and loose types: sales dates arrive as integers.",
          tech: ["BULK INSERT", "TRUNCATE", "TRY…CATCH"],
        },
        {
          id: "silver",
          label: "silver",
          sub: "6 tables · cleaned",
          layer: "data",
          tag: "Clean layer",
          at: [0, 2],
          span: 2,
          does: "silver.load_silver rebuilds each table from bronze. Duplicate customers collapse to the newest row, codes become readable values, integer dates become real dates, and broken sales figures are recalculated.",
          tech: ["ROW_NUMBER", "LEAD", "CASE", "TRIM"],
        },
        {
          id: "gold",
          label: "gold",
          sub: "dim_customers · dim_products · fact_sales",
          layer: "data",
          tag: "Model layer",
          at: [0, 3],
          span: 2,
          does: "Three views over silver. Customers and products get surrogate keys, CRM and ERP attributes are joined, and the fact view carries those keys. Only current product versions are kept.",
          tech: ["Views", "LEFT JOIN", "ROW_NUMBER"],
        },
      ],
      edges: [
        { from: "crm", to: "bronze" },
        { from: "erp", to: "bronze" },
        { from: "bronze", to: "silver" },
        { from: "silver", to: "gold" },
      ],
      traces: [
        {
          label: "One customer's path",
          steps: [
            { node: "crm", note: "A customer row arrives from the CRM, possibly more than once, with gender as M, F or blank." },
            { node: "bronze", note: "Loaded exactly as delivered." },
            { node: "silver", note: "Duplicates collapse to the newest row by create date. M and F become Male and Female; a blank becomes n/a." },
            { node: "gold", note: "Joined to the ERP's birthdate, gender and country. The CRM's gender wins unless it is n/a." },
          ],
        },
      ],
    },
    stackNotes: {
      "SQL Server": "Hosts the DataWarehouse database, with one schema per layer.",
      "T-SQL": "Stored procedures for the loads, window functions for deduplication and versioning, views for the model.",
    },
    featureLabels: ["In the model", "In the SQL"],
    features: [
      {
        title: "One row per customer",
        sees: "The CRM file repeats some customers and leaves a few ids empty. Silver holds exactly one row for each.",
        under: [
          "Rows with a NULL customer id are dropped",
          "ROW_NUMBER() partitions by customer id, newest create date first",
          "Only row 1 of each partition is kept",
        ],
      },
      {
        title: "Readable codes",
        sees: "Gender, marital status, product line and country read as words, with n/a for anything unknown.",
        under: [
          "UPPER(TRIM()) before each comparison, so stray spaces and case don't matter",
          "M and F, or S and M, map to full words; product lines map to Mountain, Road, Touring and Other Sales",
          "DE becomes Germany; US and USA become United States",
        ],
      },
      {
        title: "Sales figures that add up",
        sees: "In silver, sales equals quantity times price on every row, and impossible dates are empty rather than wrong.",
        under: [
          "A sales value that is missing, not positive, or not quantity × price is recalculated",
          "A missing or non-positive price is derived from sales and quantity",
          "An integer date that is 0 or not eight digits becomes NULL; the rest are cast to DATE",
        ],
      },
      {
        title: "Product versions without overlap",
        sees: "Each product version ends the day before the next one starts, and gold shows only the current version.",
        under: [
          "The source's end dates are discarded",
          "LEAD() over each product's start dates, minus one day, gives the new end date",
          "gold.dim_products keeps rows whose end date is NULL",
        ],
      },
      {
        title: "One customer from two systems",
        sees: "A customer in gold carries CRM names and status with ERP birthdate, country and gender.",
        under: [
          "Silver strips the NAS prefix and the dashes from ERP keys so they match the CRM's",
          "gold.dim_customers left-joins both ERP tables on that key",
          "The CRM is the primary source for gender; the ERP fills in when the CRM says n/a",
        ],
      },
    ],
    decisions: [
      {
        title: "Medallion layering: bronze, silver, gold",
        context: "Mixing raw loads with transformations makes failures hard to trace and data hard to reprocess.",
        decision: "Separate schemas for raw data (bronze), cleaned data (silver) and the business model (gold).",
        consequence: "Each layer can be rebuilt from the one below it, and a problem can be traced to a single step.",
      },
      {
        title: "Loads as stored procedures",
        context: "The pipeline runs entirely inside SQL Server.",
        decision: "bronze.load_bronze and silver.load_silver truncate and reload each table inside TRY…CATCH, and print how long each table took.",
        consequence: "A load can be run again at any time and gives the same result. A failure prints the error instead of stopping silently.",
      },
      {
        title: "Gold as views",
        context: "The business model should always reflect the latest silver data.",
        decision: "The gold layer is three views built over silver, not tables.",
        consequence: "There is no extra load step for gold, and analysts query it directly. Surrogate keys are computed when the view is read.",
      },
    ],
    challenges: null,
    deepDive: [
      {
        id: "load",
        label: "Bronze load",
        title: "Truncate, bulk insert, time it",
        body: "Each of the six tables is loaded the same way, and the procedure prints the duration per table and for the whole batch. This is the part of the pipeline I wrote my own version of.",
        code: excerpts.warehouseBronze,
      },
      {
        id: "dedup",
        label: "Deduplication",
        title: "Newest row per customer",
        body: "The CRM file contains repeated customer ids. A window function ranks each customer's rows by create date, and silver keeps the first.",
        code: excerpts.warehouseDedup,
      },
      {
        id: "sales",
        label: "Sales rules",
        title: "Repairing sales and price",
        body: "Sales and price are checked against each other. Whichever is missing or inconsistent is rebuilt from the other and the quantity.",
        code: excerpts.warehouseSales,
      },
      {
        id: "model",
        label: "Customer dimension",
        title: "Two sources, one customer",
        body: "The view joins the CRM customer to both ERP tables and decides which source to believe for gender.",
        code: excerpts.warehouseCustomers,
      },
      {
        id: "checks",
        label: "Quality checks",
        title: "Queries that should return nothing",
        body: "The checks are plain SELECT statements run by hand after a load. Most are written so that any row returned is a defect.",
        points: [
          "Silver: NULL or duplicate keys, untrimmed text, negative or missing cost, end dates before start dates",
          "Silver: order dates after shipping or due dates, and sales that don't equal quantity × price",
          "Gold: unique surrogate keys in both dimensions",
          "Gold: every fact row joins to a customer and a product",
        ],
      },
    ],
    results: null,
    lessons: null,
    takeaways: [
      "Six CSV files from two systems into one model",
      "Bronze, silver and gold schemas, each rebuildable from the one below",
      "Cleansing in stored procedures, the model as views",
    ],
  },
};
