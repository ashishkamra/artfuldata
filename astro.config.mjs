import { defineConfig } from 'astro/config';

// GitHub Actions tests keep the Pages base. Vercel sets VERCEL=1 and serves the site at the domain root.
const vercel = process.env.VERCEL === '1';

export default defineConfig({
  site: vercel ? 'https://artfuldata.vercel.app' : 'https://ashishkamra.github.io',
  base: vercel ? '/' : '/artfuldata',
  srcDir: './src/artfuldata',
  trailingSlash: 'always',
  redirects: {
    '/ceg': `${vercel ? '' : '/artfuldata'}/analytics/ceg/`,
  },
});
