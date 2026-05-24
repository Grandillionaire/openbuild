# OpenBuild architecture

A deep-dive for contributors and integrators. If you just want to use OpenBuild, the [README](../README.md) is the right starting point.

## Goals

1. **Single source of truth for components.** A new component type is defined once, in `src/config/`, and the same definition powers the editor preview, the property panel, the canvas drag-drop, and the exported HTML/CSS.
2. **Framework-free output.** What you build in OpenBuild ships as plain HTML, CSS and (optionally) ~10 KB of vanilla JS. No Vue runtime, no React hydration, no megabyte of webpack.
3. **Composable, not configurable.** Every component, exporter, integration and even the telemetry sink registers through a tiny plugin API. Third parties can extend OpenBuild without forking.
4. **Quality enforced by CI, not by reviewer goodwill.** Strict TypeScript, ESLint with `--max-warnings=0`, bundle budgets, license policy and security audit all gate merges.

## High-level shape

```
┌──────────────────────────────────────────────────────────────┐
│                          Editor SPA                          │
│                                                              │
│   ┌─────────┐    ┌────────────┐    ┌──────────────────┐      │
│   │ Stores  │◄──►│ Canvas /   │◄──►│ Component        │      │
│   │ (Pinia) │    │ Renderer   │    │ Definitions      │      │
│   └────┬────┘    └────────────┘    └─────────┬────────┘      │
│        │                                     │               │
│        ▼                                     ▼               │
│   ┌─────────────────┐         ┌──────────────────────────┐   │
│   │ Services        │         │ Plugin registry          │   │
│   │ (pure logic)    │         │ (components / exporters) │   │
│   └────┬────────────┘         └──────────────────────────┘   │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────────────────────────────────────────────────┐   │
│   │  codeGenerator → exportManager → ZIP / static site   │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Module map

| Path | Responsibility |
|------|----------------|
| `src/types/` | Pure type declarations. No runtime code. |
| `src/config/components.ts` | Merged registry of all `ComponentDefinition`s. |
| `src/config/contentComponents.ts` | Content/media/blocks (gallery, FAQ, pricing…). |
| `src/config/commerceComponents.ts` | Commerce blocks (product, productGrid, cart…). |
| `src/config/formComponents.ts` | Inputs, selects, submit buttons. |
| `src/stores/editor.ts` | Components on the current page, selection, drag state, undo history. |
| `src/stores/pages.ts` | Multi-page site model + navigation. |
| `src/stores/theme.ts` | Theme tokens and CSS custom properties. |
| `src/stores/commerce.ts` | Catalog, cart, settings, persisted. |
| `src/services/codeGenerator.ts` | Walks the component tree and emits HTML/CSS/JS. |
| `src/services/exportManager.ts` | Wraps codegen in a ZIP. Handles multi-page + sitemap. |
| `src/services/commerceService.ts` | Pure cart math, formatting, checkout adapters. |
| `src/services/commerceRuntime.ts` | The ~10 KB runtime embedded into exported sites. |
| `src/services/aiComponentService.ts` | Natural-language → component spec. |
| `src/lib/plugins.ts` | Plugin registry. |
| `src/lib/telemetry.ts` | Error/event reporter interface. No-op by default. |
| `src/components/Canvas/` | The drag-drop canvas and per-component renderer. |
| `src/components/Editor/` | Property editor, library, code viewer, etc. |
| `src/components/Commerce/` | Admin UI for products and store settings. |
| `e2e/` | Playwright tests. |
| `scripts/` | CI scripts (bundle budget, license audit). |

## Component definitions

`ComponentDefinition` is the unit of extensibility. It declares everything OpenBuild needs to know to render a component in the editor, generate code, and let users customize it.

```ts
export interface ComponentDefinition {
  type: ComponentType;
  displayName: string;
  category: 'layout' | 'content' | 'media' | 'blocks' | 'form';
  icon: string;
  defaultProps: ComponentProps;
  defaultStyles: ResponsiveStyles;
  acceptsChildren?: boolean;
  variants?: ComponentVariant[];
  supportsTheme?: boolean;
  generateHTML: (component: Component) => string;
  generateCSS: (component: Component) => string;
}
```

The Canvas renderer (`src/components/Canvas/ComponentRenderer.vue`) has a small set of hand-written editor templates for the original components (heading, button, image, hero, etc.). For every other component type — including all 17 newer ones — it falls back to calling `definition.generateHTML(component)` and rendering the result. **The preview is byte-equal to what users will ship.** This is the single most important invariant in the codebase.

## State model

Pinia stores are intentionally small and topical:

- `editorStore` holds the working components, selection and history. It does **not** know about pages — it's a flat editor on a `Component[]`.
- `pagesStore` owns the multi-page model and writes its `components` back to the editor store when the current page changes.
- `themeStore` exposes CSS variables that the codegen injects when `includeTheme` is true.
- `commerceStore` owns the catalog and cart, persisted to localStorage under `openbuild.commerce.v1`.

Undo/redo is implemented as a command pattern inside `editorStore` — every mutating action calls `saveHistory()` first, so undo is just "swap the previous snapshot back in." History caps at 50 states.

## Code generation pipeline

```
components: Component[]
        │
        ▼
generateHTML(c) ─┐
                 │   per component, recursively
generateCSS(c)  ─┘
        │
        ▼
Prettier (HTML + CSS)
        │
        ▼
inject:  • theme variables (if enabled)
         • commerce runtime (if enabled)
         • SEO meta tags
         • global custom CSS / JS
        │
        ▼
Handlebars page template
        │
        ▼
fullPage string
```

The runtime is intentionally framework-free. The exporter walks the page tree once and emits HTML; CSS is namespaced by component id (`.c-<id>`) so styles never leak between components.

## Commerce engine

Commerce is split across four files:

1. **`types/commerce.ts`** — the domain model. Money is always stored as an integer in the smallest currency unit. Cart line items capture the price at add-to-cart time so mid-cart price changes don't surprise customers.
2. **`stores/commerce.ts`** — Pinia store + localStorage persistence.
3. **`services/commerceService.ts`** — pure functions for cart math, formatting, totals and checkout. No DOM, no Vue, no network except inside checkout adapters. Same code runs in the editor, in the exported site, and in unit tests.
4. **`services/commerceRuntime.ts`** — generates a self-contained script that exported sites include. It hydrates `[data-ob-product]` and `[data-ob-product-grid]` blocks from a baked-in catalog snapshot, manages a localStorage cart, opens a slide-out cart drawer, and routes checkout via Stripe Payment Links, Checkout Sessions or a custom webhook.

The runtime exposes `window.OpenBuildCommerce` so power users can wire custom code:

```js
OpenBuildCommerce.addToCart('prod_123', { quantity: 2 });
OpenBuildCommerce.openCart();
OpenBuildCommerce.checkout();
```

## Plugin system

`registerPlugin()` accepts a plugin object that can contribute:

- **Components** — new `ComponentDefinition`s merged into the registry
- **Exporters** — new output formats beyond ZIP (e.g. Next.js project, Astro project)
- **Integrations** — third-party services with declared config schemas (analytics, CRM, email)

Built-ins use the same API as third-party plugins; there are no privileged code paths.

## Telemetry

`src/lib/telemetry.ts` defines a tiny `TelemetryReporter` interface. The default reporter is a no-op (logs only in dev). Drop in Sentry/Bugsnag/Datadog by calling `setTelemetryReporter()` once at app startup.

```ts
import * as Sentry from '@sentry/browser';
import { setTelemetryReporter } from '@/lib/telemetry';

Sentry.init({ dsn: '…' });
setTelemetryReporter({
  captureException: (err, ctx) => Sentry.captureException(err, { extra: ctx?.extra, tags: ctx?.tags }),
  captureMessage: (msg, sev) => Sentry.captureMessage(msg, sev as Sentry.SeverityLevel),
});
```

OpenBuild itself ships with **zero user-content** in any telemetry payload — only error stacks, scopes and tags.

## Testing

- **Unit tests** (`src/__tests__/**`) run with Vitest + happy-dom. Pure modules like `commerceService` get pedantic coverage of edge cases (overflow, mixed currencies, expired codes, zero-decimal currencies).
- **E2E tests** (`e2e/tests/`) run with Playwright against the dev server, covering create-page / use-template / export-page flows.

## CI gates

`.github/workflows/ci.yml` runs four jobs:

1. **quality** — Node 20.x + 22.x matrix; runs lint, typecheck, tests with coverage
2. **build** — production build, then `scripts/check-bundle-budget.mjs` enforces:
   - Initial route ≤ 250 KB gzipped
   - Any single asset ≤ 350 KB gzipped
   - Total JS+CSS ≤ 1500 KB gzipped
3. **e2e** — Playwright on Chromium
4. **security** — `npm audit --audit-level=high` + `scripts/check-licenses.mjs` (allow-list of permissive licenses; fails on GPL family)

There is **no `|| true`** anywhere in the CI. If something breaks, the build is red.

## Adding a new component (recipe)

1. Add the new type to the `ComponentType` union in `src/types/component.ts`
2. Add a `ComponentDefinition` in `src/config/contentComponents.ts` (or a new file for a new domain)
3. Re-export it in the `Partial<Record<…>>` at the bottom of that file
4. Register it in `src/components/Editor/ComponentLibrary.vue` under the right category
5. (Optional) Add an editor template in `src/components/Canvas/ComponentRenderer.vue` if you want richer interactive behavior than the generated HTML preview gives
6. Write a unit test in `src/__tests__/`

That's it. The renderer, exporter, undo system, layers panel and code viewer all pick up the new component automatically.

## Adding a new exporter (recipe)

```ts
import { registerPlugin } from '@/lib/plugins';

registerPlugin({
  id: 'my-org.astro-exporter',
  name: 'Astro exporter',
  version: '1.0.0',
  exporters: [{
    id: 'astro',
    name: 'Astro project',
    description: 'Export as an Astro 4 project',
    extension: 'zip',
    async export(payload) {
      // Compose Astro src/pages/index.astro from payload.fullPageHTML, return a Blob
    },
  }],
});
```

The Export modal picks up registered exporters automatically.
