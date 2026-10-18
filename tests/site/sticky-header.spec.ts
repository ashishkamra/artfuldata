import { test, expect } from '@playwright/test';

for (const prefix of ['', 'de/']) {
  test(`navigation stays pinned while scrolling (${prefix || 'en'})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(prefix);
    await page.evaluate(() => window.scrollTo(0, 1000));
    const header = page.locator('.site-header');
    await expect.poll(() => header.evaluate(element => element.getBoundingClientRect().top)).toBe(0);
    await page.locator('.work-menu summary').click();
    await expect(page.locator('.work-dropdown')).toBeVisible();
    await page.locator('.work-dropdown a').first().click();
    await expect.poll(() => page.locator('#work').evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.site-header')!.getBoundingClientRect().bottom)).toBe(true);
    await page.locator('.primary-nav a[href="#contact"]').click();
    await expect.poll(() => page.locator('#contact h2').evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.site-header')!.getBoundingClientRect().bottom)).toBe(true);
    await expect.poll(() => header.evaluate(element => element.getBoundingClientRect().top)).toBe(0);
  });
}
