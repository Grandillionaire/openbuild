import { test, expect } from '@playwright/test';

/**
 * E2E Test: Create New Page, Add Component, and Save
 * 
 * This test verifies the core user journey of:
 * 1. Opening the application
 * 2. Creating a new page
 * 3. Adding a component to the canvas
 * 4. Saving the project
 */

test.describe('Create Page Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to fully load
    await page.waitForSelector('.app-header', { timeout: 10000 });
  });

  test('should load the application', async ({ page }) => {
    // Verify main elements are present
    await expect(page.locator('.logo')).toContainText('OpenBuild');
    await expect(page.locator('.sidebar-left')).toBeVisible();
    await expect(page.locator('.main-content')).toBeVisible();
    await expect(page.locator('.sidebar-right')).toBeVisible();
  });

  test('should add a component to canvas via drag and drop', async ({ page }) => {
    // Find a component in the library
    const componentLibrary = page.locator('.sidebar-left');
    await expect(componentLibrary).toBeVisible();

    // Look for Section component in the library
    const sectionComponent = componentLibrary.locator('[data-component-type="section"]').first();
    
    // If drag-drop is available, test it
    // Otherwise, test clicking to add
    if (await sectionComponent.isVisible()) {
      // Get the canvas area
      const canvas = page.locator('.canvas-area, .main-content canvas, [data-testid="canvas"]').first();
      
      // Perform drag and drop
      await sectionComponent.dragTo(canvas);
      
      // Verify component was added
      await expect(page.locator('[data-component-id]')).toBeVisible({ timeout: 5000 });
    } else {
      // Alternative: Click on component category and add button
      const addButton = componentLibrary.locator('button').filter({ hasText: /add|section/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
        // Wait for component to appear
        await page.waitForTimeout(500);
      }
    }
  });

  test('should update project name', async ({ page }) => {
    // Find the project name input
    const projectNameInput = page.locator('.project-name input');
    await expect(projectNameInput).toBeVisible();

    // Clear and type new name
    await projectNameInput.click();
    await projectNameInput.fill('');
    await projectNameInput.fill('My Test Project');
    await projectNameInput.blur();

    // Verify the name was updated
    await expect(projectNameInput).toHaveValue('My Test Project');
  });

  test('should save project successfully', async ({ page }) => {
    // Update project name first
    const projectNameInput = page.locator('.project-name input');
    await projectNameInput.fill('Test Project Save');
    await projectNameInput.blur();

    // Find and click save button
    const saveButton = page.locator('button').filter({ hasText: 'Save' });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify save success notification appears
    const toast = page.locator('.toast-container, [role="alert"]').first();
    await expect(toast).toContainText(/saved|success/i, { timeout: 5000 });
  });

  test('should toggle code view', async ({ page }) => {
    // Find code view toggle button
    const codeButton = page.locator('button[title*="Code"], button[title*="code"]').first();
    
    if (await codeButton.isVisible()) {
      await codeButton.click();
      
      // Verify code view modal appears
      await expect(page.locator('.code-viewer, [data-testid="code-viewer"]')).toBeVisible({ timeout: 5000 });
      
      // Close the code view
      await codeButton.click();
    }
  });

  test('should toggle preview', async ({ page, context }) => {
    // Listen for new page (popup)
    const pagePromise = context.waitForEvent('page');
    
    // Find and click preview button
    const previewButton = page.locator('button[title*="Preview"], button[title*="preview"]').first();
    
    if (await previewButton.isVisible()) {
      await previewButton.click();
      
      // Wait for preview window
      const newPage = await pagePromise;
      await newPage.waitForLoadState();
      
      // Verify preview page opened
      expect(newPage.url()).not.toBe('about:blank');
      
      // Close preview
      await newPage.close();
    }
  });

  test('should undo/redo actions', async ({ page }) => {
    // Find undo button
    const undoButton = page.locator('button[title*="Undo"]');
    const redoButton = page.locator('button[title*="Redo"]');

    // Initially undo should be disabled (no history)
    await expect(undoButton).toBeDisabled();

    // Make a change - update project name
    const projectNameInput = page.locator('.project-name input');
    await projectNameInput.fill('Undo Test');
    await projectNameInput.blur();

    // Undo should now be enabled
    await expect(undoButton).not.toBeDisabled();

    // Click undo
    await undoButton.click();

    // Redo should now be enabled
    await expect(redoButton).not.toBeDisabled();
  });
});
