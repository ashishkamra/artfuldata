import { test, expect } from '@playwright/test';

// Check the destination and its visible heading, not just that the URL returns 200.
for (const prefix of ['', 'de/']) {
  const german = prefix === 'de/';
  const t = (en: string, de: string) => german ? de : en;
  const categories = [
    ['visualisation', t('Data visualization', 'Datenvisualisierung')],
    ['research', t('Research & experiments', 'Forschung & Experimente')],
    ['creativity', t('Problem solving & creativity', 'Problemlösen & Kreativität')],
    ['community', t('Community & volunteering', 'Engagement & Ehrenamt')],
    ['courses', t('Courses & certificates', 'Kurse & Zertifikate')],
  ];

  test.describe(german ? 'German navigation targets' : 'English navigation targets', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });

    test('homepage work categories scroll to the matching sections', async ({ page, baseURL }) => {
      for (const [id, title] of categories) {
        await page.goto(prefix);
        const link = page.locator(`.work-categories a[href$="#${id}"]`);
        const expected = new URL(`${prefix}#${id}`, baseURL).href;
        await expect(link).toHaveCount(1);
        await link.click();
        await expect(page).toHaveURL(expected);
        const heading = page.locator(`#${id} h2`).first();
        await expect(heading).toHaveAccessibleName(title);
        await expect(heading).toBeInViewport();
      }
    });

    test('the Work menu opens the matching section page', async ({ page, baseURL }) => {
      const pages = [
        ['visualisation/', t('Data Visualization', 'Datenvisualisierung')],
        ['analytics/', t('Data Analysis and Research', 'Datenanalyse und Forschung')],
        ['creativity/', t('Problem solving & creativity', 'Problemlösen & Kreativität')],
        ['community/', t('Community work', 'Engagement')],
        ['courses/', t('Courses & certificates', 'Kurse & Zertifikate')],
      ];
      for (const [path, title] of pages) {
        await page.goto(`${prefix}analytics/ceg/`);
        await page.locator('.work-menu summary').click();
        const link = page.locator(`.work-dropdown a[href$="${path}"]`);
        await expect(link).toHaveCount(1);
        await link.click();
        await expect(page).toHaveURL(new URL(`${prefix}${path}`, baseURL).href);
        const heading = page.locator('#main h1');
        await expect(heading).toHaveAccessibleName(title);
        await expect(heading).toBeInViewport();
      }
    });

    test('homepage tiles and section links reach the named project or section', async ({ page, baseURL }) => {
      const destinations: { selector: string; path: string; title?: string }[] = [
        ...[1, 2, 3].map(index => ({ selector: `.viz-tiles > a:nth-child(${index})`, path: `visualisation/#project-${index}` })),
        { selector: '.research-cards > a:nth-child(1)', path: 'analytics/#town-survey' },
        { selector: '.research-cards > a:nth-child(2)', path: 'analytics/ceg/' },
        { selector: '.research-cards > a:nth-child(3)', path: 'analytics/#aser', title: 'Annual Status of Education Report' },
        { selector: '.research-cards > a:nth-child(4)', path: 'analytics/#akshara' },
        { selector: '.research-cards > a:nth-child(5)', path: 'analytics/#isi', title: t('Evolution of Values', 'Entwicklung von Wertvorstellungen') },
        { selector: '.research-cards > a:nth-child(6)', path: 'analytics/#thesis', title: t('Reporting Child Sexual Abuse in India', 'Meldung von sexuellem Kindesmissbrauch in Indien') },
        { selector: '.research-cards > a:nth-child(7)', path: 'analytics/#report-bee' },
        { selector: '.research-cards > a:nth-child(8)', path: 'analytics/#notebooks' },
        { selector: '.wood-card', path: 'woodworking/' },
        { selector: '.garden-card', path: 'creativity/#garden' },
        { selector: '.repurpose-card', path: 'creativity/#repurpose' },
        ...['civic', 'refugee', 'oxfam'].map((id, index) => ({ selector: `.community-links > a:nth-child(${index + 1})`, path: `community/#${id}` })),
        { selector: '.course-list > a:nth-child(1)', path: 'courses/#google-data-analytics' },
        { selector: '.course-list > a:nth-child(2)', path: 'courses/#research-methodology', title: t('Post-Graduate Certificate in Research Methodology', 'Postgraduales Zertifikat in Forschungsmethodik') },
        ...[1, 2, 3].map(index => ({ selector: `.mini-books > a:nth-child(${index})`, path: `books/#book-${index}` })),
        { selector: '.hero-copy .pill-link', path: '#work', title: t('Work & interests', 'Arbeit & Interessen') },
        { selector: '.hero-copy .text-link', path: 'about/', title: t('About me', 'Über mich') },
        { selector: '#visualisation .section-heading a', path: 'visualisation/', title: t('Data Visualization', 'Datenvisualisierung') },
        { selector: '#research .section-heading a', path: 'analytics/', title: t('Data Analysis and Research', 'Datenanalyse und Forschung') },
        { selector: '#community .text-link', path: 'community/', title: t('Community work', 'Engagement') },
        { selector: '.reading-section .text-link', path: 'books/', title: t('Favourite books', 'Lieblingsbücher') },
      ];
      for (const { selector, path, title } of destinations) {
        await test.step(`${selector} → ${prefix}${path}`, async () => {
          await page.goto(prefix);
          const link = page.locator(selector);
          const expectedTitle = title ?? (await link.locator('h3').textContent())!.trim();
          const expected = new URL(`${prefix}${path}`, baseURL);
          await expect(link).toHaveAttribute('href', path.startsWith('#') ? path : `${expected.pathname}${expected.hash}`);
          await link.click();
          await expect(page).toHaveURL(expected.href);
          const heading = expected.hash ? page.locator(expected.hash).getByRole('heading').first() : page.locator('#main h1');
          await expect(heading).toHaveAccessibleName(expectedTitle);
          await expect(heading).toBeInViewport();
        });
      }
    });

    test('research and case-study section navigation shows each selected section', async ({ page }) => {
      for (const path of ['analytics/', 'analytics/ceg/']) {
        await page.goto(`${prefix}${path}`);
        const links = await page.locator('.section-nav a').evaluateAll(links => links.map(link => link.getAttribute('href')!));
        expect(links).toHaveLength(path === 'analytics/' ? 8 : 7);
        for (const href of links) {
          await page.locator(`.section-nav a[href="${href}"]`).click();
          await expect(page).toHaveURL(new RegExp(`${href}$`));
          const target = page.locator(href);
          await expect(target).toBeInViewport();
          if (await target.getByRole('heading').count()) await expect(target.getByRole('heading').first()).toBeInViewport();
        }
      }
    });
  });
}
