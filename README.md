# Artfuldata — Monalisa Hota’s portfolio

A static personal portfolio for data analysis, data visualization,
and social research. Built with Astro and deployed to Vercel.

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

- **Home:** a scrollable editorial portfolio with five work categories, dashboard
  previews, research cards, creative interests, community work, courses, and books.
- **Navigation:** Home, a keyboard-accessible Work menu, CV (PDF), Books, and Contact.
- **Data Visualization:** three selected Tableau dashboards with local previews,
  direct Tableau links, and optional click-to-load interactive views.
- **Data Analysis:** Kaggle notebooks, ASER 2005, the Indian Social Institute
  pilot report, the LSE dissertation, the CEG outreach case study, the 2025
  Arlington town survey, and CV-based summaries for Akshara Foundation and Report
  Bee. The Akshara entry notes that its report is not available on this site.
- **Community:** civic research, refugee support, and Oxfam volunteering.
- **Woodworking:** a short introduction to self-taught furniture and storage projects.
- **About:** professional background, education, skills, and the supplied CV.
- **Books:** favourite books from the supplied navigation sketch.
- **Creativity:** woodworking and repurposing, with a clearly marked garden area
  awaiting project notes and photographs.
- **Courses:** the Google Data Analytics and research methodology certificates.

## Update content

The top-right EN/DE switch keeps the current page and viewing position without
scrolling back to an old URL anchor. German pages are
served under `/artfuldata/de/`; their copy is in `src/artfuldata/pages/de/[...page].astro`
and project summaries are in `src/artfuldata/content/languages.ts`. Original linked
PDFs, images, and external dashboards retain their original language.

Inner pages include a Back link. It returns to the preceding portfolio page when
available; direct visits fall back to Home (or Analysis for the CEG case study).

The shared design uses Cormorant Garamond headings, DM Sans body text, and Caveat
handwritten accents on a warm paper palette. Shared navigation and detail-page
styles live in `src/artfuldata/styles/global.css`; homepage cards, illustrations,
and bookshelf styles live in `styles/home.css`. Both languages use the shared
`components/Home.astro` and `components/Collection.astro` components. Dashboard
previews preserve their original proportions. Existing case studies retain their
selective dividers and chart navigation.

The homepage work directory uses a darker background and larger links. Each
section has its own background colour. Tiles bounce once on hover; the animation
is disabled for touch devices and visitors who prefer reduced motion. Language
scroll restoration is handled by `components/LanguagePosition.astro`.

`tests/site/navigation-targets.spec.ts` clicks through the homepage categories,
project tiles, Work menu, and research navigation in both languages. It checks
the expected destination heading is in view, not only that the URL exists.

- Tableau, Kaggle, and forthcoming report records: `src/artfuldata/content/projects.ts`.
- Work categories and favourite books: `src/artfuldata/content/site.ts`.
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

## Vercel

Expected URL: `https://artfuldata.vercel.app/`.

Push to `main` to run **Build and deploy portfolio**. The workflow checks and
browser-tests the site, then deploys it to the `artfuldata` project on Vercel.
Vercel serves the site from the domain root. The test build still uses the
`/artfuldata` base so the existing browser checks stay stable.

The repository needs `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
in GitHub Actions secrets.

## Original analysis archive

`archive/immigration-analysis/` contains a preserved copy of the original Excel dataset,
Python analysis, plots, and Sankey images. Its README describes how to run that analysis.
The original root collateral remains available; neither the originals nor the archive
are included in the website deployment.
