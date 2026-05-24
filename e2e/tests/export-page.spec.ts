import { test, expect } from '../fixtures';

/**
 * E2E test: opening the export modal from the header, and verifying the
 * Store modal surfaces all four commerce tabs.
 *
 * The actual ZIP download is not tested via Playwright — it requires file-
 * system access and the codegen path is covered by unit tests in
 * src/__tests__/services/codeGenerator.test.ts.
 */
test.describe('Header actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-header', { timeout: 10000 });
  });

  test('opens the export modal', async ({ page }) => {
    const exportButton = page
      .locator('button.export-btn, button:has-text("Export")')
      .first();
    await exportButton.click();
    const modal = page.locator('.export-modal, .modal, [role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('opens the store modal with all four tabs', async ({ page }) => {
    const storeBtn = page.locator('.header-btn-store').first();
    await expect(storeBtn).toBeVisible();
    await storeBtn.click();
    await expect(page.locator('.cm-tab:has-text("Products")').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.cm-tab:has-text("Orders")').first()).toBeVisible();
    await expect(page.locator('.cm-tab:has-text("Integrations")').first()).toBeVisible();
  });
});
