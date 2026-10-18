# Deploy skill

Use this when publishing the site or when a push does not appear on Vercel.

## Where it goes

Production is <https://artfuldata.vercel.app/> on the `ashishkamra-8771`
account, team `ashish-kamras-projects`, project `artfuldata`.

GitHub Actions, not Vercel’s Git integration, deploys it. The workflow is
`.github/workflows/deploy.yml`. On a push to `main` it checks, builds, and
browser-tests with the `/artfuldata` base, then runs
`vercel deploy --prod`. Vercel sets `VERCEL=1`, so `astro.config.mjs` switches
`site` to `https://artfuldata.vercel.app` and `base` to `/`.

Do not send the test build’s `dist/` to Vercel. That build still contains
`/artfuldata` paths and will 404 at the domain root.

## Secrets

The deploy job needs these GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` (`team_mngwOqUTD0LMD0twrP1Kz2fg`)
- `VERCEL_PROJECT_ID` (`prj_vboBvWMk9EL0TKtdj16qI7ozfo5d`)

Do not print the token. Do not commit `.vercel/`.

## After a push

```sh
gh run list --repo ashishkamra/artfuldata --limit 3
gh run watch <run-id> --repo ashishkamra/artfuldata --exit-status
```

Confirm the run’s `headSha` is the commit you just pushed. An older failed run
can still be the red mark on the Actions page. The deploy job must succeed, not
only the test job.

Then fetch <https://artfuldata.vercel.app/> and check for the change. GitHub
Pages at `ashishkamra.github.io/artfuldata/` is no longer updated by this
workflow.

## If the pipeline fails

- `npm run check` fails before tests. Fix the TypeScript error and push again.
  The site will not update until a later run deploys.
- `npm test` fails: reproduce with a fresh `npm run build` and
  `npm test -- --workers=2`. Do not skip the failing test to force a deploy.
- Vercel deploy fails: confirm the three secrets exist and the project id still
  matches `artfuldata`.
