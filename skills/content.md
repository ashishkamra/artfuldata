# Content skill

Use this when editing portfolio copy or adding a project, book, course, or document.

## Before editing

Read `docs/content-sources.md` and the CV notes it cites. If a fact is not in
the CV, a supplied document, or an owner clarification, do not add it.

## Where copy lives

- Homepage, both languages: `src/artfuldata/components/Home.astro`.
- Books, creativity, and courses, both languages: `components/Collection.astro`
  and `content/site.ts`.
- English inner pages: `src/artfuldata/pages/`.
- German inner pages: `pages/de/[...page].astro`.
- Tableau and Kaggle records: `content/projects.ts` and `content/languages.ts`.

Change both languages in the same commit. Keep original-language titles for
books, dashboards, notebooks, and PDFs.

## Linking

The visible card title must be the destination heading. If the destination is
“Annual Status of Education Report”, do not title the card only “Pratham”; put
Pratham in the eyebrow. The same rule applies to Indian Social Institute and
the LSE dissertation.

Homepage category tiles scroll to `#visualisation`, `#research`, `#creativity`,
`#community`, and `#courses`. The header Work menu opens the section pages:
`visualisation/`, `analytics/`, `creativity/`, `community/`, and `courses/`.
“All work” still goes to `/#work`.

## Known gaps

- Garden has no notes or photographs yet. Say so.
- Woodworking has no project photographs yet. Do not draw stand-in photos.
- The Akshara report is not on this site. The page must say that.
- Do not restore an “Edward Tufte” bookshelf entry unless the owner supplies a
  real title. “Books on information design” is not a title.
- Forthcoming report files stay out of the public pages until the file exists
  in `public/documents/`.

## Documents

Add a PDF to `public/documents/`, then link it. Layout’s script sets
`target="_blank"` on every `.pdf` link. Do not remove that. External Tableau
and Kaggle links stay external; do not embed a dashboard unless the visitor
opens it.
