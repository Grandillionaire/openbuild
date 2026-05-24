import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (err) => errors.push(`PAGE: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});

await page.goto(process.env.URL ?? 'http://localhost:5174/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Close the welcome guide if it pops up
const welcomeClose = page.locator('button:has-text("Skip"), button:has-text("Close"), .welcome-close');
if (await welcomeClose.first().isVisible().catch(() => false)) {
  await welcomeClose.first().click();
  await page.waitForTimeout(500);
}

await page.screenshot({ path: '/tmp/ob-1-initial.png', fullPage: false });

// Verify Commerce category appears in the library
const commerceHeader = page.locator('text=/^Commerce$/').first();
const hasCommerce = await commerceHeader.isVisible().catch(() => false);

console.log('SNAP_DONE');
console.log('ERRORS:', errors.length);
errors.forEach((e) => console.log('  ' + e));
console.log('HAS_COMMERCE_CATEGORY:', hasCommerce);

await browser.close();
