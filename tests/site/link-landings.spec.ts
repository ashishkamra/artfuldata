import { test, expect } from '@playwright/test';

// Click every on-site link and check the landing, not only that the URL exists.
const seeds = ['', 'de/', 'visualisation/', 'de/visualisation/', 'analytics/', 'de/analytics/', 'analytics/ceg/', 'de/analytics/ceg/', 'community/', 'de/community/', 'about/', 'de/about/', 'books/', 'de/books/', 'creativity/', 'de/creativity/', 'courses/', 'de/courses/', 'woodworking/', 'de/woodworking/'];

test.describe('link landings', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test.describe.configure({ timeout: 240000 });

  test('clicks reach the named heading without breaking the page frame', async ({ page, baseURL }) => {
    await page.goto('');
    await page.evaluate(() => document.fonts.ready);
    const homeBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const seen = new Set<string>();

    for (const seed of seeds) {
      await page.goto(seed);
      await page.evaluate(() => document.fonts.ready);
      const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => ({
        href: anchor.getAttribute('href') ?? '',
        pdf: (anchor.getAttribute('href') ?? '').endsWith('.pdf'),
        external: anchor.host !== location.host,
        chart: anchor.classList.contains('chart-zoom'),
        skip: anchor.classList.contains('skip-link'),
        menu: !!anchor.closest('.work-dropdown'),
      })));

      for (const link of links) {
        if (!link.href || link.href.startsWith('mailto:') || link.external || link.chart || link.skip) continue;
        if (link.pdf) {
          await expect(page.locator(`a[href="${link.href}"]`).first()).toHaveAttribute('target', '_blank');
          continue;
        }
        const destination = new URL(link.href, new URL(seed, baseURL).href);
        if (!destination.pathname.startsWith(new URL(baseURL!).pathname)) continue;
        const key = destination.pathname + destination.hash;
        if (seen.has(key)) continue;
        seen.add(key);

        await test.step(`${seed || 'home'} → ${key}`, async () => {
          await page.goto(seed);
          if (link.menu) await page.locator('.work-menu summary').click();
          await page.locator(`a[href="${link.href}"]`).first().click();
          await expect(page).toHaveURL(destination.href);
          const target = destination.hash ? page.locator(destination.hash) : page.locator('#main');
          const heading = target.getByRole('heading');
          await expect(await heading.count() ? heading.first() : target).toBeInViewport();
          if (destination.hash === '#contact') {
            await expect.poll(() => page.locator('#contact').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(24);
          }
          const frame = await page.evaluate(() => {
            const header = document.querySelector('.site-header')!.getBoundingClientRect();
            const main = document.querySelector('main')!.getBoundingClientRect();
            return {
              aligned: Math.abs(header.left - main.left) <= 2 && Math.abs(header.width - main.width) <= 2,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              background: getComputedStyle(document.body).backgroundColor,
            };
          });
          expect(frame.aligned, key).toBe(true);
          expect(frame.overflow, key).toBe(false);
          const path = destination.pathname;
          const root = new URL(baseURL!).pathname;
          if (path === root || path === `${root}de/` || /\/(about|books)\/$/.test(path)) expect(frame.background).toBe(homeBackground);
        });
      }
    }
    expect(seen.size).toBeGreaterThan(30);
  });
});
