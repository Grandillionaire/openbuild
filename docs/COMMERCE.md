# Commerce guide

OpenBuild ships a complete commerce engine — no monthly fee, no transaction cut, no lock-in. Connect it to your own Stripe account in 30 seconds and start selling.

## Three checkout modes

| Mode | Backend needed? | Multi-item cart? | Best for |
|------|:---:|:---:|------|
| **Stripe Payment Links** | No | No (single product) | Solo sellers, single-product sites, digital downloads |
| **Stripe Checkout Sessions** | Yes (any function) | Yes | Real stores with carts |
| **Custom webhook** | Yes | Yes | Non-Stripe processors, custom flows |
| **Mock** | No | — | Demoing the editor |

You can switch modes at any time in **Store Settings**. Existing components don't change.

## Mode 1: Stripe Payment Links (zero backend)

The fastest path. Works for digital goods, single-product checkouts, donations, anything with one SKU.

### Setup

1. In Stripe, create a Payment Link per product (Dashboard → Payment Links → New). Stripe gives you a `https://buy.stripe.com/…` URL.
2. In OpenBuild → **Store** → click your product → paste the URL in **Stripe Payment Link**.
3. In **Store Settings**, set checkout mode to **Stripe Payment Links**.
4. Add a **Product Card** or **Add to Cart Button** to your page. Done.

When a customer clicks Checkout, OpenBuild redirects to the Payment Link with `?quantity=<n>` and (optionally) `?prefilled_email=…` appended. Stripe handles everything from there — card capture, 3D Secure, receipt, tax, refunds.

### What you don't have to do

- Spin up a backend
- Store card numbers
- Get PCI compliant
- Build a webhook receiver
- Handle currency conversion

### Limits

- One product per checkout. For carts, see Mode 2.

## Mode 2: Stripe Checkout Sessions (real carts)

Works for any number of line items. Needs a small backend endpoint to create a Checkout Session, because Stripe deprecated client-only session creation in 2023 for security reasons.

### Setup

1. In **Store Settings**, set checkout mode to **Stripe Checkout Sessions** and paste your endpoint URL (e.g. `https://api.yourstore.com/checkout`).
2. Add components freely (Product Grid, Cart Icon, Checkout Button) — they all work as expected.

### Endpoint contract

Your endpoint receives:

```jsonc
POST /checkout
Content-Type: application/json

{
  "items": [
    { "productId": "abc123", "variantId": "v1", "quantity": 2 }
  ],
  "successUrl": "https://yoursite.com/?ob_checkout=success",
  "cancelUrl":  "https://yoursite.com/",
  "currency":   "USD"
}
```

And must respond:

```jsonc
{ "url": "https://checkout.stripe.com/c/pay/cs_..." }
```

### Minimal Vercel/Netlify function (40 lines)

```js
// api/checkout.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map your product IDs to Stripe Price IDs once.
const PRICE_MAP = {
  'abc123': { default: 'price_1Abc...', 'v1': 'price_1Xyz...' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { items, successUrl, cancelUrl } = req.body;

  const line_items = items.map((i) => {
    const priceMap = PRICE_MAP[i.productId];
    const price = priceMap?.[i.variantId] ?? priceMap?.default;
    if (!price) throw new Error(`No Stripe price for ${i.productId}/${i.variantId}`);
    return { price, quantity: i.quantity };
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    automatic_tax: { enabled: true },
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR'] },
  });

  res.status(200).json({ url: session.url });
}
```

That's all. Deploy to Vercel/Netlify/Cloudflare Workers/Deno Deploy/anywhere.

## Mode 3: Custom webhook

If you're not using Stripe — say you're on Paddle, Lemon Squeezy, Square, Mollie — set mode to **Custom webhook** and OpenBuild will POST the full cart payload to your endpoint. Reply with `{ "redirectUrl": "…" }` (or with no body to handle the response in-page).

## Components

| Component | What it does |
|---|---|
| **Product Card** | Single product with image, name, price, optional Add-to-Cart button |
| **Product Grid** | Auto-populated grid pulled from your catalog. Filter by `all` / `category` / `tag` / explicit IDs |
| **Price Tag** | Live product price (hydrated by the runtime). Useful inside hero sections |
| **Add to Cart Button** | Standalone button targeting a specific product |
| **Cart Icon** | Header cart icon with live item count |
| **Checkout Button** | Opens the cart drawer (when items exist) or triggers checkout |

All of them are drag-droppable in the editor and render identically in the exported site.

## Product model

Each product has:

- **Identity:** `id`, `slug`, `name`, `description`, `status` (draft/active/archived)
- **Pricing:** `price` and optional `compareAtPrice` (Money: integer in smallest unit + currency code)
- **Media:** array of images with primary flag
- **Variants:** size/color/etc. with their own SKU, price, inventory and Stripe Price ID
- **Inventory:** integer (tracked) or `null` (untracked — always in stock)
- **Categorization:** tags, category ID
- **Shipping:** `weight`, `shipsTo` (country list, empty = anywhere)
- **Tax:** `taxable` flag
- **Digital:** `digitalDelivery` flag to skip shipping
- **Stripe:** `stripeProductId`, `stripePaymentLinkUrl`

## Cart behavior

- Cart is persisted to `localStorage` under `openbuild_cart_v1`.
- Price is **captured at add-to-cart time** — if you raise prices mid-session, the customer pays what they saw.
- Quantity changes / removals work via `+` / `−` / `Remove` controls in the cart drawer.
- Successful checkout (URL contains `?ob_checkout=success`) auto-clears the cart and shows a thank-you toast.

## Currencies

OpenBuild supports 25 ISO-4217 currencies out of the box, including JPY (zero-decimal) — handled correctly in math, formatting and Stripe payloads. The Money type is `{ amount: number, currency: CurrencyCode }` where `amount` is always the **smallest currency unit** (cents for USD/EUR, yen for JPY).

```ts
import { money, formatMoney } from '@/services/commerceService';

formatMoney(money(1234, 'USD'));   // → "$12.34"
formatMoney(money(1500, 'JPY'));   // → "¥1,500"  (no decimals)
formatMoney(money(1234, 'EUR'), 'de-DE');  // → "12,34 €"  (locale-aware)
```

## Taxes & shipping

OpenBuild's bundled tax/shipping math is intentionally minimal — it's enough for displayed totals and "from $X" estimates, but it's not a tax compliance tool. For real tax compliance, let Stripe handle it (`automatic_tax: { enabled: true }` in your Checkout Session) and disable client-side tax rules.

## Inventory

Set `inventory` to an integer to track stock, or `null` for unlimited. The cart drawer and `addToCart` honor variant inventory separately. Inventory does **not** decrement automatically on checkout — that's your backend's job, since checkout may fail. Listen for Stripe's `checkout.session.completed` webhook and update your catalog.

## What OpenBuild does NOT do (yet)

- **Order management** — once Stripe redirects, your order lives in Stripe's dashboard. We do not host a /admin/orders page (yet).
- **Customer accounts** — guest-only by default. For login + order history, integrate Auth.js / Clerk and pass the email at checkout.
- **Multi-currency display switcher** — you pick one default currency. PRs welcome.
- **Subscriptions** — set up the Stripe Payment Link as a recurring price; it works, but our UI calls everything "price" not "interval."

## Security

- The exported runtime is dependency-free and contains no eval/Function/new Function.
- Only your **publishable** key (pk_…) is ever embedded — secret keys never touch client code.
- All URLs from product data run through `sanitizeUrl()` before injection.
- The cart drawer renders product names via `textContent`, never `innerHTML`.

## Testing

The commerce math has 25+ pedantic unit tests in `src/__tests__/services/commerceService.test.ts`. Run them with:

```bash
npm run test -- --run commerceService
```

If you add commerce logic, add a test.
