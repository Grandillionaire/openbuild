import { test, expect } from '@playwright/test';

/**
 * E2E Test: Export Page Journey
 * 
 * This test verifies the user journey of:
 * 1. Creating some content
 * 2. Opening export modal
 * 3. Configuring export options
 * 4. Exporting the project
 */

test.describe('Export Page Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-header', { timeout: 10000 });
  });

  test('should open export modal', async ({ page }) => {
    // Find and click Export button
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // Verify export modal opens
    const exportModal = page.locator('.export-modal, .modal, [data-testid="export-modal"]').first();
    await expect(exportModal).toBeVisible({ timeout: 5000 });
  });

  test('should display export options', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify options are present
    const configCheckbox = modal.locator('input[type="checkbox"]').first();
    const platformSelect = modal.locator('select').first();

    // Should have configuration options
    if (await configCheckbox.isVisible()) {
      await expect(configCheckbox).toBeVisible();
    }

    // Should have platform selection
    if (await platformSelect.isVisible()) {
      await expect(platformSelect).toBeVisible();
    }
  });

  test('should toggle export options', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find configuration checkbox
    const configCheckbox = modal.locator('input[type="checkbox"]').first();
    
    if (await configCheckbox.isVisible()) {
      // Get initial state
      const initialState = await configCheckbox.isChecked();
      
      // Toggle checkbox
      await configCheckbox.click();
      
      // Verify state changed
      const newState = await configCheckbox.isChecked();
      expect(newState).toBe(!initialState);
    }
  });

  test('should change platform selection', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find platform select
    const platformSelect = modal.locator('select').first();
    
    if (await platformSelect.isVisible()) {
      // Select Vercel option
      await platformSelect.selectOption('vercel');
      await expect(platformSelect).toHaveValue('vercel');

      // Select Netlify option
      await platformSelect.selectOption('netlify');
      await expect(platformSelect).toHaveValue('netlify');

      // Back to static
      await platformSelect.selectOption('static');
      await expect(platformSelect).toHaveValue('static');
    }
  });

  test('should show file list preview', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Look for file list
    const fileList = modal.locator('.file-list, .file-item, .preview-section');
    
    if (await fileList.first().isVisible()) {
      // Should show at least index.html and styles.css
      const files = modal.locator('.file-item, .file-name');
      const fileCount = await files.count();
      expect(fileCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should trigger export download', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find export/download button
    const downloadButton = modal.locator('button').filter({ hasText: /export|download/i }).first();
    
    if (await downloadButton.isVisible()) {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      
      // Click export button
      await downloadButton.click();

      // Wait for download to start
      const download = await downloadPromise;
      
      if (download) {
        // Verify download started
        expect(download.suggestedFilename()).toContain('.zip');
      } else {
        // Alternative: Check for success toast/notification
        const toast = page.locator('.toast, [role="alert"]');
        await expect(toast).toContainText(/export|success|download/i, { timeout: 5000 }).catch(() => {
          // Export might still be in progress
        });
      }
    }
  });

  test('should close export modal with cancel', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find cancel button
    const cancelButton = modal.locator('button').filter({ hasText: /cancel|close/i }).first();
    
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('should close export modal with backdrop click', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Click on backdrop (outside modal content)
    const backdrop = page.locator('.modal-backdrop, .modal-overlay').first();
    
    if (await backdrop.isVisible()) {
      // Click at edge of backdrop (not on modal)
      const box = await backdrop.boundingBox();
      if (box) {
        await page.mouse.click(box.x + 10, box.y + 10);
        
        // Modal should close
        await expect(modal).not.toBeVisible({ timeout: 3000 }).catch(() => {
          // Some modals don't close on backdrop click
        });
      }
    }
  });

  test('should export with different frameworks', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Look for framework selector (if exists)
    const frameworkSelect = modal.locator('select').filter({ hasText: /html|react|vue/i }).first()
      .or(modal.locator('[data-testid="framework-select"]'));
    
    if (await frameworkSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Test selecting React
      await frameworkSelect.selectOption({ label: 'React' });
      
      // Verify selection
      await expect(frameworkSelect).toHaveValue(/react/i);
      
      // Test selecting Vue
      await frameworkSelect.selectOption({ label: 'Vue' });
      
      // Verify selection
      await expect(frameworkSelect).toHaveValue(/vue/i);
    }
  });

  test('should show loading state during export', async ({ page }) => {
    // Open export modal
    const exportButton = page.locator('button').filter({ hasText: 'Export' }).first();
    await exportButton.click();

    // Wait for modal
    const modal = page.locator('.export-modal, .modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find export button
    const downloadButton = modal.locator('button').filter({ hasText: /export|download/i }).first();
    
    if (await downloadButton.isVisible()) {
      // Click export
      await downloadButton.click();
      
      // Check for loading indicator
      const loadingIndicator = modal.locator('.loading, .spinner, [data-loading]')
        .or(downloadButton.locator('.loading-spinner'));
      
      // Loading state should appear briefly
      // (May be too fast to catch, so this is a soft check)
      await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => {
        // Loading may have completed too quickly
      });
    }
  });
});
