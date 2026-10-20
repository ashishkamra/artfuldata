import { test, expect } from '@playwright/test';

for (const prefix of ['', 'de/']) {
  test(`project grouping and visualization chronology (${prefix || 'en'})`, async ({ page }) => {
    await page.goto(prefix);
    const titles = await page.locator('.viz-tiles h3').allTextContents();
    expect(await page.locator('.viz-tiles > a').evaluateAll(links => links.map(link => new URL((link as HTMLAnchorElement).href).hash))).toEqual([
      '#diet-diary', '#project-2', '#project-1', '#project-3',
    ]);
    await expect(page.locator('#research a[href$="analytics/#notebooks"]')).toHaveCount(1);
    await expect(page.locator('#research a[href$="analytics/#diet-diary"]')).toHaveCount(1);

    await page.goto(`${prefix}visualisation/`);
    await expect(page.locator('#main h2')).toHaveText(titles);
    await expect(page.locator('#diet-diary img')).toHaveCount(4);
    await expect(page.locator('a[href*="kaggle.com/code/lisamlh/"]')).toHaveCount(1);
    await expect(page.locator('a[href*="cyclistic"]')).toHaveCount(0);

    await page.goto(`${prefix}analytics/`);
    await expect(page.locator('#notebooks a[href*="cyclistic"]')).toHaveCount(2);
    await expect(page.locator('#diet-diary img')).toHaveCount(4);
    await expect(page.locator('#diet-diary a')).toHaveAttribute('href', 'https://www.kaggle.com/code/lisamlh/diet-diary-tracking-protein-other-macros');
  });
}
