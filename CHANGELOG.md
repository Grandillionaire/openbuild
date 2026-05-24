# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-05-24

### Added

#### Commerce admin
- ProductManager rewritten with 4 tabs (Details / Images / Variants / SEO),
  search box, status filter, bulk activate/archive/delete
- Variant matrix builder: define attributes, regenerate combinations, per-
  variant SKU / price / inventory editing
- Image gallery: add multiple URLs, up/down reorder, per-image alt
- OrdersManager: status pills, inline status changes, CSV export, search,
  status filter, "Sync from runtime" pulling completed checkouts from
  localStorage into the editor
- CommerceModal: single store admin entry point with Products / Orders /
  Store settings / Integrations tabs, opens from a new Store button in the
  app header

#### Integrations
- src/services/integrations/: AnalyticsProvider + FormProvider contracts,
  one IntegrationsManager admin UI, persisted Pinia store
- Analytics providers: GA4, Plausible, Fathom, Umami (snippets inlined into
  exports automatically when configured)
- Form providers: Formspree, Web3Forms, Netlify Forms, Getform, custom
  webhook — Newsletter and Form components now route through the configured
  provider with a honeypot input and a lightweight AJAX submitter

#### Theme tokens
- src/config/themeTokens.ts: single source of truth for component CSS that
  resolves to var(--color-*) / var(--radius-*) / etc. with sensible fallbacks
- All 17 v2 content + commerce components now consume tokens — re-skin the
  whole site by editing the theme

#### Image optimization
- src/utils/imageOpt.ts: emits <picture> with AVIF + WebP siblings and a
  multi-breakpoint srcset when the source URL is on Unsplash / Cloudinary /
  Imgix / ImageKit. Bare <img loading="lazy" decoding="async"> otherwise
- 7 new unit tests covering host detection, transforms, alt escaping

#### Templates
- 5 polished v2 multi-section templates (SaaS launch, Online store,
  Photographer portfolio, Restaurant, Studio/agency) built on the new
  component library

#### PWA
- public/sw.js rewritten with three caches (shell / assets / commerce),
  stale-while-revalidate for static assets, network-first navigation with
  offline fallback, CLEAR_CACHE message API

### Changed

- TypeScript strict typecheck across the entire tree now passes from a
  clean install (77 errors → 0). The CI typecheck step is now blocking.
- CSSProperties relaxed to `Record<string, any>` with cssString/cssNumber/
  cssUnit helpers for callers that need coercion
- Template type gained `isNew` and `isPopular` optional flags
- E2E suite rewritten against a shared fixture that seeds localStorage so
  the welcome guide + tutorial launcher don't intercept clicks. 7/7 passing
- Bundle budget raised from 250 → 275 KB gz initial route to cover the
  Integrations + CommerceModal + 5 templates additions (current: 250 KB)

### Fixed

- 13 npm audit advisories patched (including a critical Handlebars XSS)
- License-check script now reads each package.json directly instead of
  relying on the removed `npm ls --json` license field, fixing a false
  failure on every recent npm version
- playwright-report/ and test-results/ now in .gitignore

## [2.0.0] — 2026-05-24

### Added

#### Commerce engine
- Full commerce module: catalog, cart, checkout
- 25 ISO-4217 currencies including JPY zero-decimal handling
- Three checkout modes: Stripe Payment Links, Stripe Checkout Sessions, custom webhook
- `commerceService` with pure cart math (subtotal, discounts, shipping, tax, totals)
- `commerceRuntime` — self-contained ~10 KB script embedded into exported sites
- `ProductManager` and `StoreSettings` admin UIs
- Tax rules by country/region; `included-in-price` support
- Shipping zones with free-shipping thresholds
- Discount codes (percentage / fixed, min subtotal, expiry, usage limit)
- Inventory tracking per product and per variant
- Stripe Payment Link wiring per product

#### Components (17 new)
- Layout: `divider`
- Media: `video` (YouTube/Vimeo/file), `gallery`, `embed`
- Blocks: `accordion`, `tabs`, `faq` (with schema.org JSON-LD), `testimonials`, `pricing`, `newsletter`, `socialLinks`
- Commerce: `product`, `productGrid`, `priceTag`, `addToCart`, `cartIcon`, `checkoutButton`

#### Infrastructure
- ESLint 9 flat config with `--max-warnings=0` policy
- Husky + lint-staged pre-commit hooks
- `scripts/check-bundle-budget.mjs` enforces gzipped size limits in CI
- `scripts/check-licenses.mjs` enforces an allow-list of permissive licenses
- CI matrix on Node 20.x and 22.x
- Coverage upload from CI

#### Architecture
- Plugin registry (`src/lib/plugins.ts`) for components, exporters and integrations
- Telemetry interface (`src/lib/telemetry.ts`) with Sentry/Bugsnag-compatible reporter contract
- Wired Vue `errorHandler`, `window.error` and `unhandledrejection` through telemetry

#### Export
- Multi-page export with auto-generated `sitemap.xml` and `robots.txt`
- Auto-injected SEO meta, Open Graph and Twitter Card tags
- Per-page SEO overrides surface in `<head>` of each exported HTML file

#### Documentation
- Rewrote README with credible feature claims, Squarespace comparison, plugin example
- New `docs/ARCHITECTURE.md` — module map, codegen pipeline, recipes for adding components/exporters
- New `docs/COMMERCE.md` — full walkthrough including a 40-line Stripe Checkout Session function
- New `docs/ROADMAP.md` — what's next, what's backlog, what's out of scope
- This `CHANGELOG.md`

### Changed
- License normalized to MIT (was "Other")
- `package.json` now declares `engines`, `keywords`, `repository`, `homepage`, `bugs`
- `vue-tsc` typecheck and ESLint no longer masked with `|| true` in CI
- `lint` script now runs across the whole repo, not just `src/`
- CI `concurrency` group cancels superseded runs
- Bumped to Node 20+ as minimum supported runtime

### Fixed
- Empty `app.config.errorHandler` in `main.ts` now routes through the telemetry interface
- Export failures bubble through `telemetry.captureException` instead of being swallowed

## [1.0.1] — 2026-03-01

- Security patches across dependencies (PR #2)

## [1.0.0] — 2026-02-10

- Initial portfolio-grade refactor (PR #1)
- AI component generator, drag-drop editor, theme system, basic export
