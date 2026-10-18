import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test('navigation, images, and local collateral resolve on every portfolio page', async ({ page, request, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const paths = ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'community/', 'woodworking/', 'about/', 'books/', 'creativity/', 'courses/'];
  for (const path of paths.flatMap(path => [path, `de/${path}`])) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#main h1')).toHaveCount(1);
    const german = path.startsWith('de/');
    const inMainNav = ['', 'books/'].includes(path.replace(/^de\//, ''));
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
      const hash = new URL(link).hash;
      if (hash) expect(await result.text(), link).toContain(`id="${decodeURIComponent(hash.slice(1))}"`);
    }
  }
  expect(errors).toEqual([]);
});

test('homepage follows the five-category work layout with linked project collections', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Data analysis & social research');
  await expect(page.locator('.brand')).toHaveText('Monalisa Hota');
  await expect(page.locator('.viz-tiles > a')).toHaveCount(3);
  await expect(page.locator('.research-cards > a')).toHaveCount(8);
  await expect(page.locator('.making-grid > a')).toHaveCount(3);
  await expect(page.locator('.mini-books > a')).toHaveCount(3);
  await expect(page.locator('.home-flow h2')).toHaveText([
    'Work & interests ↘', 'Data visualization', 'Research & experiments', 'Problem solving & creativity',
    'Community & volunteering', 'Courses & certificates', 'Favourite books',
  ]);
  const categories = page.getByRole('navigation', { name: 'Work categories' });
  await expect(categories.getByRole('link')).toHaveCount(5);
  for (const link of await categories.getByRole('link').all()) {
    await expect(page.locator((await link.getAttribute('href'))!)).toHaveCount(1);
  }
  await page.locator('.hero-copy').getByRole('link', { name: 'About me' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About me');
  await expect(page.getByRole('link', { name: 'Download CV' })).toBeVisible();
  await page.goto('community/');
  await expect(page.getByText(/Details to be added|Copy to be added/)).toHaveCount(0);
});

test('homepage has an unlabelled portrait, a prominent work directory, and separate section backgrounds', async ({ page }) => {
  for (const prefix of ['', 'de/']) {
    await page.goto(prefix);
    await expect(page.locator('.hero-collage')).toHaveText('✳');
    await expect(page.locator('.portrait-note img')).toHaveAttribute('alt', 'Monalisa Hota');
    await expect(page.locator('.portrait-note figcaption, .collage-note')).toHaveCount(0);
    await expect(page.locator('#work-title')).toHaveRole('heading');
    const headingSize = await page.locator('#work-title').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
    expect(headingSize).toBeGreaterThanOrEqual(40);
    const categorySizes = await page.locator('.work-categories a').evaluateAll(links => links.map(link => parseFloat(getComputedStyle(link).fontSize)));
    expect(categorySizes.every(size => size >= 17)).toBe(true);
    const backgrounds = await page.locator('.work-directory, .home-flow > .flow-section').evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor));
    expect(backgrounds).toHaveLength(7);
    expect(new Set(backgrounds).size).toBe(7);
    expect(backgrounds).not.toContain('rgba(0, 0, 0, 0)');
  }
});

test('tiles bounce on hover only when hover and motion are supported', async ({ page }) => {
  await page.goto('');
  const hoverSupported = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const selector of ['.work-categories a', '.home-tile', '.research-card', '.making-card', '.community-links a', '.course-card', '.mini-books a']) {
    const tile = page.locator(selector).first();
    await tile.hover();
    await expect(tile).toHaveCSS('animation-name', hoverSupported ? 'tile-bounce' : 'none');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const tile = page.locator('.home-tile').first();
  await tile.hover();
  await expect(tile).toHaveCSS('animation-name', 'none');
  await expect(tile).toHaveCSS('translate', 'none');
});

test('main navigation supports Work disclosure, favourites, CV, and Contact', async ({ page, request }) => {
  for (const prefix of ['', 'de/']) {
    await page.goto(prefix);
    await page.evaluate(() => document.fonts.ready);
    const homeBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const summary = page.locator('.work-menu summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.work-menu')).toHaveAttribute('open', '');
    await expect(page.locator('.work-dropdown a')).toHaveCount(6);
    await page.keyboard.press('Escape');
    await expect(page.locator('.work-menu')).not.toHaveAttribute('open');
    await expect(summary).toBeFocused();
    await summary.click();
    const menuBox = await page.evaluate(() => {
      const menu = document.querySelector('.work-dropdown')!.getBoundingClientRect();
      const trigger = document.querySelector('.work-menu summary')!.getBoundingClientRect();
      const header = document.querySelector('.site-header')!.getBoundingClientRect();
      return {
        belowHeader: menu.top >= header.bottom - 1,
        underTrigger: menu.left <= trigger.right && menu.right >= trigger.left,
        onScreen: menu.left >= -1 && menu.right <= window.innerWidth + 1,
      };
    });
    expect(menuBox.belowHeader).toBe(true);
    expect(menuBox.underTrigger).toBe(true);
    expect(menuBox.onScreen).toBe(true);
    await page.locator('.work-dropdown a[href$="analytics/"]').click();
    await expect(page).toHaveURL(/\/analytics\/$/);
    await expect(page.locator('.work-menu')).not.toHaveAttribute('open');
    await expect(page.locator('#main h1')).toBeInViewport();
    await page.locator('.primary-nav a[href$="books/"]').click();
    await expect(page.locator('body')).toHaveCSS('background-color', homeBackground);
    await expect(page.locator('.book-grid article')).toHaveCount(8);
    await page.getByRole('link', { name: prefix ? 'Kontakt' : 'Contact', exact: true }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    const cv = await request.get((await page.locator('.primary-nav a[href$=".pdf"]').getAttribute('href'))!);
    expect(cv.headers()['content-type']).toContain('application/pdf');
  }
});

test('key pages have visible content and readable desktop and mobile layouts', async ({ page }, testInfo) => {
  const screenshotDir = process.env.PORTFOLIO_SCREENSHOT_DIR;
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
  const pages = [['home', ''], ['about', 'about/'], ['analysis', 'analytics/'], ['visualization', 'visualisation/'], ['community', 'community/'], ['woodworking', 'woodworking/'], ['case-study', 'analytics/ceg/'], ['books', 'books/'], ['creativity', 'creativity/'], ['courses', 'courses/']];
  for (const [name, path] of pages.flatMap(([name, path]) => [[name, path], [`${name}-de`, `de/${path}`]])) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.brand')).toHaveCSS('font-size', '26px');
    const padding = testInfo.project.name === 'mobile' ? '20px' : '28px';
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
    ['', 0], ['analytics/', 0], ['visualisation/', 0],
    ['community/', 0], ['woodworking/', 0], ['about/', 0], ['analytics/ceg/', 0],
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
      await image.scrollIntoViewIfNeeded();
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
  await page.locator('#limitations').evaluate(element => element.scrollIntoView({ behavior: 'instant' }));
  await page.getByRole('link', { name: 'Deutsch', exact: true }).evaluate(link => (link as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/\/de\/analytics\/ceg\/#limitations$/);
  await expect(page.locator('html')).not.toHaveAttribute('data-language-position');
  await expect(page.locator('#limitations')).toBeInViewport();
  await expect(page.getByRole('navigation', { name: 'Bereiche der Fallstudie' }).getByRole('link')).toHaveCount(7);
});

test('changing language at the top does not scroll back to an old fragment', async ({ page }) => {
  for (const [path, language, destination] of [
    ['#research', 'Deutsch', /\/de\/#research$/],
    ['de/#research', 'English', /\/artfuldata\/#research$/],
  ] as const) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // The initial fragment can still be smooth-scrolling. Set the precondition
    // and activate in one browser task so a frame cannot move us away from zero.
    const before = await page.getByRole('link', { name: language, exact: true }).evaluate(link => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const y = scrollY;
      (link as HTMLAnchorElement).click();
      return y;
    });
    expect(before).toBe(0);
    await expect(page).toHaveURL(destination);
    await expect(page.locator('html')).not.toHaveAttribute('data-language-position');
    const positions = await page.evaluate(async () => {
      const positions: number[] = [];
      for (let frame = 0; frame < 30; frame++) {
        await new Promise(requestAnimationFrame);
        positions.push(scrollY);
      }
      return positions;
    });
    expect(positions).toEqual(Array(30).fill(0));
  }
});

test('changing language preserves the visible section and offset without an animated scroll', async ({ page }) => {
  for (const [path, language, destination] of [
    ['#research', 'Deutsch', /\/de\/#research$/],
    ['de/#research', 'English', /\/artfuldata\/#research$/],
  ] as const) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#research').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY + 140, behavior: 'instant' }));
    // Activate without scrolling the off-screen header into view first.
    const before = await page.getByRole('link', { name: language, exact: true }).evaluate(link => {
      const top = document.querySelector('#research')!.getBoundingClientRect().top;
      (link as HTMLAnchorElement).click();
      return top;
    });
    await expect(page).toHaveURL(destination);
    await expect(page.locator('html')).not.toHaveAttribute('data-language-position');
    const offsets = await page.locator('#research').evaluate(async element => {
      const offsets: number[] = [];
      for (let frame = 0; frame < 15; frame++) {
        await new Promise(requestAnimationFrame);
        offsets.push(element.getBoundingClientRect().top);
      }
      return offsets;
    });
    expect(offsets.every(offset => Math.abs(offset - before) < 2)).toBe(true);
  }
});

test('language switching preserves page and anchor, and navigation stays in German', async ({ page }) => {
  await page.goto('analytics/#town-survey');
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/analytics\/#town-survey$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('#main h1')).toHaveText('Datenanalyse und Forschung');
  await page.locator('footer').getByRole('link', { name: 'Über mich' }).click();
  await expect(page).toHaveURL(/\/de\/about\/$/);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/artfuldata\/about\/$/);
  await expect(page.locator('#main h1')).toHaveText('About me');
});

test('back links return to the previous page and have safe direct-entry fallbacks', async ({ page }) => {
  await page.goto('');
  await page.getByRole('link', { name: 'All research projects' }).click();
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
