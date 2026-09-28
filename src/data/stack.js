// `prod` = used in a production job; otherwise used in my own shipped projects.
export const layers = [
  {
    key: "ui",
    name: "Interface",
    tag: "ui",
    items: [
      { name: "Angular", prod: true, where: "Production work: daily" },
      { name: "React", prod: true, where: "Production work, NOTO, Udemy Clone" },
      { name: "TypeScript", where: "NOTO monorepo" },
      { name: "Redux", where: "Udemy Clone" },
      { name: "Tiptap / ProseMirror", where: "NOTO editor" },
      { name: "Electron · Expo", where: "NOTO desktop and Android shells" },
      { name: "Tailwind CSS", where: "NOTO, Udemy Clone" },
    ],
  },
  {
    key: "api",
    name: "Service",
    tag: "api",
    items: [
      { name: ".NET", prod: true, where: "Production work: APIs, features" },
      { name: "REST APIs", prod: true, where: "Production work, OneMart" },
      { name: "Node.js · Express", where: "OneMart, Udemy Clone" },
      { name: "JWT · bcrypt", where: "OneMart auth" },
      { name: "GraphQL", where: "Expenses Tracker" },
      { name: "JavaScript · Python", where: "Across projects" },
    ],
  },
  {
    key: "data",
    name: "Data",
    tag: "sql",
    items: [
      { name: "SQL Server · T-SQL", prod: true, where: "Production work, Data Warehouse" },
      { name: "MongoDB", where: "OneMart: indexes, aggregation" },
      { name: "SQLite", where: "NOTO desktop and Android" },
      { name: "IndexedDB · Dexie", where: "NOTO web" },
      { name: "Supabase", where: "NOTO sync" },
      { name: "MySQL", where: "Coursework" },
    ],
  },
  {
    key: "ship",
    name: "Delivery",
    tag: "ship",
    items: [
      { name: "Git · GitHub", prod: true, where: "Public repositories on GitHub" },
      { name: "Vite", prod: true, where: "Production work, NOTO web" },
      { name: "pnpm · Turborepo", where: "NOTO monorepo" },
      { name: "Vitest · Playwright", where: "NOTO unit + e2e" },
      { name: "Render · Netlify", where: "OneMart, Udemy Clone" },
      { name: "Postman", prod: true, where: "API testing" },
      { name: "VS Code", prod: true, where: "Daily" },
    ],
  },
];
