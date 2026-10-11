import { test, expect } from '@playwright/test';

test('navigation, images, and local collateral resolve on every portfolio page', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const path of ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'community/', 'woodworking/', 'about/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const inMainNav = ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'about/'].includes(path);
    await expect(page.locator('nav[aria-label="Main navigation"] a[aria-current="page"]')).toHaveCount(inMainNav ? 1 : 0);
    for (const image of await page.locator('main img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const links = await page.locator('a[href]').evaluateAll(elements => [...new Set(elements.map(element => (element as HTMLAnchorElement).href))]);
    for (const link of links.filter(link => link.startsWith('http://localhost:4321/'))) {
      const result = await request.get(link);
      expect(result.ok(), link).toBe(true);
      if (link.endsWith('.pdf')) expect(result.headers()['content-type']).toContain('application/pdf');
    }
  }
  expect(errors).toEqual([]);
});

test('CEG chart enlargement supports keyboard dismissal and restores focus', async ({ page }) => {
  await page.goto('analytics/ceg/');
  const opener = page.getByRole('link', { name: 'View full-size chart: Website activity across the full period' });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Website activity across the full period');
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('old CEG URL points at the analytics case study', async ({ request }) => {
  const result = await request.get('ceg/');
  expect(result.ok()).toBe(true);
  expect(await result.text()).toContain('/artfuldata/analytics/ceg/');
});

test('Tableau dashboards load only when explicitly opened', async ({ page }) => {
  await page.route('https://public.tableau.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html><body>Tableau preview</body></html>' }));
  await page.goto('visualisation/');
  await expect(page.locator('iframe[src]')).toHaveCount(0);
  await page.locator('.embed-panel summary').first().click();
  await expect(page.locator('iframe').first()).toHaveAttribute('src', /SnapshotofDelaysGermanysHighSpeedTrains\/Dashboard1/);
  await expect(page.locator('iframe[src]')).toHaveCount(1);
});
