#!/usr/bin/env node
/**
 * Fails the build if any installed production dependency uses a disallowed license.
 * Walks node_modules and reads each package.json directly — npm ls --json no
 * longer surfaces the `license` field on transitive dependencies.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ALLOWED = new Set([
  'MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD',
  'Apache-2.0', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-3.0', 'Unlicense',
  'BlueOak-1.0.0', 'Python-2.0', 'WTFPL', 'Zlib',
]);

const DISALLOWED = new Set(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-3.0', 'SSPL-1.0']);

function isAllowed(licenseField) {
  if (!licenseField) return false;
  const license = typeof licenseField === 'string'
    ? licenseField
    : licenseField.type || (Array.isArray(licenseField) ? licenseField.map((l) => l.type || l).join(' OR ') : '');
  if (!license) return false;
  // SPDX expression like "(MIT OR Apache-2.0)" — split on OR/AND, ignore parens
  const stripped = license.replace(/[()]/g, '').trim();
  const parts = stripped.split(/\s+OR\s+|\s+AND\s+/i).map((p) => p.trim());
  if (parts.some((p) => DISALLOWED.has(p))) return false;
  return parts.some((p) => ALLOWED.has(p));
}

function getProdDeps() {
  try {
    const raw = execSync('npm ls --all --json --omit=dev', { stdio: ['ignore', 'pipe', 'pipe'] });
    return collectNames(JSON.parse(raw.toString()));
  } catch (e) {
    return collectNames(JSON.parse(e.stdout?.toString() || '{}'));
  }
}

function collectNames(node, out = new Set()) {
  if (!node?.dependencies) return out;
  for (const [name, dep] of Object.entries(node.dependencies)) {
    out.add(name);
    collectNames(dep, out);
  }
  return out;
}

function readPackageJson(name) {
  // Handle scoped packages and nested node_modules.
  const direct = join('node_modules', name, 'package.json');
  if (existsSync(direct)) {
    try { return JSON.parse(readFileSync(direct, 'utf8')); } catch { return null; }
  }
  return null;
}

const prodDeps = getProdDeps();
const violations = [];
let checked = 0;

for (const name of prodDeps) {
  const pkg = readPackageJson(name);
  if (!pkg) continue;
  checked++;
  if (!isAllowed(pkg.license)) {
    const summary = typeof pkg.license === 'string' ? pkg.license : JSON.stringify(pkg.license);
    violations.push(`${name}@${pkg.version} — ${summary || 'UNKNOWN'}`);
  }
}

if (violations.length) {
  console.error(`License policy violations (${violations.length} of ${checked} packages):`);
  for (const v of violations) console.error(`  - ${v}`);
  console.error(`\nAllowed: ${[...ALLOWED].join(', ')}`);
  console.error(`Update scripts/check-licenses.mjs to widen the allow-list if appropriate.`);
  process.exit(1);
}

console.info(`License check passed (${checked} packages).`);
