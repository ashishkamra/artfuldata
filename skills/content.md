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
- The Akshara report is not on this site. The page must say that. The two
  supplied photographs are stitched into one tile image.
- The ASER document is `public/documents/aser-2006.pdf`, the 2006 rural report.
  Do not restore the external 2005 PDF or claim she authored the 2006 report.
- The Evolution of Values file is the October 2012 report. Its tile image is the
  supplied Piaget illustration; keep the credit printed on the image.
- The LSE tile image is Pinki Virani’s *Bitter Chocolate* cover, not the
  dissertation. The Report Bee image is the *Reflections* Volume 1 cover.
- Do not restore an “Edward Tufte” bookshelf entry unless the owner supplies a
  real title. “Books on information design” is not a title.
- Six book covers were sourced from English Wikipedia and are stored in
  `public/images/books/`. Their paths, sizes, and source links live in
  `content/site.ts`; shared rendering is in `Collection.astro` and `Home.astro`.
  Preserve the source links and original-resolution thumbnails. Wikipedia's
  fair-use rationale is specific to Wikipedia and is not a reusable license
  or a guarantee that use on this portfolio qualifies as fair use.
  At the time of this session, Originals had no matching Wikipedia cover.
  Irrational has no confirmed author or exact title; ask before substituting
  Predictably Irrational or another book.
- Forthcoming report files stay out of the public pages until the file exists
  in `public/documents/`.

## Documents

Add a PDF to `public/documents/`, then link it. Layout’s script sets
`target="_blank"` on every `.pdf` link. Do not remove that. External Tableau
and Kaggle links stay external; do not embed a dashboard unless the visitor
  opens it.

## Incoming material and image preparation

New owner-supplied material goes in `incoming/photos/`, `incoming/documents/`,
or `incoming/notes/`. Publish only the required copies under `public/images/`
and `public/documents/`; do not commit the entire incoming folder by default.
Keep the originals intact. Use normalized filenames and optimized WebP images.
Apply EXIF orientation before resizing or stitching; Akshara's two photos were
stitched side by side after orientation correction. PDF cover extraction can
use `pdftoppm -f 1 -l 1`; its output may be numbered `-001`, not `-1`.

## Sourcing Kaggle copy

Use the notebook itself, not generic project copy or inferred chart findings.
Keep English descriptions in `content/projects.ts` and matching German copy in
`content/languages.ts`. `NotebookList.astro` renders both languages.

If a plain fetch returns an empty page or only Kaggle's shell, open the public
notebook in Playwright. Its `GetKernelViewModel` response contains
`kernelRun.renderedOutputUrl`; fetch that rendered HTML to read the introduction,
summary, and limitations. Those URLs are temporary: do not publish them or
commit the API response. Keep stable `/code/lisamlh/<slug>` links on the site.
Summarize verified notebook text concisely; the nutrition findings describe a
personal diary, not general nutritional advice.
