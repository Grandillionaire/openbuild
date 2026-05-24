#!/usr/bin/env node
/**
 * Fails the build if the production bundle exceeds budget.
 * Budget is per-asset (gzipped) and total — tweak in BUDGET below.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;

const BUDGET = {
  // Max gzipped size for the initial route (entry + critical chunks)
  initialGzipKB: 275,
  // Max gzipped size for any single asset
  perAssetGzipKB: 350,
  // Max total gzipped JS+CSS across the whole app
  totalGzipKB: 1500,
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const files = walk(DIST).filter((f) => /\.(js|css)$/.test(f));
let totalGz = 0;
let largestAsset = 0;
let largestName = '';
const initialPattern = /js\/(index|main|app)-/;
let initialGz = 0;

for (const f of files) {
  const raw = readFileSync(f);
  const gz = gzipSync(raw, { level: 9 }).length;
  totalGz += gz;
  if (gz > largestAsset) {
    largestAsset = gz;
    largestName = relative(DIST, f);
  }
  if (initialPattern.test(relative(DIST, f))) initialGz += gz;
}

const totalKB = totalGz / 1024;
const initialKB = initialGz / 1024;
const largestKB = largestAsset / 1024;

console.info(`Bundle budget check`);
console.info(`  Initial (entry):   ${initialKB.toFixed(1)} KB gzipped  (budget: ${BUDGET.initialGzipKB} KB)`);
console.info(`  Largest asset:     ${largestKB.toFixed(1)} KB gzipped — ${largestName}  (budget: ${BUDGET.perAssetGzipKB} KB)`);
console.info(`  Total JS+CSS:      ${totalKB.toFixed(1)} KB gzipped  (budget: ${BUDGET.totalGzipKB} KB)`);

const failures = [];
if (initialKB > BUDGET.initialGzipKB) failures.push(`Initial bundle ${initialKB.toFixed(1)} KB > ${BUDGET.initialGzipKB} KB`);
if (largestKB > BUDGET.perAssetGzipKB) failures.push(`Asset ${largestName} ${largestKB.toFixed(1)} KB > ${BUDGET.perAssetGzipKB} KB`);
if (totalKB > BUDGET.totalGzipKB) failures.push(`Total ${totalKB.toFixed(1)} KB > ${BUDGET.totalGzipKB} KB`);

if (failures.length) {
  console.error(`\nBundle budget exceeded:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.info(`\nBundle within budget.`);
