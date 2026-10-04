import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/site',
  use: { baseURL: 'http://localhost:4321/artfuldata/', channel: 'chromium' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: 'http://localhost:4321/artfuldata/',
    reuseExistingServer: !process.env.CI,
  },
});
