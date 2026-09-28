// All project facts come from the resume, repository READMEs or GitHub.
// Anything unverified is left as `null` and rendered as a visible TODO.

export const featured = {
  slug: "noto",
  name: "NOTO",
  kicker: "Flagship · 2026 · in active development",
  summary:
    "A local-first notes and document workspace. It works fully offline with no account, on web, desktop and Android, and adds cloud sync on top.",
  stack: ["TypeScript", "React", "Electron", "Expo", "SQLite", "Turborepo"],
  tooling: ["pnpm", "Tiptap", "Dexie", "Supabase", "Vitest", "Playwright"],
  repo: "https://github.com/utkarsh032/NOTO",
  facets: [
    {
      key: "problem",
      label: "Problem",
      title: "Most notes apps make you choose between working offline and working across devices.",
      body: "NOTO treats local storage as the primary layer. Every app is fully usable offline and without an account, and cloud services are added progressively on top.",
      points: ["Offline-first on every platform", "No account required", "Same features on web, desktop and Android"],
    },
    {
      key: "system",
      label: "System",
      title: "One shell, one storage contract, three data sources.",
      body: "All three platforms render the same NotoApp shell from @noto/ui. They differ only in the data source they provide through NotoDataContext, so SQL and query semantics are written once.",
      points: [
        "Turborepo + pnpm internal packages (no build step for packages/*)",
        "Dexie on web, SQLite in Electron main, SQLite via a WebView bridge on Android",
        "@noto/sync: change queue to Supabase",
      ],
    },
    {
      key: "challenge",
      label: "Challenge",
      title: "Android. Tiptap and ProseMirror need a DOM.",
      body: "A native React Native editor would have meant a second, smaller NOTO kept in step by hand. The leading React Native rich-text editors are themselves Tiptap running in a WebView.",
      points: ["Keep feature parity without a second codebase", "Keep native SQLite on the device", "Avoid a fragile hand-synced editor"],
    },
    {
      key: "decision",
      label: "Decision",
      title: "Ship the same UI build inside the Android app.",
      body: "The Expo app packages the @noto/ui build into the APK and supplies data over a postMessage bridge to native SQLite. It is the same arrangement Electron uses over IPC.",
      points: [
        "Tabs, find/replace, history and formatting aren’t ported. They are the same code.",
        "Desktop adds an always-on-top Quick Note dock from the same bundle",
        "Global shortcuts dispatch the same command IDs as the command palette",
      ],
    },
    {
      key: "role",
      label: "My role",
      title: "Architecture, apps, shared packages and release tooling.",
      body: "I designed the monorepo layout and storage contract, built the web, desktop and mobile shells, and wrote the environment-aware release pipeline.",
      points: ["Commit history on GitHub", "Lint, typecheck, Vitest and Playwright gates", "Environment overlays for Production, Staging and Development"],
    },
    {
      key: "outcome",
      label: "Outcome",
      title: "Web, desktop and Android from one codebase.",
      body: "A single UI and a single storage contract across three runtimes, with a release process that refuses to build a package for an unknown update feed.",
      points: ["One shell rendered on 3 platforms", "3 storage adapters behind 1 contract"],
      todo: "Add a measured result (e.g. users, release version, sync latency)",
    },
  ],
  diagram: {
    title: "NOTO architecture",
    desc: "One shared UI package, @noto/ui, renders the same shell on web, desktop and mobile. Each platform supplies data through NotoDataContext: web uses Dexie on IndexedDB, desktop uses SQLite over Electron IPC, mobile uses SQLite over a WebView bridge. All three implement one storage contract in @noto/database. @noto/sync adds a change queue to Supabase.",
    viewBox: "0 0 720 316",
    nodes: [
      { x: 250, y: 16, w: 220, h: 46, title: "@noto/ui", sub: "shell + design system · NotoApp", tone: "ui" },
      { x: 40, y: 108, w: 180, h: 78, title: "WEB", ctx: "NotoDataContext", sub: "Dexie · IndexedDB" },
      { x: 270, y: 108, w: 180, h: 78, title: "DESKTOP", ctx: "NotoDataContext", sub: "SQLite over IPC" },
      { x: 500, y: 108, w: 180, h: 78, title: "MOBILE", ctx: "NotoDataContext", sub: "SQLite via WebView bridge" },
      { x: 250, y: 234, w: 220, h: 46, title: "@noto/database", sub: "one storage contract · 3 adapters", tone: "data" },
      { x: 540, y: 234, w: 160, h: 46, title: "@noto/sync", sub: "change queue → Supabase", tone: "ship" },
    ],
    edges: [
      { d: "M360 62 V84 H130 V108", tone: "ui" },
      { d: "M360 62 V108", tone: "ui" },
      { d: "M360 62 V84 H590 V108", tone: "ui" },
      { d: "M130 186 V210 H360 V234", tone: "data" },
      { d: "M360 186 V234", tone: "data" },
      { d: "M590 186 V210 H360", tone: "data" },
      { d: "M470 256 H540", tone: "ship" },
    ],
    footnote: "+ core · editor (Tiptap/ProseMirror) · types · config",
  },
};

// ---------------------------------------------------------------------------
// Every project, in display order. One entry drives the /projects card, the
// /projects/:slug page, its SEO metadata and (with `home: true`) the homepage card.
//
// Content rules: every fact comes from the repository (README, routes, models,
// package.json) or the resume. Missing information stays null → rendered as TODO.
//
// tagline   short keyword phrase, used in the page <title>
// summary   one sentence, used on cards and as the meta description (≤ 160 chars)
// stack     tools grouped by layer: ui · api · data · ship
// flow      request or data path, drawn as a vertical pipeline
// api       REST reference: { base, groups: [{ name, prefix, endpoints: [[METHOD, path, label]] }] }
// graphql   { endpoint, queries: [[name, label]], mutations: [[name, label]] }
// models    [{ name, fields: [] }]
// highlights [{ title, body }]: engineering decisions visible in the code
// caseStudy true → /projects/:slug renders the long-form case study instead
// ---------------------------------------------------------------------------

export const categories = ["Full-stack", "Backend", "Frontend", "Data", "Multi-platform"];

export const projects = [
  {
    slug: "noto",
    name: "NOTO",
    tagline: "Local-first notes app for web, desktop and Android",
    category: "Multi-platform",
    year: 2026,
    language: "TypeScript",
    caseStudy: true,
    summary: "Local-first notes workspace for web, desktop and Android from one codebase, with optional cloud sync.",
    stack: {
      ui: ["React", "TypeScript", "Tiptap", "Electron", "Expo"],
      data: ["Dexie", "SQLite", "Supabase"],
      ship: ["Turborepo", "Vitest", "Playwright"],
    },
    links: [{ label: "Code", href: "https://github.com/utkarsh032/NOTO" }],
  },
  {
    slug: "onemart",
    name: "OneMart Backend",
    tagline: "Node.js e-commerce REST API",
    category: "Backend",
    year: 2025,
    language: "JavaScript",
    caseStudy: true,
    home: true,
    live: true,
    summary: "E-commerce REST API with JWT auth, cart, orders, payments, vendor features and admin analytics.",
    kind: "E-commerce API · Node.js, Express, MongoDB",
    stack: { api: ["Node.js", "Express", "JWT", "bcrypt"], data: ["MongoDB"], ship: ["Render"] },
    flowLabel: "Request flow: client, JWT auth, role guard, routers, MongoDB",
    flow: [
      { label: "client", tone: "ui" },
      { label: "JWT", sub: "bcrypt", tone: "api" },
      { label: "guards", sub: "user · vendor · admin", tone: "api" },
      { label: "routers", sub: "catalog · cart · orders · pay", tone: "api" },
      { label: "MongoDB", sub: "indexes · agg", tone: "data" },
    ],
    points: [
      "Authentication, catalog, cart, wishlist, orders and payments",
      "Separate middleware for customers, vendors and admins",
      "Admin analytics using MongoDB indexing and aggregation",
    ],
    links: [
      { label: "Live API", href: "https://onemart-backend-exl9.onrender.com/" },
      { label: "Code", href: "https://github.com/utkarsh032/OneMart-backend" },
    ],
  },
  {
    slug: "sql-data-warehouse",
    name: "SQL Data Warehouse",
    tagline: "SQL Server data warehouse with layered ETL",
    category: "Data",
    year: 2026,
    language: "T-SQL",
    caseStudy: true,
    home: true,
    summary: "SQL Server warehouse merging CRM and ERP sales data through Bronze, Silver and Gold layers.",
    kind: "Data engineering · SQL Server, T-SQL",
    stack: { data: ["SQL Server", "T-SQL", "ETL", "Data modelling"] },
    flowLabel: "Data flow: CRM and ERP sources, bronze, silver, gold layers",
    flow: [
      { label: "CRM + ERP", sub: "CSV sources", tone: "ui" },
      { label: "bronze", sub: "raw load", tone: "data" },
      { label: "silver", sub: "clean · standardize", tone: "data" },
      { label: "gold", sub: "reporting", tone: "data" },
    ],
    points: [
      "Merges CRM and ERP sales data into one analytical model",
      "Stored-procedure ETL with BULK INSERT, TRY/CATCH and progress logging",
      "Gold dimension views, plus SQL quality checks on the Silver and Gold layers",
    ],
    links: [{ label: "Code", href: "https://github.com/utkarsh032/sql-data-warehouse-project" }],
  },
  {
    slug: "subscription-tracker",
    name: "Subscription Tracker",
    tagline: "Node.js subscription management API",
    category: "Backend",
    year: 2025,
    language: "JavaScript",
    live: true,
    summary: "Subscription management API in Node.js with JWT auth, renewal tracking, automatic expiry and email reminder workflows.",
    problem:
      "Recurring subscriptions are easy to lose track of until a charge arrives. This API keeps every subscription in one place, knows when each one renews, and reminds the user before the renewal date.",
    overview:
      "A REST API built with Node.js, Express and MongoDB. Users sign up, record their subscriptions with price, currency, frequency and payment method, and get reminded before each renewal. Subscriptions past their renewal date expire automatically, and reminders run as durable workflows that retry when a run fails.",
    features: [
      "Sign-up, sign-in and sign-out with JWT, and passwords hashed with bcryptjs",
      "Create, update, cancel and delete subscriptions",
      "List a user's subscriptions and see upcoming renewals",
      "Automatic expiry of subscriptions past their renewal date",
      "Email reminders run as Upstash workflows, with retries for failed runs",
      "Request protection with Arcjet, and a central error handler",
    ],
    flowLabel: "Request flow: client, Arcjet, JWT auth, routes, MongoDB, with Upstash reminder workflows",
    flow: [
      { label: "client", tone: "ui" },
      { label: "Arcjet", sub: "request protection", tone: "api" },
      { label: "JWT auth", sub: "cookies · bcryptjs", tone: "api" },
      { label: "routes", sub: "auth · users · subscriptions", tone: "api" },
      { label: "MongoDB", sub: "mongoose", tone: "data" },
      { label: "Upstash Workflow", sub: "renewal reminders", tone: "ship" },
    ],
    api: {
      base: "/api/v1",
      groups: [
        {
          name: "Auth",
          prefix: "/auth",
          endpoints: [
            ["POST", "/sign-up", "Create an account"],
            ["POST", "/sign-in", "Sign in"],
            ["POST", "/sign-out", "Sign out"],
          ],
        },
        {
          name: "Subscriptions",
          prefix: "/subcriptions",
          endpoints: [
            ["GET", "/", "List subscriptions"],
            ["GET", "/:id", "Get a subscription"],
            ["POST", "/", "Create a subscription"],
            ["PUT", "/:id", "Update a subscription"],
            ["DELETE", "/:id", "Delete a subscription"],
            ["GET", "/user/:id", "A user's subscriptions"],
            ["PUT", "/:id/cancel", "Cancel a subscription"],
            ["GET", "/upcoming-renewals", "Upcoming renewals"],
          ],
        },
        {
          name: "Users",
          prefix: "/users",
          endpoints: [
            ["GET", "/", "List users"],
            ["GET", "/:id", "Get a user"],
            ["POST", "/", "Create a user"],
            ["PUT", "/:id", "Update a user"],
            ["DELETE", "/:id", "Delete a user"],
          ],
        },
        {
          name: "Workflows",
          prefix: "/workflows",
          endpoints: [["POST", "/subscription/reminder", "Run the renewal reminder workflow"]],
        },
      ],
    },
    models: [
      { name: "User", fields: ["name", "email", "password"] },
      {
        name: "Subscription",
        fields: ["name", "price", "currency", "frequency", "category", "paymentMethod", "status", "startDate", "renewalDate", "user"],
      },
    ],
    highlights: [
      {
        title: "Protection before routing",
        body: "Arcjet runs as middleware in front of every route, configured once in config/arcjet.js, so abusive traffic is stopped before it reaches a controller.",
      },
      {
        title: "Reminders as durable workflows",
        body: "Renewal reminders run on Upstash Workflow through a dedicated /workflows endpoint, so a failed run is retried instead of silently lost.",
      },
      {
        title: "Constrained data at the model",
        body: "The Subscription schema uses enums and minimum values for fields like currency, frequency and status, so invalid records are rejected by Mongoose.",
      },
      {
        title: "Layered project structure",
        body: "Config, routes, controllers, middlewares and models live in separate folders, with one central error-handling middleware.",
      },
    ],
    stack: {
      api: ["Node.js", "Express", "JWT", "bcryptjs", "Arcjet"],
      data: ["MongoDB", "Mongoose"],
      ship: ["Upstash Workflow", "Nodemailer", "Render"],
    },
    links: [
      { label: "Live API", href: "https://subscription-tracker-zb3s.onrender.com" },
      { label: "Code", href: "https://github.com/utkarsh032/Subscription-Tracker" },
    ],
  },
  {
    slug: "kanbanflow",
    name: "KanbanFlow",
    tagline: "React drag-and-drop Kanban board",
    category: "Frontend",
    year: 2025,
    language: "JavaScript",
    summary: "React 19 Kanban board with drag-and-drop tasks, priorities, due dates, multiple boards per user and Firebase sign-in.",
    problem:
      "Teams and individuals need to see at a glance what is to do, in progress and done. KanbanFlow gives them a lightweight visual board, inspired by Trello and Asana, without a heavy project-management tool.",
    overview:
      "A dark-themed Kanban board built with React 19. Users sign in with Firebase Authentication, create boards, lists and tasks, and drag cards between columns. Each task can carry a priority and a due date, and boards are saved per user in the browser.",
    features: [
      "Email and password sign-in, plus popup sign-in with a provider, via Firebase Authentication",
      "Protected routes behind an authentication guard",
      "Boards, lists and tasks, with multiple boards per user",
      "Drag and drop between columns with dnd-kit",
      "Task priority and due date, with filtering by priority",
      "Responsive layout for mobile, tablet and desktop",
    ],
    flowLabel: "Flow: React UI, dnd-kit, context state, Firebase Auth and local storage",
    flow: [
      { label: "React 19", sub: "boards · lists · tasks", tone: "ui" },
      { label: "dnd-kit", sub: "sortable · modifiers", tone: "ui" },
      { label: "context", sub: "auth · filter · theme", tone: "api" },
      { label: "Firebase Auth", sub: "email · popup sign-in", tone: "api" },
      { label: "localStorage", sub: "boards per user", tone: "data" },
    ],
    highlights: [
      {
        title: "Per-user persistence without a database",
        body: "Boards are stored in localStorage under a key derived from the signed-in user, so each account sees only its own boards.",
      },
      {
        title: "State split by concern",
        body: "Separate React contexts handle authentication, filters and theme, which keeps board components free of cross-cutting state.",
      },
      {
        title: "Sortable drag and drop",
        body: "Cards move within and between columns using dnd-kit's core, sortable and modifiers packages.",
      },
    ],
    stack: {
      ui: ["React 19", "dnd-kit", "Tailwind CSS v4", "React Router"],
      api: ["Firebase Auth"],
      data: ["localStorage"],
      ship: ["Vite"],
    },
    links: [{ label: "Code", href: "https://github.com/utkarsh032/KanbanFlow" }],
  },
  {
    slug: "expenses-tracker",
    name: "Expenses Tracker",
    tagline: "GraphQL expense tracker with Apollo and MongoDB",
    category: "Full-stack",
    year: 2024,
    language: "JavaScript",
    live: true,
    summary: "Full-stack expense tracker on a GraphQL API (Apollo Server, MongoDB) with session auth and spending charts by category.",
    problem:
      "Knowing where money goes means recording each expense and seeing totals by category. This app stores transactions per user and charts spending by category.",
    overview:
      "A full-stack expense tracker. The React client talks to an Apollo GraphQL server through Apollo Client. Users and transactions each have their own schema and resolvers, authentication uses Passport sessions stored in MongoDB, and a category statistics query drives the spending chart.",
    features: [
      "Sign up, log in and log out with session-based authentication",
      "Create, update and delete transactions with description, category, payment type, amount, location and date",
      "Spending totals by category, charted with Chart.js",
      "Passwords hashed with bcryptjs",
      "React client using Apollo Client",
    ],
    flowLabel: "Request flow: React and Apollo Client, Apollo Server, Passport session, MongoDB",
    flow: [
      { label: "React", sub: "Apollo Client · Chart.js", tone: "ui" },
      { label: "Apollo Server", sub: "typeDefs · resolvers", tone: "api" },
      { label: "Passport", sub: "session auth", tone: "api" },
      { label: "MongoDB", sub: "users · transactions · sessions", tone: "data" },
    ],
    graphql: {
      endpoint: "/graphql",
      queries: [
        ["authUser", "The signed-in user"],
        ["user", "A user by id"],
        ["transactions", "All of the user's transactions"],
        ["transaction", "One transaction by id"],
        ["categoryStatistics", "Total amount per category"],
      ],
      mutations: [
        ["signUp", "Create an account"],
        ["login", "Start a session"],
        ["logout", "End the session"],
        ["createTransaction", "Add a transaction"],
        ["updateTransaction", "Edit a transaction"],
        ["deleteTransaction", "Remove a transaction"],
      ],
    },
    models: [
      { name: "User", fields: ["username", "name", "password", "profilePicture", "gender"] },
      { name: "Transaction", fields: ["userId", "description", "paymentType", "category", "amount", "location", "date"] },
    ],
    highlights: [
      {
        title: "Schema split by domain",
        body: "User and transaction type definitions and resolvers live in separate files and are merged with @graphql-tools/merge.",
      },
      {
        title: "Sessions instead of tokens",
        body: "graphql-passport and express-session handle login, and sessions are persisted in MongoDB with connect-mongodb-session.",
      },
      {
        title: "Aggregation for the chart",
        body: "The categoryStatistics query returns the total amount per category, which the client plots directly with Chart.js.",
      },
      {
        title: "One server for API and client",
        body: "Express serves the GraphQL endpoint at /graphql and the built React app from the same deployment.",
      },
    ],
    stack: {
      ui: ["React", "Apollo Client", "Chart.js", "Tailwind CSS"],
      api: ["GraphQL", "Apollo Server", "Express", "Passport"],
      data: ["MongoDB", "Mongoose"],
      ship: ["Render"],
    },
    links: [
      { label: "Live", href: "https://expenses-tracker-graphql.onrender.com/" },
      { label: "Code", href: "https://github.com/utkarsh032/Expenses-Tracker-GraphQL" },
    ],
  },
  {
    slug: "udemy-clone",
    name: "Udemy Clone",
    tagline: "MERN online learning platform",
    category: "Full-stack",
    year: 2024,
    language: "JavaScript",
    live: true,
    summary: "MERN e-learning platform with OTP sign-up, course search, video lessons with progress, cart, wishlist and reviews.",
    problem:
      "An online course marketplace needs more than a catalogue. Learners must be able to find a course, verify their account, save and buy courses, and work through lessons while their progress is tracked.",
    overview:
      "An online learning platform modelled on Udemy, built with React, Redux, Node.js, Express and MongoDB. Learners browse and search courses, sign up with an emailed OTP, keep a cart and wishlist, enroll, and stream lessons organised into sections with per-lesson progress.",
    features: [
      "Course browsing and search, with dynamic routes for course pages",
      "Sign-up with an emailed one-time password, plus forgot and reset password",
      "Cart and wishlist saved on the user account",
      "Course enrollment and video lessons grouped into sections",
      "Per-lesson completion and course progress",
      "Ratings and written reviews on courses",
      "Admin dashboard for course management",
    ],
    flowLabel: "Request flow: React and Redux client, Express routers, MongoDB",
    flow: [
      { label: "React + Redux", sub: "catalogue · player · cart", tone: "ui" },
      { label: "Express", sub: "/user · /course", tone: "api" },
      { label: "auth", sub: "OTP · login · reset", tone: "api" },
      { label: "MongoDB", sub: "users · courses · content · reviews", tone: "data" },
    ],
    api: {
      base: "",
      groups: [
        {
          name: "Users",
          prefix: "/user",
          endpoints: [
            ["POST", "/send-otp", "Email a one-time password"],
            ["POST", "/verify-otp", "Verify the OTP"],
            ["POST", "/signup", "Create an account"],
            ["POST", "/login", "Log in"],
            ["POST", "/forgot-password", "Start a password reset"],
            ["POST", "/reset-password", "Set a new password"],
            ["GET", "/auth/get-user-details", "The signed-in user"],
            ["POST", "/cart", "Add to cart"],
            ["GET", "/cart", "Get the cart"],
            ["POST", "/wishlist", "Add to wishlist"],
            ["GET", "/wishlist", "Get the wishlist"],
          ],
        },
        {
          name: "Courses",
          prefix: "/course",
          endpoints: [
            ["GET", "/get-courses", "List courses"],
            ["GET", "/get-course/:courseId", "Get one course"],
          ],
        },
      ],
    },
    models: [
      {
        name: "User",
        fields: ["email", "name", "password", "avatar", "role", "cartItems", "wishList", "enrolledCourse", "createdCourse"],
      },
      {
        name: "Course",
        fields: ["title", "description", "category", "subCategory", "language", "actualPrice", "salePrice", "duration", "instructors", "avgRating", "ratingCount", "enrolledStudents", "reviews"],
      },
      { name: "CourseContent", fields: ["courseName", "sections", "sectionTitle", "lessons", "title", "url", "duration", "notes", "completed", "progress"] },
      { name: "Review", fields: ["userId", "rating", "feedback"] },
    ],
    highlights: [
      {
        title: "Verified sign-up",
        body: "Accounts are created only after an emailed one-time password is verified, and the same flow backs forgot and reset password.",
      },
      {
        title: "Content modelled for progress",
        body: "Course content is stored as sections of lessons, each with its video URL, duration, notes and a completed flag, so progress can be computed per course.",
      },
      {
        title: "Commerce state on the user",
        body: "Cart items, wishlist and enrolled courses are stored on the user document, so they follow the learner across devices.",
      },
    ],
    stack: { ui: ["React", "Redux", "Vite"], api: ["Node.js", "Express"], data: ["MongoDB", "Mongoose"], ship: ["Netlify"] },
    links: [
      { label: "Live", href: "https://udemy-e-learning.netlify.app/" },
      { label: "Code", href: "https://github.com/utkarsh032/Udemy" },
    ],
  },
  {
    slug: "bookheaven",
    name: "BookHeaven",
    tagline: "MERN reading and book-tracking app",
    category: "Full-stack",
    year: 2025,
    language: "JavaScript",
    live: true,
    summary: "Goodreads-inspired MERN reading app: browse and filter books, keep a personal shelf with status and ratings, and read chapters online.",
    problem:
      "Readers want one place to discover books, keep track of what they are reading and rate what they have finished, and ideally to read in the same place.",
    overview:
      "A reading platform inspired by Goodreads, with a React frontend and an Express and MongoDB API. Users browse and filter the catalogue, add books to a personal shelf, set each book's reading status and rating, and read chapter by chapter in the browser.",
    features: [
      "Landing page with featured books, categories, popular authors and platform stats",
      "Register, log in and log out, with a current-user endpoint",
      "Paginated catalogue with search, sort by rating and genre filters",
      "Personal shelf: add books, set reading status and rate them",
      "In-browser reading, chapter by chapter",
      "Private routes on the frontend for signed-in pages",
    ],
    flowLabel: "Request flow: React client, Express API, JWT auth, MongoDB",
    flow: [
      { label: "React", sub: "browse · shelf · read", tone: "ui" },
      { label: "Express API", sub: "auth · books · mybooks", tone: "api" },
      { label: "JWT auth", sub: "bcryptjs · middleware", tone: "api" },
      { label: "MongoDB", sub: "users · books · shelves", tone: "data" },
    ],
    api: {
      base: "/api",
      groups: [
        {
          name: "Auth",
          prefix: "/auth",
          endpoints: [
            ["POST", "/register", "Create an account"],
            ["POST", "/login", "Log in"],
            ["GET", "/logout", "Log out"],
            ["GET", "/me", "The signed-in user"],
          ],
        },
        {
          name: "Books",
          prefix: "/books",
          endpoints: [
            ["GET", "/", "List books"],
            ["GET", "/:id", "Get a book"],
          ],
        },
        {
          name: "My shelf",
          prefix: "/mybooks",
          endpoints: [
            ["GET", "/", "My shelf"],
            ["POST", "/:bookId", "Add a book to my shelf"],
            ["PATCH", "/:bookId/status", "Set reading status"],
            ["PATCH", "/:bookId/rating", "Rate a book"],
          ],
        },
      ],
    },
    models: [
      { name: "User", fields: ["name", "email", "password"] },
      { name: "Book", fields: ["title", "author", "description", "genre", "coverImage", "publishedYear", "availability"] },
      { name: "MyBook", fields: ["user", "book", "status", "rating"] },
    ],
    highlights: [
      {
        title: "Shelf as its own model",
        body: "MyBook links a user to a book and stores the reading status and rating, so the shared catalogue stays separate from personal data.",
      },
      {
        title: "Small, focused endpoints",
        body: "Status and rating are updated with separate PATCH endpoints instead of one catch-all update.",
      },
      {
        title: "Auth on both sides",
        body: "An auth middleware protects shelf routes on the API, and a PrivateRoute component guards the matching pages in React.",
      },
    ],
    stack: {
      ui: ["React", "Tailwind CSS", "React Router"],
      api: ["Express", "JWT", "bcryptjs"],
      data: ["MongoDB", "Mongoose"],
      ship: ["Vercel"],
    },
    links: [
      { label: "Live", href: "https://book-heaven-ten.vercel.app" },
      { label: "Code", href: "https://github.com/utkarsh032/BookHeaven" },
    ],
  },
  {
    slug: "likho",
    name: "likho.in",
    tagline: "Next.js app on Sanity CMS",
    category: "Full-stack",
    year: 2025,
    language: "TypeScript",
    live: true,
    summary: "Next.js and TypeScript app on Sanity CMS with a Markdown editor, Radix UI components and Sentry error monitoring.",
    problem: null,
    overview: null,
    features: [
      "Content stored and managed in Sanity CMS",
      "Markdown editing and rendering (react-md-editor, markdown-it)",
      "UI built on Radix primitives",
      "Error monitoring with Sentry",
    ],
    todo: "Describe what likho.in does and who it's for. The repository README is still the Next.js template.",
    stack: { ui: ["Next.js", "TypeScript", "Radix UI"], data: ["Sanity"], ship: ["Sentry", "Vercel"] },
    links: [
      { label: "Live", href: "https://likho-in.vercel.app" },
      { label: "Code", href: "https://github.com/utkarsh032/likho.in" },
    ],
  },
  {
    slug: "bharat-estate",
    name: "Bharat Estate",
    tagline: "MERN real estate listings app",
    category: "Full-stack",
    year: 2023,
    language: "JavaScript",
    summary: "MERN real estate app to create, edit and browse property listings, with JWT and Google sign-in and persisted Redux state.",
    problem:
      "Property owners need a simple way to publish listings with prices, offers and amenities, and buyers or renters need to browse them. Both need accounts they can trust.",
    overview:
      "A real estate application with a Node and Express API and a React frontend. Signed-in users create, edit and delete property listings with regular and discounted prices, bedrooms, bathrooms, parking and furnishing. Users sign in with email and password or with Google, and app state is kept in Redux Toolkit and persisted across reloads.",
    features: [
      "Sign up and sign in with email and password, or with Google",
      "Create, update and delete property listings",
      "Listings for sale or rent, with regular and discounted prices",
      "Bedrooms, bathrooms, parking and furnished details on every listing",
      "Profile page with avatar and the user's own listings",
      "Redux Toolkit state persisted with Redux Persist",
    ],
    flowLabel: "Request flow: React and Redux client, Express API, JWT auth, MongoDB",
    flow: [
      { label: "React + Redux", sub: "listings · profile", tone: "ui" },
      { label: "Express API", sub: "auth · user · listing", tone: "api" },
      { label: "auth", sub: "JWT · Google via Firebase", tone: "api" },
      { label: "MongoDB", sub: "users · listings", tone: "data" },
    ],
    api: {
      base: "/api",
      groups: [
        {
          name: "Auth",
          prefix: "/auth",
          endpoints: [
            ["POST", "/signup", "Create an account"],
            ["POST", "/signin", "Sign in"],
            ["POST", "/google", "Sign in with Google"],
            ["GET", "/signout", "Sign out"],
          ],
        },
        {
          name: "Listings",
          prefix: "/listing",
          endpoints: [
            ["POST", "/create", "Create a listing"],
            ["POST", "/update/:id", "Update a listing"],
            ["DELETE", "/delete/:id", "Delete a listing"],
            ["GET", "/get/:id", "Get a listing"],
            ["GET", "/get", "List listings"],
          ],
        },
        {
          name: "Users",
          prefix: "/user",
          endpoints: [
            ["POST", "/update/:id", "Update a profile"],
            ["DELETE", "/delete/:id", "Delete an account"],
            ["GET", "/listings/:id", "A user's listings"],
            ["GET", "/:id", "Get a user"],
          ],
        },
      ],
    },
    models: [
      { name: "User", fields: ["username", "email", "password", "avatar"] },
      {
        name: "Listing",
        fields: ["name", "description", "address", "regularPrice", "discountPrice", "bathrooms", "bedrooms", "furnished", "parking", "type", "offer", "userRef"],
      },
    ],
    highlights: [
      {
        title: "Two ways to sign in, one account model",
        body: "Email and password accounts and Google sign-in both resolve to the same User document and JWT session.",
      },
      {
        title: "Listings owned by users",
        body: "Each listing stores a userRef, which powers the profile's list of listings and ownership checks on update and delete.",
      },
      {
        title: "State that survives reloads",
        body: "Redux Toolkit holds the signed-in user, and Redux Persist keeps it across page reloads.",
      },
    ],
    stack: {
      ui: ["React", "Redux Toolkit", "Tailwind CSS", "Swiper"],
      api: ["Node.js", "Express", "JWT", "bcryptjs"],
      data: ["MongoDB", "Mongoose", "Firebase"],
      ship: ["Vite"],
    },
    links: [{ label: "Code", href: "https://github.com/utkarsh032/Bharat-Estate" }],
  },
  {
    slug: "book-store",
    name: "Book Store",
    tagline: "MERN book store with admin dashboard",
    category: "Full-stack",
    year: 2023,
    language: "JavaScript",
    live: true,
    summary: "MERN book store with a shop, book pages, blog and an admin dashboard to upload, edit and manage books.",
    problem:
      "An independent book seller needs a storefront for readers and a back office to keep the catalogue up to date, without a heavy e-commerce platform.",
    overview:
      "A book-buying and selling platform. Readers browse the shop and best-sellers, open book pages and read the blog. Sellers sign in and use an admin dashboard to upload new books, edit details and remove listings, backed by an Express API on MongoDB.",
    features: [
      "Shop and best-seller listings, with a page for each book",
      "Admin dashboard to upload, manage and edit books",
      "Sign-up and login with Firebase Authentication, and private admin routes",
      "Promotional offers and a community blog",
      "REST API for book CRUD on MongoDB",
    ],
    flowLabel: "Request flow: React client, Express API, MongoDB",
    flow: [
      { label: "React", sub: "shop · book · dashboard", tone: "ui" },
      { label: "Firebase Auth", sub: "sign-up · login", tone: "api" },
      { label: "Express API", sub: "books CRUD", tone: "api" },
      { label: "MongoDB", sub: "books", tone: "data" },
    ],
    api: {
      base: "",
      groups: [
        {
          name: "Books",
          prefix: "",
          endpoints: [
            ["GET", "/all-books", "List books"],
            ["GET", "/book/:id", "Get a book"],
            ["POST", "/upload-book", "Add a book"],
            ["PATCH", "/book/:id", "Update a book"],
            ["DELETE", "/book/:id", "Delete a book"],
          ],
        },
      ],
    },
    highlights: [
      {
        title: "Storefront and back office in one app",
        body: "Public routes (shop, book, blog, about) and admin routes (upload, manage, edit) share one React app, with the admin area behind a private route.",
      },
      {
        title: "A deliberately small API",
        body: "The whole API is five endpoints in a single Express file, which keeps the catalogue CRUD easy to follow.",
      },
    ],
    stack: {
      ui: ["React", "Tailwind CSS", "Flowbite", "Swiper"],
      api: ["Express", "REST", "Firebase Auth"],
      data: ["MongoDB"],
      ship: ["Render"],
    },
    links: [
      { label: "Live", href: "https://book-store-app-lp07.onrender.com/" },
      { label: "Code", href: "https://github.com/utkarsh032/book-store-app" },
    ],
  },
  {
    slug: "destination",
    name: "Destination",
    tagline: "React travel landing page",
    category: "Frontend",
    year: 2023,
    language: "JavaScript",
    live: true,
    summary: "Responsive, accessible React travel landing page with a video hero, trip search card, destination grid and reduced-motion support.",
    problem:
      "A travel landing page has to sell the destination in seconds on any screen, while staying fast and usable with a keyboard or with reduced motion turned on.",
    overview:
      "A travel landing page built with React 18, Vite and Sass. It opens with a video hero and a holiday search card, shows a grid of the most visited destinations, and ends with a video footer and newsletter sign-up. Accessibility and reduced motion were considered throughout.",
    features: [
      "Fixed navbar with an animated drop-down menu below 1024px that closes on link, button or Esc",
      "Autoplaying video hero that also plays on iOS, with a search card and live max-price slider",
      "Destination grid going from 1 to 3 columns, with lazy-loaded images",
      "Newsletter form with validation",
      "AOS scroll animations, switched off for users who prefer reduced motion",
      "Real buttons, labelled inputs, aria-expanded and visible keyboard focus",
    ],
    highlights: [
      {
        title: "Motion that respects the user",
        body: "Scroll animations are turned off automatically when the operating system asks for reduced motion.",
      },
      {
        title: "Accessible navigation",
        body: "The mobile menu is a real button with aria-expanded, and it closes on link click, the close button or the Esc key.",
      },
      {
        title: "Mobile video that works",
        body: "The hero video uses playsInline so it autoplays on iOS instead of opening full screen.",
      },
    ],
    stack: { ui: ["React 18", "Sass", "AOS"], ship: ["Vite", "Netlify"] },
    links: [
      { label: "Live", href: "https://destination-travelling-app.netlify.app/" },
      { label: "Code", href: "https://github.com/utkarsh032/travel" },
    ],
  },
  {
    slug: "omnifood",
    name: "Omnifood",
    tagline: "Responsive HTML and CSS marketing site",
    category: "Frontend",
    year: 2023,
    language: "HTML",
    live: true,
    summary: "Responsive marketing website for a food-delivery service, built with plain HTML, CSS and JavaScript.",
    problem:
      "A food-delivery service needs a landing page that explains the product clearly and works on every screen size.",
    overview:
      "A responsive marketing website for a food-delivery service, built without a framework. It focuses on clean layout, responsive design and small interactive details.",
    features: [
      "Fully responsive layout for every screen size",
      "CSS animations and interactive elements",
      "Organised, user-friendly navigation",
    ],
    stack: { ui: ["HTML", "CSS", "JavaScript"], ship: ["Netlify"] },
    links: [
      { label: "Live", href: "https://omnifood-utkarshraj.netlify.app/" },
      { label: "Code", href: "https://github.com/utkarsh032/omnifood" },
    ],
  },
];

export const layerOrder = ["ui", "api", "data", "ship"];
export const layerNames = { ui: "Interface", api: "Service", data: "Data", ship: "Delivery" };

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
export const homeSystems = projects.filter((p) => p.home);
export const flatStack = (p) => layerOrder.flatMap((l) => p.stack[l] ?? []);
