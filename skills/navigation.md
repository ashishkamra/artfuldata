# Navigation skill

Use this when changing the header, Work menu, language switch, Contact, CV, or
in-page anchors.

## Header

Items are Home, Work, CV, Books (fav), Contact, then EN/DE. Keep even gaps.
Do not force short labels into oversized boxes that make the spacing look uneven.
Books keeps the “(fav)” / “(Favoriten)” label, including on small screens.
CV and every other PDF open in a new tab.

The Work menu is a `<details>` element. Its dropdown must open under the Work
button and below the header border. On a phone, German labels can wrap the nav
onto a second line, so a offset from the summary is not enough. Position the
menu from the header’s bottom edge.

Playwright’s mobile click can open `<details>` without firing `toggle`. Keep
the placement listener on `toggle`, summary `click`, and a `MutationObserver`
for the `open` attribute. A CSS-only `left: 0` on the header puts the menu in
the wrong place.

## Destinations

- Homepage category tiles scroll to the matching homepage section.
- Work menu items open the section pages, not the homepage teasers.
- Contact (`#contact`) must show the Contact heading at the top of the viewport,
  not the previous section. The footer is at least `100vh` and uses a negative
  `scroll-margin-top` to cancel the page scroll padding.
- Other in-page targets use `scroll-margin-top: 28px`.
- Back link uses the real previous portfolio page when there is one. Direct
  entry falls back to Home, or Analysis for the CEG case study.

## Language switch

`components/LanguagePosition.astro` preserves the visible section and its
offset. Do not forward a stale URL hash into the next page while
`scroll-behavior: smooth` is on; that is what snapped visitors back to an old
fragment.

When testing it, set the scroll position and activate the language link in the
same browser task. A separate `scrollTo` can still be moving when the click
runs. Do not weaken the assertion to allow a 1px drift.

## Both languages

Check English and German. German page bodies are in `pages/de/[...page].astro`.
A new English route also needs a `getStaticPaths` entry there, a sitemap entry,
and the same anchor ids.
