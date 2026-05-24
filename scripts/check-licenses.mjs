#!/usr/bin/env node
/**
 * Fails the build if any production dependency uses a disallowed license.
 * Uses `npm ls --json` for the resolved tree.
 */
import { execSync } from 'node:child_process';

const ALLOWED = new Set([
  'MIT',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  '0BSD',
  'Apache-2.0',
  'CC0-1.0',
  'CC-BY-4.0',
  'Unlicense',
  'BlueOak-1.0.0',
  'Python-2.0',
]);

const DISALLOWED = new Set(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-3.0']);

function flatten(node, out = new Map()) {
  if (!node) return out;
  if (node.name && node.version && !out.has(`${node.name}@${node.version}`)) {
    out.set(`${node.name}@${node.version}`, node.license || node._license || 'UNKNOWN');
  }
  for (const dep of Object.values(node.dependencies ?? {})) flatten(dep, out);
  return out;
}

let tree;
try {
  const raw = execSync('npm ls --all --json --omit=dev', { stdio: ['ignore', 'pipe', 'pipe'] });
  tree = JSON.parse(raw.toString());
} catch (e) {
  // `npm ls` exits non-zero on warnings — still emits JSON on stdout
  tree = JSON.parse(e.stdout?.toString() || '{}');
}

const all = flatten(tree);
const violations = [];

function isAllowed(license) {
  if (typeof license !== 'string') return false;
  // SPDX expression like "(MIT OR Apache-2.0)"
  const stripped = license.replace(/[()]/g, '');
  const parts = stripped.split(/\s+OR\s+|\s+AND\s+/i).map((p) => p.trim());
  if (parts.some((p) => DISALLOWED.has(p))) return false;
  return parts.some((p) => ALLOWED.has(p));
}

for (const [pkg, license] of all) {
  if (!isAllowed(license)) {
    violations.push(`${pkg} — ${license}`);
  }
}

if (violations.length) {
  console.error('License policy violations:');
  for (const v of violations) console.error(`  - ${v}`);
  console.error(`\nAllowed: ${[...ALLOWED].join(', ')}`);
  console.error(`Update scripts/check-licenses.mjs to widen the allow-list if needed.`);
  process.exit(1);
}

console.info(`License check passed (${all.size} packages).`);
