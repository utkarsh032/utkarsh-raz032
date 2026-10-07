// Page metadata for every route. One source for both sides:
//  - the browser (applySeo, on each navigation)
//  - the build-time prerenderer (renderHead, written into each HTML file)
import { certifications, education, roles } from "./data/experience";
import { profile } from "./data/profile";
import { flatStack, projectBySlug, projects } from "./data/projects";
import { layers } from "./data/stack";

const SITE = profile.siteUrl;
const abs = (path) => `${SITE}${path === "/" ? "/" : path}`;
const SUFFIX = ` · ${profile.name}`;

const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: profile.name,
  givenName: "Utkarsh",
  familyName: "Raj",
  jobTitle: "Full-stack developer",
  description: `${profile.name} is a full-stack developer in Greater Noida, India, building web applications with Angular, React, .NET, Node.js and SQL Server.`,
  image: `${SITE}${profile.ogImage}`,
  url: `${SITE}/`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Greater Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
  sameAs: [profile.links.github, profile.links.linkedin],
  worksFor: roles.filter((r) => r.current).map((r) => ({ "@type": "Organization", name: r.org })),
  alumniOf: education.map((e) => ({ "@type": "EducationalOrganization", name: e.where.split(" · ")[0] })),
  knowsAbout: layers.flatMap((l) => l.items.filter((i) => i.prod).map((i) => i.name)),
};

const breadcrumbs = (trail) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

/** Every URL that should exist as a prerendered HTML file (and in the sitemap). */
export const routes = ["/", "/projects", ...projects.map((p) => `/projects/${p.slug}`), "/beyond", "/credentials"];

export function getSeo(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: `${profile.name} · Full-stack developer (Angular, React, .NET, SQL)`,
      description:
        "Utkarsh Raj, full-stack developer in Greater Noida, India. Ships production Angular, React, .NET and SQL Server apps and builds NOTO, a local-first notes app.",
      path,
      type: "profile",
      jsonLd: graph(
        person,
        { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: profile.name, author: { "@id": `${SITE}/#person` } },
        { "@type": "ProfilePage", url: `${SITE}/`, name: profile.name, mainEntity: { "@id": `${SITE}/#person` } }
      ),
    };
  }

  if (path === "/projects") {
    return {
      title: `Projects: full-stack, backend, frontend and data${SUFFIX}`,
      description: `${projects.length} software projects by ${profile.name}: REST and GraphQL APIs, MERN apps, a SQL Server data warehouse and a local-first multi-platform notes app.`,
      path,
      type: "website",
      jsonLd: graph(
        {
          "@type": "CollectionPage",
          url: abs(path),
          name: "Projects",
          author: { "@id": `${SITE}/#person` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/projects/${p.slug}`), name: p.name })),
          },
        },
        breadcrumbs([["Home", "/"], ["Projects", "/projects"]]),
        person
      ),
    };
  }

  if (path === "/beyond") {
    return {
      title: `Beyond code: how I think, debug and decide${SUFFIX}`,
      description: `How ${profile.name} works a problem: real debugging cases, what each decision cost, the path a change takes to a release, and where he writes and practises.`,
      path,
      type: "website",
      jsonLd: graph(
        { "@type": "AboutPage", url: abs(path), name: "Beyond code", about: { "@id": `${SITE}/#person` }, author: { "@id": `${SITE}/#person` } },
        breadcrumbs([["Home", "/"], ["Beyond code", "/beyond"]]),
        person
      ),
    };
  }

  if (path === "/credentials") {
    return {
      title: `Credentials: resume, education and certifications${SUFFIX}`,
      description: `The record behind ${profile.name}'s work: a one-page resume, ${education.length} programmes of formal study and ${certifications.length} certificates, with the documents to open.`,
      path,
      type: "website",
      jsonLd: graph(
        {
          "@type": "CollectionPage",
          url: abs(path),
          name: "Credentials",
          author: { "@id": `${SITE}/#person` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: education.length + certifications.length,
            itemListElement: [...education, ...certifications].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title })),
          },
        },
        breadcrumbs([["Home", "/"], ["Credentials", "/credentials"]]),
        person
      ),
    };
  }

  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  const p = slug && projectBySlug[slug];
  if (p) {
    const repo = p.links.find((l) => l.href.includes("github.com"))?.href;
    const live = p.links.find((l) => l.label.startsWith("Live"))?.href;
    return {
      title: `${p.name}: ${p.tagline}${SUFFIX}`,
      description: p.summary,
      path,
      type: "article",
      jsonLd: graph(
        {
          "@type": "SoftwareSourceCode",
          "@id": `${abs(path)}#project`,
          name: p.name,
          headline: `${p.name}: ${p.tagline}`,
          description: p.summary,
          url: abs(path),
          codeRepository: repo,
          ...(live && { targetProduct: { "@type": "SoftwareApplication", name: p.name, url: live, applicationCategory: "WebApplication" } }),
          programmingLanguage: p.language,
          keywords: flatStack(p).join(", "),
          dateCreated: String(p.year),
          genre: p.category,
          author: { "@id": `${SITE}/#person` },
        },
        breadcrumbs([["Home", "/"], ["Projects", "/projects"], [p.name, path]]),
        person
      ),
    };
  }

  return {
    title: `Page not found${SUFFIX}`,
    description: "This page doesn't exist. Browse the projects or go back to the homepage.",
    path,
    type: "website",
    noindex: true,
    jsonLd: null,
  };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Head tags for the prerendered HTML. */
export function renderHead(seo) {
  const url = abs(seo.path);
  const image = `${SITE}${profile.ogImage}`;
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    seo.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (seo.jsonLd) tags.push(`<script type="application/ld+json" id="ld-json">${JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c")}</script>`);
  return tags.join("\n    ");
}

/** Updates the live document on client-side navigation. */
export function applySeo(seo) {
  const head = document.head;
  const url = abs(seo.path);
  document.title = seo.title;

  const meta = (attr, key, content) => {
    let el = head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  meta("name", "description", seo.description);
  meta("property", "og:type", seo.type);
  meta("property", "og:title", seo.title);
  meta("property", "og:description", seo.description);
  meta("property", "og:url", url);
  meta("name", "twitter:title", seo.title);
  meta("name", "twitter:description", seo.description);

  let canonical = head.querySelector('link[rel="canonical"]');
  let robots = head.querySelector('meta[name="robots"]');
  if (seo.noindex) {
    canonical?.remove();
    if (!robots) meta("name", "robots", "noindex");
  } else {
    robots?.remove();
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      head.appendChild(canonical);
    }
    canonical.href = url;
  }

  let ld = document.getElementById("ld-json");
  if (seo.jsonLd) {
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-json";
      head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(seo.jsonLd);
  } else {
    ld?.remove();
  }
}
