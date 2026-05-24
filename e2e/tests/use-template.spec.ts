import { test, expect } from '../fixtures';

/**
 * E2E test: opening the template library from the header. We verify the
 * modal renders and at least one template card surfaces — exact template
 * names move around so we don't assert on specific titles.
 */
test.describe('Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-header', { timeout: 10000 });
  });

  test('opens the template library', async ({ page }) => {
    const templatesButton = page
      .locator('.header-btn-templates, button:has-text("Templates")')
      .first();
    await templatesButton.click();
    const modal = page.locator('.template-library, .template-library-modal, [role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('shows at least one template card', async ({ page }) => {
    const templatesButton = page
      .locator('.header-btn-templates, button:has-text("Templates")')
      .first();
    await templatesButton.click();
    await page.waitForTimeout(500);
    const cards = page.locator('.template-card, [data-template-id], .template-thumbnail').first();
    await expect(cards).toBeVisible({ timeout: 5000 });
  });
});
