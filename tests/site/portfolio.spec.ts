import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test('navigation, images, and local collateral resolve on every portfolio page', async ({ page, request, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const paths = ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'community/', 'woodworking/', 'about/'];
  for (const path of paths.flatMap(path => [path, `de/${path}`])) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#main h1')).toHaveCount(1);
    const german = path.startsWith('de/');
    const inMainNav = ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'about/'].includes(path.replace(/^de\//, ''));
    await expect(page.getByRole('navigation', { name: german ? 'Hauptnavigation' : 'Main navigation' }).locator('a[aria-current="page"]')).toHaveCount(inMainNav ? 1 : 0);
    await expect(page.locator('html')).toHaveAttribute('lang', german ? 'de' : 'en');
    for (const image of await page.locator('main img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const links = await page.locator('a[href]').evaluateAll(elements => [...new Set(elements.map(element => (element as HTMLAnchorElement).href))]);
    for (const link of links.filter(link => new URL(link).origin === new URL(baseURL!).origin)) {
      const result = await request.get(link);
      expect(result.ok(), link).toBe(true);
      if (link.endsWith('.pdf')) expect(result.headers()['content-type']).toContain('application/pdf');
    }
  }
  expect(errors).toEqual([]);
});

test('homepage prioritises dashboards without promotional or unfinished sections', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Data Analysis and Visualization');
  await expect(page.locator('.brand')).toHaveText('Monalisa Hota');
  await expect(page.locator('.viz-tiles > a')).toHaveCount(3);
  await expect(page.locator('.project-index > a')).toHaveCount(3);
  await expect(page.locator('main').getByRole('link', { name: 'Community', exact: true })).toHaveCount(0);
  await expect(page.locator('footer h2')).toHaveCount(0);
  await expect(page.locator('.eyebrow, .brand-mark, .notebook-art, .status')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About me');
  await expect(page.getByRole('link', { name: 'Download CV' })).toBeVisible();
  await page.goto('community/');
  await expect(page.getByText(/Details to be added|Copy to be added/)).toHaveCount(0);
});

test('key pages have visible content and readable desktop and mobile layouts', async ({ page }, testInfo) => {
  const screenshotDir = process.env.PORTFOLIO_SCREENSHOT_DIR;
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
  const pages = [['home', ''], ['about', 'about/'], ['analysis', 'analytics/'], ['visualization', 'visualisation/'], ['community', 'community/'], ['woodworking', 'woodworking/'], ['case-study', 'analytics/ceg/']];
  for (const [name, path] of pages.flatMap(([name, path]) => [[name, path], [`${name}-de`, `de/${path}`]])) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.brand')).toHaveCSS('font-size', '26px');
    const padding = testInfo.project.name === 'mobile' ? '20px' : '24px';
    const spacing = await page.locator('#main > section:not(.hero, .page-intro, .project-list, .activity-list), .project, .activity-list > article').evaluateAll(sections => sections.map(section => getComputedStyle(section).paddingTop));
    expect(spacing.every(value => value === padding)).toBe(true);
    expect(await page.locator('main').innerText()).not.toHaveLength(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const image of await page.locator('main img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    }
    if (screenshotDir) await page.screenshot({ path: join(screenshotDir, `${name}-${testInfo.project.name}.png`), fullPage: true });
  }
});

test('dividers are selective and quieter than the shared header and footer in both languages', async ({ page }) => {
  const pages: [string, number][] = [
    ['', 2], ['analytics/', 6], ['visualisation/', 2],
    ['community/', 2], ['woodworking/', 0], ['about/', 0], ['analytics/ceg/', 2],
  ];
  for (const [path, expectedCount] of pages.flatMap(([path, count]) => [[path, count], [`de/${path}`, count]] as [string, number][])) {
    await page.goto(path);
    await expect(page.locator('.site-header')).toHaveCSS('border-bottom-width', '2px');
    await expect(page.locator('footer')).toHaveCSS('border-top-width', '2px');
    await expect(page.locator('.site-header')).toHaveCSS('border-bottom-color', 'rgb(173, 182, 173)');
    await expect(page.locator('footer')).toHaveCSS('border-top-color', 'rgb(173, 182, 173)');
    const dividers = await page.locator('#main > section, #main > .case-meta, .project, .activity-list > article').evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      return { width: style.borderTopWidth, color: style.borderTopColor };
    }).filter(border => border.width !== '0px'));
    expect(dividers, path).toEqual(Array.from({ length: expectedCount }, () => ({ width: '1px', color: 'rgb(203, 209, 200)' })));
    if (path.endsWith('analytics/ceg/')) {
      await expect(page.locator('#overview')).toHaveCSS('border-top-width', '1px');
      await expect(page.locator('#website-activity')).toHaveCSS('border-top-width', '1px');
      for (const article of await page.locator('.timeline article').all()) {
        await expect(article).toHaveCSS('border-top-width', '0px');
      }
    }
    for (const list of await page.locator('.project-index, .experience-list').all()) {
      await expect(list).toHaveCSS('border-top-width', '0px');
      await expect(list.locator(':scope > :first-child')).toHaveCSS('border-top-width', '0px');
      for (const entry of await list.locator(':scope > :not(:first-child)').all()) {
        await expect(entry).toHaveCSS('border-top-width', '1px');
        await expect(entry).toHaveCSS('border-top-color', 'rgb(222, 223, 215)');
      }
      await expect(list.locator(':scope > :last-child')).toHaveCSS('border-bottom-width', '0px');
    }
  }
});

test('dashboard previews use their natural proportions and CV links are not duplicated', async ({ page }) => {
  for (const prefix of ['', 'de/']) {
    await page.goto(prefix);
    const images = page.locator('.viz-tiles img');
    for (const image of await images.all()) {
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
      const proportions = await image.evaluate(element => {
        const image = element as HTMLImageElement;
        const box = image.getBoundingClientRect();
        return { displayed: box.width / box.height, natural: image.naturalWidth / image.naturalHeight };
      });
      expect(proportions.displayed).toBeCloseTo(proportions.natural, 2);
    }
    await page.goto(`${prefix}about/`);
    await expect(page.locator('#main a[href$="monalisa-hota-cv.pdf"]')).toHaveCount(1);
    await expect(page.locator('.personal-note')).toHaveCSS('max-width', 'none');
  }
});

test('CEG section links and language switching preserve the newly selected section', async ({ page }) => {
  await page.goto('analytics/ceg/');
  const navigation = page.getByRole('navigation', { name: 'Case study sections' });
  for (const link of await navigation.getByRole('link').all()) {
    const href = await link.getAttribute('href');
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await navigation.getByRole('link', { name: 'Limitations', exact: true }).click();
  await expect(page).toHaveURL(/#limitations$/);
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/analytics\/ceg\/#limitations$/);
  await expect(page.locator('#limitations')).toBeInViewport();
  await expect(page.getByRole('navigation', { name: 'Bereiche der Fallstudie' }).getByRole('link')).toHaveCount(7);
});

test('language switching preserves page and anchor, and navigation stays in German', async ({ page }) => {
  await page.goto('analytics/#town-survey');
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/analytics\/#town-survey$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('#main h1')).toHaveText('Datenanalyse und Forschung');
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Über mich' }).click();
  await expect(page).toHaveURL(/\/de\/about\/$/);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/artfuldata\/about\/$/);
  await expect(page.locator('#main h1')).toHaveText('About me');
});

test('back links return to the previous page and have safe direct-entry fallbacks', async ({ page }) => {
  await page.goto('');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Data Analysis', exact: true }).click();
  await page.getByRole('link', { name: 'Read the case study', exact: true }).click();
  await page.getByRole('link', { name: 'Back to previous page', exact: true }).click();
  await expect(page).toHaveURL(/\/artfuldata\/analytics\/$/);
  await page.goto('de/analytics/ceg/');
  await expect(page.locator('.back-link')).toHaveAttribute('href', '/artfuldata/de/analytics/');
  await page.locator('.back-link').click();
  await expect(page).toHaveURL(/\/de\/analytics\/$/);
  await page.goto('de/about/');
  await expect(page.locator('.back-link')).toHaveAttribute('href', '/artfuldata/de/');
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
