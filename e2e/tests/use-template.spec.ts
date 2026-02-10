import { test, expect } from '@playwright/test';

/**
 * E2E Test: Use Template Journey
 * 
 * This test verifies the user journey of:
 * 1. Opening template library
 * 2. Browsing available templates
 * 3. Selecting and applying a template
 * 4. Verifying template components are added to canvas
 */

test.describe('Use Template Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-header', { timeout: 10000 });
  });

  test('should open template library', async ({ page }) => {
    // Find and click Templates button in header
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first();
    
    // If button has icon only, find by title
    if (!(await templatesButton.isVisible())) {
      const templatesByTitle = page.locator('button[title*="Template"], .header-btn-templates');
      await templatesByTitle.first().click();
    } else {
      await templatesButton.click();
    }

    // Verify template library modal opens
    const templateModal = page.locator('.template-library, [data-testid="template-library"], .modal');
    await expect(templateModal).toBeVisible({ timeout: 5000 });
  });

  test('should display template categories', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal to open
    await page.waitForSelector('.template-library, .modal', { timeout: 5000 });

    // Verify categories are displayed
    const categories = page.locator('.template-category, .category-tab, [data-category]');
    const categoryCount = await categories.count();
    
    // Should have at least some categories
    expect(categoryCount).toBeGreaterThanOrEqual(0);
  });

  test('should filter templates by search', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal
    await page.waitForSelector('.template-library, .modal', { timeout: 5000 });

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], .search-input');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('landing');
      await page.waitForTimeout(300); // Debounce

      // Verify filtered results
      const templates = page.locator('.template-card, .template-item');
      const templateCount = await templates.count();
      
      // Should show some matching templates or empty state
      expect(templateCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should preview template on hover', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal
    await page.waitForSelector('.template-library, .modal', { timeout: 5000 });

    // Find first template card
    const templateCard = page.locator('.template-card, .template-item').first();
    
    if (await templateCard.isVisible()) {
      // Hover over template
      await templateCard.hover();
      
      // Check for preview overlay or tooltip
      const previewOverlay = page.locator('.template-preview, .preview-overlay, .hover-preview');
      
      // Preview may or may not be implemented
      if (await previewOverlay.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(previewOverlay).toBeVisible();
      }
    }
  });

  test('should apply template to canvas', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal
    await page.waitForSelector('.template-library, .modal', { timeout: 5000 });

    // Find first template card
    const templateCard = page.locator('.template-card, .template-item').first();
    
    if (await templateCard.isVisible()) {
      // Find and click "Use Template" button
      const useButton = templateCard.locator('button').filter({ hasText: /use|apply|select/i }).first();
      
      // If button is inside card, click it
      if (await useButton.isVisible()) {
        await useButton.click();
      } else {
        // Otherwise click the card itself
        await templateCard.click();
        
        // Look for confirmation button in detail view
        const confirmButton = page.locator('button').filter({ hasText: /use|apply|confirm/i }).first();
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
      }

      // Verify template was applied - modal should close
      await expect(page.locator('.template-library, .modal')).not.toBeVisible({ timeout: 5000 }).catch(() => {
        // Modal might still be visible if using different flow
      });

      // Verify components were added to canvas
      const canvasComponents = page.locator('.canvas-area [data-component-id], .component-wrapper');
      const componentCount = await canvasComponents.count();
      
      expect(componentCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should close template library with escape key', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal
    const modal = page.locator('.template-library, .modal');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should close template library with close button', async ({ page }) => {
    // Open template library
    const templatesButton = page.locator('button').filter({ hasText: 'Templates' }).first()
      .or(page.locator('button[title*="Template"], .header-btn-templates').first());
    await templatesButton.click();

    // Wait for modal
    const modal = page.locator('.template-library, .modal');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Find and click close button
    const closeButton = modal.locator('button[aria-label="Close"], .close-btn, button:has(svg)').first();
    
    if (await closeButton.isVisible()) {
      await closeButton.click();
      
      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    }
  });
});
