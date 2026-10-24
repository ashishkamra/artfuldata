import { test, expect } from '@playwright/test';

for (const prefix of ['', 'de/']) {
  test(`supplied book covers and credits (${prefix || 'en'})`, async ({ page }) => {
    await page.goto(`${prefix}books/`);
    for (const [id, filename, credit] of [
      ['book-1', 'originals.webp', 'Amazon'],
      ['book-8', 'irrational.webp', 'MACK'],
      ['book-9', 'visual-display-quantitative-information.webp', 'Edward Tufte'],
      ['book-10', 'envisioning-information.webp', 'Edward Tufte'],
      ['book-11', 'knowledge-is-beautiful.webp', 'Amazon'],
      ['book-12', 'visualize-this.webp', 'FlowingData'],
    ]) {
      const book = page.locator(`#${id}`);
      const image = book.locator('img');
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('src', new RegExp(`/images/books/${filename.replace('.', '\\.')}$`));
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(book.locator('.cover-credit')).toHaveText(credit);
    }
    await expect(page.locator('#book-10 .book-top')).toContainText('10 /');
    await expect(page.locator('.book-grid article').nth(8).locator('h2')).toHaveText('The Visual Display of Quantitative Information');
    await expect(page.locator('.book-grid article').nth(9).locator('h2')).toHaveText('Envisioning Information');
    await expect(page.locator('.book-grid article').nth(10).locator('h2')).toHaveText('Knowledge is Beautiful');
    await expect(page.locator('.book-grid article').nth(11).locator('h2')).toHaveText('Visualize This');
    await page.goto(prefix);
    await expect(page.locator('.mini-books a').first().locator('img')).toHaveAttribute('src', /\/images\/books\/originals\.webp$/);
  });
}
