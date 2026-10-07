<h2 align="center">
  Portfolio Website - v3.0<br/>
  <a href="https://utkarsh-raz032.netlify.app/" target="_blank">utkarsh-raz032</a>
</h2>
<div align="center">
  <img alt="Homepage: From the click to the query" src="./src/assets/UI.png" />
</div>

<br/>

## Stack

React 18 + Vite 5 + React Router. Plain CSS with design tokens (`src/styles/base.css`), no UI framework.
Fonts are self-hosted (Geist, JetBrains Mono).

## Scripts

| Command                  | What it does                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run dev`            | Dev server                                               |
| `npm run build`          | Refreshes GitHub stats and the resume preview, then builds to `dist/` |
| `npm run github:refresh` | Refreshes `src/data/github.json` from the GitHub API     |
| `npm run resume:preview` | Renders page one of the resume PDF to `public/resume-preview.*` and its facts to `src/data/resume.json` |
| `npm run lint`           | ESLint                                                   |

## Editing content

All content lives in `src/data/`. Components render whatever is there.

| File              | Content                                                             |
| ----------------- | ------------------------------------------------------------------- |
| `profile.js`      | Name, links, email, availability, nav sections                      |
| `projects.js`     | Every project: card, stack, flow, API reference, and its `look` (accent hue and hero visual) |
| `caseStudies.js`  | Long-form content for `/projects/:slug`: role, architecture map, decisions, postmortems |
| `excerpts.js`     | Verbatim code excerpts from the project repositories, with line numbers |
| `beyond.js`       | Content for `/beyond`: worked cases, traced faults, decisions, principles, each with its source |
| `stack.js`        | Tools by layer, and where each was used                             |
| `experience.js`   | Roles, education, certifications (home shows the first four, `/credentials` all of them), "How I work" steps |
| `credentials.js`  | Nothing to edit: the `/credentials` record, derived from `experience.js`, `profile.js`, `stack.js` and `resume.json` |
| `github.json`     | Generated before each build. Don't edit by hand.                    |
| `resume.json`     | Generated from the resume PDF before each build. Don't edit by hand. |

To update the resume, replace the PDF in `public/`. The next build redraws its preview and re-reads its page count,
size and last-modified date; `npm run resume:preview` does the same without building.

Case-study fields set to `null` render as a visible **TODO**. Fill them with real, measured
information only.

## Deploy

Netlify. Every route is prerendered to its own HTML file; `public/_redirects` redirects the old `/work/:slug` URLs to `/projects/:slug`.
Lazy-loaded pages link their own CSS in that file, so they are styled before the script runs. A new lazy page needs
a line in `lazyPages` in `scripts/prerender.mjs`.

### Contact form

The contact form posts to `/api/contact`, a Netlify Function (`netlify/functions/contact.mjs`) that validates the
message and emails it through [Resend](https://resend.com), with the visitor's address as reply-to. Set these in
Netlify → Site configuration → Environment variables:

| Variable         | Required | Notes                                                                                  |
| ---------------- | -------- | -------------------------------------------------------------------------------------- |
| `RESEND_API_KEY` | yes      | From the Resend dashboard                                                              |
| `CONTACT_FROM`   | no       | Sender on a domain verified in Resend. The default, `onboarding@resend.dev`, only delivers to the Resend account's own email |
| `CONTACT_TO`     | no       | Inbox to deliver to. Defaults to `profile.email`                                       |

Plain `npm run dev` doesn't run functions, so the form shows an error with a link to open the visitor's mail app instead.
To test sending locally, run `npx netlify dev` with `RESEND_API_KEY` in a `.env` file.
