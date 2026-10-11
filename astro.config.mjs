import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ashishkamra.github.io',
  base: '/artfuldata',
  srcDir: './src/artfuldata',
  trailingSlash: 'always',
  redirects: {
    '/ceg': '/artfuldata/analytics/ceg/',
  },
});
