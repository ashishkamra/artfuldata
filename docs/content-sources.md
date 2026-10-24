# Content sources and editorial notes

## Biography

Source: `Monalisa_Hota_FlowCV_Resume_2026-10-03.pdf` and the owner’s clarifications.
Portrait extracted from the supplied CV. Public contact presentation uses email,
city, and professional-profile links. The CV download is the supplied original PDF.

## Tableau

The three selected titles, workbook identifiers, default views, and thumbnails were
verified against Lisa Hota’s public profile on 4 October 2026:
<https://public.tableau.com/app/profile/lisa.hota/vizzes>.

| Project | Workbook / default view |
| --- | --- |
| Snapshot of Delays: Germany’s High Speed Trains | `SnapshotofDelaysGermanysHighSpeedTrains/Dashboard1` |
| A Journey Through Delays | `AJourneyThroughDelays/Dashboard_Flower` |
| Shades of Trust: How Americans Trust Each Other | `ShadesofTrustHowAmericansTrustEachOther/DashboardATPTrustEachOther` |

Descriptions are concise portfolio summaries. The homepage uses actual dashboard
previews, without decorative illustrations.

Owner clarification (19 October 2026): keep Cyclistic/Kaggle under research
and analysis; show the nutrition diary in both research/analysis and data
visualization. Visualization order: nutrition diary, orange flower (*A Journey
Through Delays*), radial (*Snapshot of Delays*), then *Shades of Trust*.
Existing Tableau anchor IDs remain unchanged.

## Kaggle

All three notebooks and direct links were verified on the public profile:
<https://www.kaggle.com/lisamlh/code>. Display titles are shortened for readability.
The Cyclistic and nutrition descriptions use the notebooks’ own summaries: the
2022 member and casual comparison, and the 324-day diary findings (about 1,500
calories, 65 grams of protein met at an average of 81 grams, 30 percent of
calories from protein usually not met). Do not add findings that are not in
those notebooks.

## Research

- **ASER 2006:** the site links `public/documents/aser-2006.pdf`, *Annual Status
  of Education Report (Rural) 2006*, published by Pratham on 5 January 2007.
  The tile image is the cover page. Her name is not printed in the report.
  Do not claim she authored it. The page keeps the CV’s 2006–2007 Research
  Officer role and does not restore the external ASER 2005 PDF.
- **Indian Social Institute:** organisation confirmed by the owner. Source:
  `Evolution of values_report_FINAL.pdf`, copied to
  `public/documents/evolution-of-values.pdf`, *Evolution of Values among
  Children*, by Monalisa Hota, October 2012. Report details: 37 children, ages
  6–15, one school in Bangalore, qualitative moral-dilemma study. Findings are
  exploratory. The tile image is the supplied Piaget illustration; the credit
  on the image is Joshua Seong, Verywell.
- **LSE:** source `Dissertation-for sharing_CSA_monalisa.pdf`, *Reporting Child
  Sexual Abuse in India: Lessons from Developed Nations*, September 2009.
  The synopsis reflects the original dissertation, including its historical context.
- **Akshara and BBA:** contributions summarised from the CV; the report file is
  still not on the site, and the page says so. The tile uses the two supplied
  photographs, stitched side by side. BBA remains on About. No document links
  or findings are invented.
- **Report Bee:** the research page summarises the CV’s Education Evangelist role,
  including the online teacher community and 15 published stories from 50
  submissions. The tile image is the cover of *Reflections*, Volume 1, April 2015.
  No Report Bee PDF was supplied. Homepage tiles link to these named research
  sections rather than the employment entries on About.
- **LSE tile image:** the supplied picture is the cover of Pinki Virani’s
  *Bitter Chocolate*, not the dissertation cover. The page says so. The linked
  document remains the dissertation PDF.
- **Kaggle images:** Cyclistic Part 1 and Part 2, and the four nutrition-diary
  charts, are the supplied notebook figures. Descriptions do not add findings
  that are not written on the charts.
- **Arlington Town Survey:** source `2025 Annual Town Survey Report.pdf`, copied to
  `public/documents/2025-town-survey.pdf`. The site repeats the CV claim (survey tool,
  analysis, visualisation, report writing) and the report’s own scope: 3,268 responses,
  1 January–4 March 2024. Her name is not printed in the report. The report’s summary
  says it was prepared with Gemini, Jasper, Tableau, Excel, and Perplexity.

## CEG

Source: all seven files in `CEG/`, with original chart images converted to WebP.
The filename spelling `Pahse` is retained in the source folder; published names are normalised.

- Phase 1: spring outreach, 18 April–13 May 2025. The pre/post chart labels 40 and
  53 site sessions; uses 60-day windows; excludes March from the pre comparison.
- Phase 2: autumn outreach, 29 September–18 October 2025. Annotation documents
  incomplete flyer distribution, flyers taken down, and postcards sent on 18 October.
- Phase 3: postcards only, 13 February 2026. The pre/post chart labels 30 and 18
  unique visitors in 30-day windows.
- Monthly charts note historical February/March peaks and potential election effects.

Bars represent unique visitors; crosses represent site sessions. Published narratives
describe patterns rather than causal effects. No raw dataset, attendance data, or
registration outcomes were supplied. Future measurement suggestions are explicitly
forward-looking, not claims about methods already used.

## Community

CEG analysis and the town survey are published under Data Analytics. The community
page links back to those write-ups and summarises the activities in short paragraphs.

Oxfam is the one sentence already used on About: repairing donated watches at an
Oxfam shop in Düsseldorf, from September 2026.

Refugee resource coordination in 2021–2022 is described in the supplied biography.

The Ugly Indian and My Name My Story have no source text in the repository, so they
are not displayed. `Community.pdf` was not in the folder when this page was built.

The published ASER file is `public/documents/aser-2006.pdf`. A copy may also sit
in `incoming/` or the repo root; do not link those paths.

## Creative woodworking

Source: the résumé’s *Passion Projects as an Innovative Design-Builder* entry,
January 2018–November 2025, Massachusetts, USA, reiterated by the owner.
The introduction covers self-taught wooden furniture design, more than eight
storage solutions, repurposed materials, prototyping, and iteration. Listed solution
types are moving walls/doors, tri-fold door cabinets, pull-out units, and bookshelves.
These are résumé-based categories, not individual project case studies.

The owner’s companion woodworking website is under construction. Its URL and
project media have not been supplied. Add selected pieces, source links, and
photographs to `src/artfuldata/pages/woodworking.astro` once available.

## Layout and tone

Book cover update (24 October 2026): the owner supplied the Amazon image for
*Originals* and the MACK image for *Irrational*. Optimized local WebP copies are
stored in `public/images/books/`; exact source URLs and dimensions are recorded
in `content/site.ts`. These two images are not Wikipedia images and must not
be credited as such. No additional reproduction rights are asserted.

The site uses descriptive headings, short first-person summaries, and restrained
styling. Unavailable reports are not linked; CV-based contribution summaries are
labelled separately from published reports.
Research limitations and attribution notes remain visible.

Profile references for this direction:
- <https://andreasuozzo.com/> — direct introduction and descriptions of contributions.
- <https://veronikahalamkova.github.io/portfolio.html> — grouped work with short captions.
- <https://lisacharlottemuth.com/about.html> — factual first-person biography.
