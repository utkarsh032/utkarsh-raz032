// Long-form case studies rendered at /projects/:slug.
// `null` fields render as TODO blocks, so gaps stay visible instead of being filled with invented detail.

export const caseStudies = {
  noto: {
    name: "NOTO",
    oneLine: "A local-first notes and document workspace for web, desktop and Android.",
    role: "Design and build: architecture, apps, shared packages, release tooling",
    timeframe: "Aug 2026 — present",
    links: [{ label: "Repository", href: "https://github.com/utkarsh032/NOTO" }],
    overview:
      "NOTO keeps local storage as the primary working layer. The applications are fully usable offline and without an account, and cloud services are added progressively on top. Web, desktop and Android share one UI shell and one storage contract inside a Turborepo monorepo.",
    problem:
      "Notes tools tend to force a trade-off: an offline-first app tied to one device, or a cloud app that stops working without a connection. The goal was a workspace that is complete offline on every platform, with sync as an addition rather than a requirement.",
    requirements: [
      "Fully usable offline, with no account",
      "Web, desktop and Android from the same product code",
      "One storage behaviour on every platform",
      "Cloud sync layered on top, not required",
      "Releases that can't target the wrong update feed",
    ],
    decisions: [
      {
        title: "One storage contract, three adapters",
        context: "Web has IndexedDB, desktop and Android have SQLite. Writing queries per platform would let behaviour drift.",
        decision: "packages/database defines a single storage contract with Dexie, SQLite and in-memory implementations.",
        consequence: "The SQL and query semantics are written once. Tests can run against the in-memory adapter.",
      },
      {
        title: "Android runs the same UI in a WebView",
        context: "Tiptap and ProseMirror need a DOM. The leading React Native rich-text editors are themselves Tiptap in a WebView.",
        decision: "The Expo app packages the @noto/ui build into the APK and bridges to native SQLite over postMessage, the same shape as Electron IPC.",
        consequence: "Tabs, find and replace, history and formatting are not ported. They are the same code running on Android.",
      },
      {
        title: "The marketing website is a separate app",
        context: "A visitor who only wants a download link shouldn't download the editor, the store and the storage layer.",
        decision: "apps/website is its own static application that shares only the design tokens.",
        consequence: "The public site stays small. The product bundle stays free of marketing concerns.",
      },
      {
        title: "Releases fail rather than guess",
        context: "Two packages of the same version differ only in their update feed, which you can't tell from the file name.",
        decision: "The release script builds from environment overlay files. A non-interactive run with no environment fails, and a missing field aborts the build by name.",
        consequence: "A package can't silently ship pointing at the wrong feed. Adding an overlay file adds an environment everywhere at once.",
      },
    ],
    implementation: [
      "apps/web: React + Vite + Tailwind, IndexedDB via Dexie",
      "apps/desktop: React + Electron (Forge), SQLite in the main process, Quick Note dock window",
      "apps/mobile: Expo shell with WebView, SQLite connection, print and share",
      "packages/core: document, folder and workspace logic, commands, Zustand stores",
      "packages/editor: Tiptap + ProseMirror foundation",
      "packages/sync: sync contract, change queue, Supabase client",
      "Quality gates: ESLint, tsc --noEmit, Vitest unit tests, Playwright end-to-end tests",
    ],
    challenges: [
      {
        challenge: "A rich-text editor on Android without a second codebase",
        solution: "Ship the web UI build inside the APK and bridge storage to native SQLite over postMessage.",
      },
      {
        challenge: "Keeping the desktop Quick Note dock alive when the main window closes",
        solution: "A second always-on-top window renders the same @noto/ui panel from the same bundle, and closing the main window hides it to the tray.",
      },
      {
        challenge: "Intermittent Windows packaging failures while Defender scans fresh binaries",
        solution: "When the release script runs elevated, it adds a Defender exclusion for the output folder.",
      },
    ],
    results: null,
    lessons: null,
  },
  onemart: {
    name: "OneMart Backend",
    oneLine: "An e-commerce REST API with authentication, catalog, cart, orders, payments, vendor features and admin analytics.",
    role: "Design and build",
    timeframe: "Sep 2025",
    links: [
      { label: "Live API", href: "https://onemart-backend-exl9.onrender.com/" },
      { label: "Repository", href: "https://github.com/utkarsh032/OneMart-backend" },
    ],
    overview:
      "OneMart is an e-commerce backend built with Node.js, Express and MongoDB. It covers authentication, product catalog, cart, wishlist, orders and payments, plus separate vendor features and admin analytics, each behind its own middleware.",
    problem:
      "A marketplace has three kinds of users (customers, vendors and administrators), and each should reach only its own part of the API. Catalog and order data also has to support analytics without moving the work into application code.",
    requirements: [
      "Secure authentication with hashed passwords and tokens",
      "Separate customer, vendor and admin capabilities",
      "Product catalog, cart, wishlist and order workflows",
      "Payment records for orders",
      "Analytics for administrators",
    ],
    decisions: [
      {
        title: "JWT with bcrypt-hashed credentials",
        context: "The API is stateless and consumed by separate clients.",
        decision: "Passwords are hashed with bcrypt. Requests carry a JWT that authentication middleware verifies.",
        consequence: "No server-side session store is needed, and credentials are never stored in plain text.",
      },
      {
        title: "One middleware per role",
        context: "Vendor and admin routes must be unreachable to ordinary customers.",
        decision: "authMiddleware, vendorMiddleware and adminMiddleware sit in front of the matching routers.",
        consequence: "Authorization rules live in one place per role instead of inside each handler.",
      },
      {
        title: "Analytics in MongoDB",
        context: "Admin reporting reads across orders and products.",
        decision: "Use indexing and aggregation so the database does the heavy lifting.",
        consequence: "Analytics queries run in the database rather than in application code.",
      },
    ],
    implementation: [
      "server.js → Routers (auth, product, cart, wishlist, order, transaction, vendor, admin analytics)",
      "Controllers per domain, with vendor features and admin analytics in their own folders",
      "Mongoose schemas: user, product, cart, wishlist, order, payment, vendor",
      "Middleware: auth, vendor and admin guards",
      "Deployed on Render with MongoDB Atlas",
    ],
    challenges: null,
    results: null,
    lessons: null,
  },
  "sql-data-warehouse": {
    name: "SQL Data Warehouse",
    oneLine: "A SQL Server warehouse that merges CRM and ERP sales data into one analytical model.",
    role: "Design and build",
    timeframe: "Mar 2026",
    links: [{ label: "Repository", href: "https://github.com/utkarsh032/sql-data-warehouse-project" }],
    overview:
      "A data warehouse on SQL Server that consolidates sales data from two source systems, a CRM and an ERP, delivered as CSV files. Data moves through Bronze, Silver and Gold layers and ends as dimension views ready for analytics on customers, products and sales trends.",
    problem:
      "Two source systems describe the same customers and products in different formats and with data-quality issues. Analysts need one clean, unified model they can query directly.",
    requirements: [
      "Import CRM and ERP data from CSV",
      "Cleanse, validate and resolve data-quality issues before loading",
      "Combine both sources into one model optimized for analytical queries",
      "Scope: latest dataset only, with no historization",
      "Document the data model for business and analytics users",
    ],
    decisions: [
      {
        title: "Medallion layering: Bronze, Silver, Gold",
        context: "Mixing raw loads with transformations makes failures hard to trace and data hard to reprocess.",
        decision: "Separate schemas for raw data (bronze), cleaned data (silver) and the business model (gold).",
        consequence: "Each layer can be rebuilt from the one below it, and a problem can be traced to a single step.",
      },
      {
        title: "Loads as stored procedures",
        context: "The pipeline runs entirely inside SQL Server.",
        decision: "proc_load_bronze and proc_load_silver use BULK INSERT and transformations inside TRY/CATCH, with progress logging.",
        consequence: "Loads are repeatable, versioned with the schema, and report where they failed.",
      },
      {
        title: "Gold as views",
        context: "The business model should always reflect the latest Silver data.",
        decision: "The Gold layer is a set of views (for example gold.dim_customers and gold.dim_products) built over Silver.",
        consequence: "There's no extra load step for Gold, and analysts query it directly.",
      },
    ],
    implementation: [
      "scripts/init_database.sql: database and schemas",
      "scripts/bronze: DDL + proc_load_bronze (BULK INSERT from CRM and ERP CSVs)",
      "scripts/silver: DDL + proc_load_silver (cleansing and standardization)",
      "scripts/gold: dimension and fact views for reporting",
      "tests: quality_checks_silver.sql and quality_checks_gold.sql",
      "docs: data catalog and naming conventions",
    ],
    challenges: null,
    results: null,
    lessons: null,
  },
};

export const caseStudyOrder = ["noto", "onemart", "sql-data-warehouse"];
