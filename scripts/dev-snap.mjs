import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  storageState: {
    cookies: [],
    origins: [{
      origin: process.env.URL ?? 'http://localhost:5174',
      localStorage: [
        { name: 'welcomeGuideShown', value: 'true' },
        { name: 'tutorial_preferences', value: JSON.stringify({ autoStart: false, neverShowAgain: true, lastSelectedCategory: 'all' }) },
        { name: 'tutorial_progress', value: JSON.stringify({ completedTutorials: ['interface-overview'], progress: [] }) },
      ],
    }],
  },
});
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (err) => errors.push(`PAGE: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});

await page.goto(process.env.URL ?? 'http://localhost:5174/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1200);

// Defensive: dismiss any modal still up
for (const sel of ['.tutorial-launcher button[aria-label="Close"]', 'button[aria-label="Close"]', '.welcome-guide button[aria-label="Close"]']) {
  const el = page.locator(sel).first();
  if (await el.isVisible().catch(() => false)) {
    await el.click().catch(() => {});
    await page.waitForTimeout(200);
  }
}

await page.screenshot({ path: '/tmp/ob-editor.png', fullPage: false });

// Open the commerce modal via the header Store button
await page.locator('.header-btn-store').click({ timeout: 5000 }).catch((e) => console.log('STORE_BTN_ERR', e.message));
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/ob-commerce.png', fullPage: false });

// Seed demo products via the visible button
const seed = page.locator('button:has-text("Add demo products")').first();
if (await seed.isVisible().catch(() => false)) {
  await seed.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ob-products-seeded.png', fullPage: false });
}

// Variants tab — edit first product
const editBtn = page.locator('table.pm-table button:has-text("Edit")').first();
if (await editBtn.isVisible().catch(() => false)) {
  await editBtn.click();
  await page.waitForTimeout(300);
  await page.locator('button.pm-tab:has-text("Variants")').click().catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/ob-variants.png', fullPage: false });
}

// Orders tab
await page.locator('button.cm-tab:has-text("Orders")').click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ob-orders.png', fullPage: false });

// Integrations tab
await page.locator('button.cm-tab:has-text("Integrations")').click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ob-integrations.png', fullPage: false });

// Close + count library categories
await page.locator('button.cm-close').click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
const categoryHeaders = await page.locator('.category-header span').allTextContents();
const componentCount = await page.locator('.component-item').count();

console.log('SNAP_DONE');
console.log('ERRORS:', errors.length);
errors.forEach((e) => console.log('  ' + e));
console.log('CATEGORIES:', JSON.stringify(categoryHeaders.filter((c) => c.trim() && !/^\d+$/.test(c.trim()))));
console.log('COMPONENT_COUNT:', componentCount);

await browser.close();
