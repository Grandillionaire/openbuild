# Roadmap

What's shipped, what's next, what we're thinking about.

## Shipped in v2.0

- Built-in commerce engine: product catalog, cart, Stripe checkout (3 modes), 25 currencies, tax & shipping math, discount codes
- 17 new components: divider, video, gallery, embed, accordion, tabs, FAQ (with JSON-LD), testimonials, pricing, newsletter, social links, product, productGrid, addToCart, cartIcon, checkoutButton, priceTag
- Plugin system for components, exporters and integrations
- Telemetry interface (Sentry/Bugsnag/Datadog-compatible)
- Multi-page export with sitemap.xml and robots.txt
- Auto-generated SEO meta + Open Graph + Twitter Card tags
- Bundle budget + license audit in CI
- ESLint flat config; CI gates merges on lint, typecheck, tests, build, bundle, license, security audit
- Telemetry-aware error handlers on Vue, window error and unhandledrejection
- ProductManager and StoreSettings admin UIs

## Up next (v2.1)

- **Real-time collaboration** — multi-cursor editing via Yjs, awareness, offline-first
- **Form submissions endpoint** — managed inbox + email forwarding + spam protection (Cloudflare Turnstile)
- **A11y audit panel** — flags contrast, missing alt, focus traps, ARIA misuse in real time
- **Visual regression on PRs** — screenshot diff via Playwright + Pixelmatch
- **Stripe webhook helper** — opinionated serverless template for `checkout.session.completed` → inventory update + order email

## Backlog (no committed dates)

- **CMS connectors:** Sanity, Contentful, Strapi — fetch products / posts at export time
- **i18n** — site builder for multi-locale sites, with `hreflang` and locale-aware routing in export
- **Color contrast picker** — built into every color input
- **Image optimizer** — on-the-fly resize/AVIF/WebP via Cloudflare Images or local sharp pipeline
- **Theme marketplace** — community-contributed themes via the plugin API
- **Animation timeline 2.0** — Lottie support, scroll-linked sequences, GSAP-style easing inspector
- **Code export presets:** Astro, Eleventy, Next.js (static), Nuxt (static), Hugo, Jekyll
- **Headless mode** — run OpenBuild as a build step in CI (no editor), useful for theming locked-down sites
- **Audit log** — for teams, who-changed-what with rollback
- **Workspace billing** — for hosted SaaS deployments (not OSS scope)

## Won't do

- Lock you into our hosting
- Charge for "Pro" features
- Add telemetry that phones home by default
- Bundle proprietary SDKs into the OSS distribution
- Build a marketplace where we're the gatekeeper

## How to influence the roadmap

1. **Open an issue** with the `proposal` label. Describe the problem before the solution.
2. **Vote with thumbs-up reactions** on existing issues.
3. **Send a PR** — anything in "Backlog" is fair game for a first contribution.
