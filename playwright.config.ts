import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: {
    timeout: 8_000
  },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? undefined : 'chrome'),
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175/login',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
