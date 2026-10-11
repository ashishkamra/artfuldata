# Artfuldata — Monalisa Hota’s portfolio

A static personal portfolio for data analysis, data visualization,
and social research. Built with Astro and deployed to GitHub Pages.

## Develop locally

Use Node.js 22.19+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/artfuldata/`.

```sh
npm run check
npm run build
npx playwright install chromium
npm test
npm run preview
```

The browser checks cover desktop and mobile layouts, navigation and collateral
links, image loading, chart-dialog keyboard interactions, and on-demand Tableau embeds.
Tests run against a production build; run `npm run build` before `npm test`.

## Site sections

- **Home:** a short introduction, three dashboard previews, and a compact list of
  analysis and research projects.
- **Data Visualization:** three selected Tableau dashboards with local previews,
  direct Tableau links, and optional click-to-load interactive views.
- **Data Analysis:** Kaggle notebooks, ASER 2005, the Indian Social Institute
  pilot report, the LSE dissertation, the CEG outreach case study, the 2025
  Arlington town survey. Unfinished report entries are not displayed.
- **Community:** civic research, refugee support, and Oxfam volunteering.
- **Woodworking:** a short introduction to self-taught furniture and storage projects.
- **About:** professional background, education, skills, and the supplied CV.

## Update content

The top-right EN/DE switch keeps the current page and section. German pages are
served under `/artfuldata/de/`; their copy is in `src/artfuldata/pages/de/[...page].astro`
and project summaries are in `src/artfuldata/content/languages.ts`. Original linked
PDFs, images, and external dashboards retain their original language.

Inner pages include a Back link. It returns to the preceding portfolio page when
available; direct visits fall back to Home (or Analysis for the CEG case study).

Formatting is shared across languages in `src/artfuldata/styles/global.css`: the
header and footer keep darker 2px rules; selected content groups use lighter 1px
dividers. About and Woodworking rely on headings and spacing, while CEG keeps only
two content dividers (at the overview and the chart analysis). Thin internal rules
separate list entries without framing the entire list. Sections use 24px padding
on desktop and 20px on mobile. Dashboard previews preserve their original
proportions. The CEG section navigation is shared by both languages in
`src/artfuldata/components/CaseNavigation.astro`.

- Tableau, Kaggle, and forthcoming report records: `src/artfuldata/content/projects.ts`.
- Town survey PDF: `public/documents/2025-town-survey.pdf`.
- Page narratives: `src/artfuldata/pages/`.
- Shared design: `src/artfuldata/styles/global.css` and `layouts/Layout.astro`.
- Published images and PDFs: `public/images/` and `public/documents/`.
- Link-sharing image source: `assets/social-card.svg`, rendered to `public/images/social-card.png`.
- Add a future report PDF to `public/documents/`, then replace its forthcoming
  entry with a linked case-study section in `pages/analytics.astro`.
- `docs/content-sources.md` documents sources, attribution, and editorial decisions.

The source CV, thesis, pilot report, and CEG files remain in their original locations.
Optimised copies are used for the site. Tableau thumbnails were downloaded from the
public profile’s published preview URLs; refresh the local images if dashboards change.
Google Fonts are optional external font resources; system-font fallbacks are provided.
Tableau is contacted only when a visitor opens an embedded dashboard or follows a link.

## GitHub Pages

Expected URL: `https://ashishkamra.github.io/artfuldata/`.

1. In the repository’s **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push the website changes to `main`, or trigger **Build and deploy portfolio** manually.
3. The workflow checks, builds, browser-tests, and publishes only `dist/`.

Deployment paths are configured in `astro.config.mjs`. If the repository name or
hosting location changes, update `site` and `base` there. The sitemap and canonical
URLs derive from those settings. No backend or credentials are required.

## Original analysis archive

`archive/immigration-analysis/` contains a preserved copy of the original Excel dataset,
Python analysis, plots, and Sankey images. Its README describes how to run that analysis.
The original root collateral remains available; neither the originals nor the archive
are included in the website deployment.
