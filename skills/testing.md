# Testing skill

Use this when adding a browser check, or when `npm test` or `npm run check`
fails in GitHub Actions.

## How to run

```sh
npm run build
npx playwright install chromium
npm test
```

Outside CI, Playwright reuses a preview server on port 4321. If that server was
started before the latest build, the tests are looking at old files. Rebuild,
or stop the old preview, before trusting a pass or a failure.

Ad hoc scripts must launch Chromium with `{ channel: 'chromium' }`. The default
headless-shell executable is not available here.

## What the suites cover

- `tests/site/portfolio.spec.ts`: layout, navigation chrome, language-switch
  position, contact landing, and CV opening in a new tab.
- `tests/site/navigation-targets.spec.ts`: homepage categories, Work menu pages,
  project tiles, and research section navigation in both languages. It checks
  the heading in view, not only the URL.
- `tests/site/link-landings.spec.ts`: every same-origin HTML link from the main
  pages. It skips external sites, `mailto:`, chart-zoom dialogs, and the
  off-screen skip link. PDF links must have `target="_blank"`. Home, About, and
  Books must share the homepage background. Header and main must align, and the
  page must not overflow horizontally.

## Rules for new tests

- Click the control. Do not only request the URL, unless the check is a file
  download.
- Assert the destination heading is in the viewport. For Contact, its top must
  be within 24px of the viewport top.
- Cover English and German when the copy or route differs.
- `npm run check` typechecks these files. An `a[href]` element from
  `evaluateAll` is an `Element`, not an `HTMLAnchorElement`, until you cast it.
  That error fails the deploy before tests run.
- Do not loosen a scroll assertion to hide a race. Set the precondition and
  activate the control in one `evaluate` when the page may still be scrolling.
- The mobile Work-menu test must wait until the menu is below the header, under
  the Work button, and on screen. A single immediate read can race the
  placement script.
- After adding report images, check homepage-to-research anchor clicks in both
  languages on mobile. Tall images before the text pushed the ASER heading out
  of view; the fix was text-first mobile ordering, not weakening the test.
- Equal image-element dimensions do not guarantee visual balance: `contain`
  can leave landscape content tiny inside a portrait frame. Inspect screenshots
  as well as dimensions, including at responsive breakpoints.

## CI

The workflow builds with the `/artfuldata` base, then tests that build. A
Vercel production build is separate and uses `/`. Do not point the Playwright
`baseURL` at `artfuldata.vercel.app` unless the assertions are updated for the
root path.
