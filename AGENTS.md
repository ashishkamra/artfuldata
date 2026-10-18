# Artfuldata agent guide

This is Monalisa Hota’s bilingual portfolio, not a Python data pipeline. The old
venv/pytest/ruff instructions do not apply. Production code lives in
`src/artfuldata/`. Astro’s `srcDir` points there.

Live site: <https://artfuldata.vercel.app/>. Local and CI tests still use the
`/artfuldata` base. Vercel sets `VERCEL=1` and serves the site from `/`.

## What to read first

- `README.md` for commands and section map. A few design sentences there are
  older than the homepage; trust the CSS and this file when they disagree.
- `docs/content-sources.md` before changing biography, projects, or documents.
- `skills.md` for the repeatable procedures.

## Hard rules

- Write plain, factual copy. No slogans and no invented projects, findings,
  photographs, book titles, or document links.
- Garden notes and woodworking photographs are waiting on the owner. Mark that
  gap. Do not fill it.
- A homepage card title must match the heading it opens. Put the organisation
  in the eyebrow when the destination heading is the project name.
- Keep English and German in sync. Shared homepage and collection copy belongs
  in `components/Home.astro` and `components/Collection.astro`. German-only page
  bodies live in `pages/de/[...page].astro`. Book titles and original documents
  stay in their original language.
- Do not commit `.codegraph/`, `58611.jpg`, or `new layout.png`.

## Map

| Concern | Where |
| --- | --- |
| Homepage | `components/Home.astro`, `styles/home.css` |
| Books, creativity, courses | `components/Collection.astro`, `content/site.ts` |
| Navigation, language, footer | `layouts/Layout.astro`, `components/LanguagePosition.astro` |
| Inner-page colour and cards | `styles/pages.css` |
| Shared type, header, contact | `styles/global.css` |
| Tableau and notebooks | `content/projects.ts`, `content/languages.ts` |
| Shared bilingual notebook tiles | `components/NotebookList.astro`, `styles/global.css` |
| Work menu destinations | `content/site.ts` `path` fields |
| Deploy | `.github/workflows/deploy.yml`, `astro.config.mjs` |

## Commands

```sh
npm ci
npm run check
npm run build
npx playwright install chromium
npm test
```

`npm test` previews `dist/`. Rebuild before testing if a preview server is
already running; Playwright reuses it outside CI and will test a stale build.
Browser launch for ad hoc checks needs `chromium.launch({ channel: 'chromium' })`.

`npm run check` typechecks the Playwright tests too. A type error there fails
the GitHub Action before deploy. Watch the new run with
`gh run list` and `gh run watch`; an older red run is not the current deploy.

## Design currently in force

- Paper `#f8f5ee` for the homepage, About, and Books. Other inner pages use the
  section wash from the homepage band they belong to.
- Work & Interests has no panel background. “Work &” is black (`#1a1a1a`);
  “interests” is red (`#c23b2e`). Each category tile uses the background of the
  section it scrolls to.
- Visualization tiles are one card. The image is full width; the title is
  smaller than the image. Do not put the text in a second box.
- Homepage research images use matched frames, including portrait covers.
  The Kaggle tile uses one Cyclistic chart, not a narrow collage. Keep this
  treatment separate from full notebook charts; see `skills/design.md`.
- The portrait is not desaturated. Do not add a lilac courses wash or a second
  green that does not match the link teal.
- Contact is the footer heading. The footer is at least one viewport tall so a
  click can land on Contact instead of the section above it.
