# Artfuldata — Monalisa Hota’s portfolio

A static, editorial-style portfolio for data analytics, creative data visualisation,
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

- **Home:** introduction, selected work, and the featured civic engagement study.
- **Data Visualisation:** three selected Tableau dashboards with local previews,
  direct Tableau links, and optional click-to-load interactive views.
- **Data Analytics:** three Kaggle notebooks, ASER 2005, the Indian Social Institute
  pilot report, the LSE dissertation, and forthcoming report entries.
- **CEG Experiment:** the original flyer and six chart visuals with an evidence-led
  narrative and accessible full-size chart viewing.
- **About & Contact:** professional background, education, skills, community work,
  and the supplied CV.

## Update content

- Tableau, Kaggle, and forthcoming report records: `src/artfuldata/content/projects.ts`.
- Page narratives: `src/artfuldata/pages/`.
- Shared design: `src/artfuldata/styles/global.css` and `layouts/Layout.astro`.
- Published images and PDFs: `public/images/` and `public/documents/`.
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
