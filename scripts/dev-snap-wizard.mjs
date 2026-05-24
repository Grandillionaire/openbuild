/**
 * Snap the OnboardingWizard in its two steps + the new ExportModal CTA.
 * Run against a clean storage state so the wizard actually shows up.
 */
import { chromium } from '@playwright/test';

const URL = process.env.URL ?? 'http://localhost:5173/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (err) => errors.push(`PAGE: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1200);

// Wizard step 1: intent
await page.waitForSelector('.ow', { timeout: 5000 }).catch(() => console.log('NO_WIZARD'));
await page.screenshot({ path: '/tmp/ob-wizard-1.png', fullPage: false });

// Pick "Online store" + go to step 2
await page.locator('.ow-card:has-text("Online store")').click().catch(() => {});
await page.waitForTimeout(200);
await page.locator('.ow-btn-primary:has-text("Next")').click().catch(() => {});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/ob-wizard-2.png', fullPage: false });

// Pick the first template + use it
await page.locator('.ow-template').first().click().catch(() => {});
await page.waitForTimeout(200);
await page.locator('.ow-btn-primary:has-text("Use this template")').click().catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/ob-after-wizard.png', fullPage: false });

// Open Export modal
await page.locator('button:has-text("Export")').first().click().catch(() => {});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/ob-export-cta.png', fullPage: false });

console.log('SNAP_DONE');
console.log('ERRORS:', errors.length);
errors.forEach((e) => console.log('  ' + e));

await browser.close();
