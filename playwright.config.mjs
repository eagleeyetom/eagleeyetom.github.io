import { defineConfig } from '@playwright/test';

// Browser tests run against the built site (dist/), served on port 4400.
// Locally they use the installed Chrome; in CI the bundled Chromium (npx playwright install chromium).
export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.mjs',
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4400',
    channel: process.env.CI ? undefined : 'chrome',
    // Scroll-driven and entrance animations are off, so checks never see a half-faded page
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://localhost:4400/pl/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
