/**
 * Shared Playwright fixtures.
 *
 * The editor pops a welcome guide and (after 2s) a tutorial launcher for
 * first-time visitors, both of which intercept clicks on header buttons and
 * make every test flaky. The fixture seeds the same localStorage keys those
 * widgets write after dismissal, so tests start in the "returning user" state.
 */
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('welcomeGuideShown', 'true');
        localStorage.setItem(
          'tutorial_preferences',
          JSON.stringify({ autoStart: false, neverShowAgain: true, lastSelectedCategory: 'all' }),
        );
        localStorage.setItem(
          'tutorial_progress',
          JSON.stringify({ completedTutorials: ['interface-overview'], progress: [] }),
        );
      } catch {
        /* Some browsers throw on localStorage in opaque origins. */
      }
    });
    void baseURL;
    await use(page);
  },
});

export { expect };
