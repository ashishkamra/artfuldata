import { test, expect } from '@playwright/test';
import { woodworkingProjects, featuredWoodworking } from '../../src/artfuldata/content/woodworking';

for (const prefix of ['', 'de/']) {
  const language = prefix ? 'de' : 'en';
  test.describe(`${language} woodworking`, () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });
    test.describe.configure({ timeout: 90000 });

    test('creativity shows only woodworking for now', async ({ page }) => {
      await page.goto(`${prefix}creativity/`);
      await expect(page.locator('.page-intro .lead')).toHaveText(prefix ? 'Holzprojekte für mein Zuhause.' : 'Woodworking projects for my home.');
      await expect(page.locator('.collection-panel')).toHaveCount(1);
      await expect(page.locator('#woodworking h2')).toHaveText(prefix ? 'Holzarbeiten' : 'Woodworking');
      await expect(page.locator('#garden, #repurpose')).toHaveCount(0);
      await expect(page.locator('.woodworking-card')).toHaveCount(3);
      await page.locator('#woodworking .section-heading > a').click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(prefix ? 'Holzarbeiten' : 'Woodworking');
      await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
    });

    test('selected covers open their matching curated galleries', async ({ page }) => {
      const covers = ['20240521_133300.jpg', '2024-11-28 17.18.15.jpg', '2023-09-28 09.08.28.jpg'];
      for (const [index, project] of featuredWoodworking.entries()) {
        expect(project.photos[0].original).toBe(covers[index]);
        await page.goto(prefix);
        const card = page.locator('#creativity .woodworking-card').nth(index);
        await expect(card.locator('h3')).toHaveText(project.title[language]);
        await card.click();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title[language]);
        await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
        await expect(page.locator('[data-wood-photo]')).toHaveCount(project.photos.length);
        await expect(page.locator('.language-switch a').nth(prefix ? 0 : 1)).toHaveAttribute('href', new RegExp(`/${prefix ? '' : 'de/'}woodworking/${project.slug}/$`));
      }
    });

    test('overview retains every project with only its curated photos', async ({ page }) => {
      await page.goto(prefix);
      await page.locator('#creativity .section-heading a').click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(prefix ? 'Holzarbeiten' : 'Woodworking');
      await expect(page.locator('.woodworking-project')).toHaveCount(24);
      await expect(page.locator('[data-wood-photo]')).toHaveCount(112);
      for (const project of woodworkingProjects) {
        expect(project.photos.length).toBeLessThanOrEqual(6);
        expect(project.photos.length).toBeGreaterThanOrEqual(2);
        const section = page.locator(`#${project.slug}`);
        await expect(section.getByRole('heading')).toHaveText(project.title[language]);
        await expect(section.locator('[data-wood-photo]')).toHaveCount(project.photos.length);
        // Load every selected preview, including those initially below the fold.
        for (const image of await section.locator('img').all()) {
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
        }
      }
      const last = woodworkingProjects.at(-1)!;
      await page.locator('.woodworking-index').getByRole('link', { name: last.title[language], exact: true }).click();
      await expect(page.locator(`#${last.slug} h2`)).toBeInViewport();
      await page.locator(`#${last.slug} h2 a`).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(last.title[language]);
      await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    });

    test('photo viewer supports keyboard, controls, and return focus', async ({ page }) => {
      const project = featuredWoodworking[0];
      await page.goto(`${prefix}woodworking/${project.slug}/`);
      const photo = page.locator('[data-wood-photo]').first();
      await photo.click();
      const dialog = page.locator('.woodworking-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('[data-photo-caption]')).toContainText('1 / 6');
      await expect.poll(() => dialog.locator('img').evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await page.keyboard.press('ArrowRight');
      await expect(dialog.locator('[data-photo-caption]')).toContainText('2 / 6');
      await dialog.locator('[data-photo-previous]').click();
      await expect(dialog.locator('[data-photo-caption]')).toContainText('1 / 6');
      await page.keyboard.press('ArrowLeft');
      await expect(dialog.locator('[data-photo-caption]')).toContainText('6 / 6');
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(photo).toBeFocused();
      await photo.click();
      await dialog.locator('[data-photo-close]').click();
      await expect(dialog).not.toBeVisible();
    });

    test('language switch keeps the project and sitemap includes it', async ({ page, request }) => {
      const project = featuredWoodworking[1];
      await page.goto(`${prefix}woodworking/${project.slug}/`);
      await page.getByRole('link', { name: prefix ? 'English' : 'Deutsch', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title[prefix ? 'en' : 'de']);
      await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
      const sitemap = await (await request.get('sitemap.xml')).text();
      for (const item of woodworkingProjects) expect(sitemap).toContain(`/${prefix}woodworking/${item.slug}/</loc>`);
    });
  });
}
