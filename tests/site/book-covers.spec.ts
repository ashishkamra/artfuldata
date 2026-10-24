import { test, expect } from '@playwright/test';

for (const prefix of ['', 'de/']) {
  test(`supplied book covers and credits (${prefix || 'en'})`, async ({ page }) => {
    await page.goto(`${prefix}books/`);
    for (const [id, filename, credit] of [['book-1', 'originals.webp', 'Amazon'], ['book-8', 'irrational.webp', 'MACK']]) {
      const book = page.locator(`#${id}`);
      const image = book.locator('img');
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('src', new RegExp(`/images/books/${filename.replace('.', '\\.')}$`));
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(book.locator('.cover-credit')).toHaveText(credit);
    }
    await page.goto(prefix);
    await expect(page.locator('.mini-books a').first().locator('img')).toHaveAttribute('src', /\/images\/books\/originals\.webp$/);
  });
}
