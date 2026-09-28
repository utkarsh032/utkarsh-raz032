// Refreshes src/data/github.json from the public GitHub API before each build.
// On any network failure it keeps the committed file, so builds never break offline.
import { readFile, writeFile } from "node:fs/promises";

const USER = "utkarsh032";
const FLAGSHIP = "NOTO";
const OUT = new URL("../src/data/github.json", import.meta.url);
const headers = { "User-Agent": `${USER}-portfolio`, Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const get = (path) => fetch(`https://api.github.com${path}`, { headers });

async function commitCount(repo) {
  const res = await get(`/repos/${USER}/${repo}/commits?per_page=1`);
  if (!res.ok) throw new Error(`commits ${res.status}`);
  const last = res.headers.get("link")?.match(/page=(\d+)>; rel="last"/);
  return last ? Number(last[1]) : (await res.json()).length;
}

try {
  const [userRes, reposRes] = await Promise.all([get(`/users/${USER}`), get(`/users/${USER}/repos?per_page=100&sort=pushed`)]);
  if (!userRes.ok || !reposRes.ok) throw new Error(`api ${userRes.status}/${reposRes.status}`);
  const user = await userRes.json();
  const repos = await reposRes.json();
  const flagship = repos.find((r) => r.name === FLAGSHIP);

  const data = {
    updated: new Date().toISOString().slice(0, 10),
    publicRepos: user.public_repos,
    since: user.created_at.slice(0, 4),
    flagship: {
      name: FLAGSHIP,
      commits: await commitCount(FLAGSHIP),
      created: flagship?.created_at.slice(0, 10) ?? null,
    },
    recent: repos
      .filter((r) => !r.fork && r.name !== USER)
      .slice(0, 3)
      .map((r) => ({ name: r.name, language: r.language, pushed: r.pushed_at.slice(0, 10), url: r.html_url })),
  };
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`github.json updated: ${data.publicRepos} repos, ${data.flagship.commits} ${FLAGSHIP} commits`);
} catch (err) {
  await readFile(OUT); // throws if there is no fallback at all
  console.warn(`github.json kept as-is (${err.message})`);
}
