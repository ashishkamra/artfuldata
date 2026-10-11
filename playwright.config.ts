import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/site',
  use: { baseURL: process.env.PORTFOLIO_TEST_URL ?? 'http://localhost:4321/artfuldata/', channel: 'chromium' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: process.env.PORTFOLIO_TEST_URL ? undefined : {
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: 'http://localhost:4321/artfuldata/',
    reuseExistingServer: !process.env.CI,
  },
});
