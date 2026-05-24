/**
 * Commerce runtime for exported sites.
 *
 * `getCommerceRuntimeScript(catalog, settings)` returns a self-contained JS
 * string that the exporter embeds into the published HTML. The runtime:
 *
 *   - Hydrates `[data-ob-product]` and `[data-ob-product-grid]` blocks from a
 *     baked-in catalog snapshot.
 *   - Manages a localStorage cart.
 *   - Opens a cart drawer when any `[data-ob-cart-toggle]` is clicked.
 *   - Routes checkout via Stripe Payment Links, Checkout Sessions, or a custom
 *     webhook, based on the settings.
 *
 * The script is intentionally framework-free and dependency-free (~10 KB
 * minified) so exported sites stay snappy.
 */

import type { CommerceSettings, Product } from '@/types/commerce';

export function getCommerceRuntimeScript(
  catalog: ReadonlyArray<Product>,
  settings: CommerceSettings,
): string {
  // We serialize the catalog inline so each exported site is fully static.
  const catalogJson = JSON.stringify(catalog);
  const settingsJson = JSON.stringify(settings);

  return `(function(){
  "use strict";
  const CATALOG = ${catalogJson};
  const SETTINGS = ${settingsJson};
  const STORAGE_KEY = "openbuild_cart_v1";

  const productMap = Object.fromEntries(CATALOG.map(function(p){ return [p.id, p]; }));
  const ZERO_DEC = ["JPY"];
  function decimals(c){ return ZERO_DEC.indexOf(c) >= 0 ? 0 : 2; }
  function formatMoney(m){
    if(!m) return "";
    var d = decimals(m.currency);
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: m.currency, minimumFractionDigits: d, maximumFractionDigits: d }).format(m.amount / Math.pow(10, d));
    } catch(e){ return (m.amount / Math.pow(10,d)).toFixed(d) + " " + m.currency; }
  }
  function variantOf(p, vid){ return vid ? (p.variants || []).find(function(v){ return v.id === vid; }) : null; }
  function unitPrice(p, vid){ var v = variantOf(p, vid); return v ? v.price : p.price; }

  function loadCart(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){ return []; }
  }
  function saveCart(cart){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch(e){}
    syncCartUI();
  }
  function cartCount(){
    return loadCart().reduce(function(a,b){ return a + b.quantity; }, 0);
  }
  function cartSubtotal(){
    var items = loadCart();
    if (items.length === 0) return null;
    var total = 0;
    var currency = items[0].capturedPrice.currency;
    items.forEach(function(item){
      total += item.capturedPrice.amount * item.quantity;
    });
    return { amount: total, currency: currency };
  }

  function addToCart(productId, opts){
    opts = opts || {};
    var product = productMap[productId];
    if (!product) return;
    var cart = loadCart();
    var existing = cart.find(function(i){ return i.productId === productId && i.variantId === opts.variantId; });
    if (existing){ existing.quantity += (opts.quantity || 1); }
    else {
      cart.push({
        productId: productId,
        variantId: opts.variantId,
        quantity: opts.quantity || 1,
        capturedPrice: unitPrice(product, opts.variantId)
      });
    }
    saveCart(cart);
    flashAdded();
  }
  function setQuantity(productId, variantId, qty){
    var cart = loadCart();
    if (qty <= 0){
      cart = cart.filter(function(i){ return !(i.productId === productId && i.variantId === variantId); });
    } else {
      var item = cart.find(function(i){ return i.productId === productId && i.variantId === variantId; });
      if (item) item.quantity = qty;
    }
    saveCart(cart);
  }
  function clearCart(){ saveCart([]); }

  /* ---------- Hydration ---------- */

  function hydrateProductCard(el){
    var id = el.getAttribute("data-ob-product");
    var product = productMap[id];
    if (!product) return;
    var primary = (product.images || []).find(function(img){ return img.isPrimary; }) || product.images[0];
    var img = el.querySelector("[data-ob-product-image]");
    if (img && primary){ img.src = primary.url; img.alt = primary.alt || product.name; }
    var name = el.querySelector("[data-ob-product-name]");
    if (name) name.textContent = product.name;
    var price = el.querySelector("[data-ob-product-price]");
    if (price) price.textContent = formatMoney(product.price);
    var compare = el.querySelector("[data-ob-product-compare]");
    if (compare){
      if (product.compareAtPrice){ compare.textContent = formatMoney(product.compareAtPrice); }
      else { compare.remove(); }
    }
    var link = el.querySelector("[data-ob-product-link]");
    if (link) link.href = "/product/" + product.slug;
  }

  function hydrateProductGrid(el){
    var cfg = {};
    try { cfg = JSON.parse(el.getAttribute("data-ob-product-grid") || "{}"); } catch(e){}
    var products = CATALOG.filter(function(p){ return p.status === "active"; });
    if (cfg.source === "category" && cfg.categoryId){
      products = products.filter(function(p){ return p.categoryId === cfg.categoryId; });
    } else if (cfg.source === "tag" && cfg.tag){
      products = products.filter(function(p){ return (p.tags || []).indexOf(cfg.tag) >= 0; });
    } else if (cfg.source === "manual" && cfg.productIds){
      var ids = cfg.productIds;
      products = ids.map(function(id){ return productMap[id]; }).filter(Boolean);
    }
    if (cfg.limit){ products = products.slice(0, cfg.limit); }
    if (products.length === 0){
      el.innerHTML = '<div class="product-grid__empty">No products yet.</div>';
      return;
    }
    el.innerHTML = products.map(function(product){
      var primary = (product.images || [])[0];
      return '' +
        '<article class="product-grid__item" data-ob-product="' + product.id + '">' +
          '<a class="product-grid__media" href="/product/' + product.slug + '">' +
            (primary ? '<img src="' + primary.url + '" alt="' + (primary.alt || product.name).replace(/"/g, "&quot;") + '" loading="lazy">' : '') +
          '</a>' +
          '<div class="product-grid__body">' +
            '<h3 class="product-grid__name">' + escapeText(product.name) + '</h3>' +
            (cfg.showPrice !== false ? '<div class="product-grid__price">' +
              '<span>' + formatMoney(product.price) + '</span>' +
              (product.compareAtPrice ? '<span class="product-grid__compare">' + formatMoney(product.compareAtPrice) + '</span>' : '') +
            '</div>' : '') +
            (cfg.showAddToCart !== false ? '<button class="product-grid__cta" data-ob-add-to-cart="' + product.id + '">Add to cart</button>' : '') +
          '</div>' +
        '</article>';
    }).join("");
  }

  function escapeText(s){
    var div = document.createElement("div");
    div.textContent = String(s == null ? "" : s);
    return div.innerHTML;
  }

  function hydratePriceTag(el){
    var id = el.getAttribute("data-ob-price");
    var product = productMap[id];
    if (!product) return;
    var span = el.querySelector("[data-ob-product-price]");
    if (span) span.textContent = formatMoney(product.price);
  }

  function syncCartUI(){
    var count = cartCount();
    document.querySelectorAll("[data-ob-cart-count]").forEach(function(el){
      el.textContent = String(count);
      el.setAttribute("data-empty", count === 0 ? "true" : "false");
    });
    renderCartDrawer();
  }

  /* ---------- Cart drawer ---------- */

  function ensureDrawer(){
    var existing = document.getElementById("ob-cart-drawer");
    if (existing) return existing;
    var drawer = document.createElement("aside");
    drawer.id = "ob-cart-drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = '' +
      '<div class="ob-drawer-overlay" data-ob-cart-close></div>' +
      '<div class="ob-drawer-panel" role="dialog" aria-label="Shopping cart">' +
        '<header><h2>Your cart</h2><button data-ob-cart-close aria-label="Close cart">&times;</button></header>' +
        '<div class="ob-drawer-body" data-ob-cart-body></div>' +
        '<footer>' +
          '<div class="ob-drawer-subtotal"><span>Subtotal</span><span data-ob-cart-subtotal></span></div>' +
          '<button class="ob-drawer-checkout" data-ob-checkout>Checkout</button>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(drawer);
    var style = document.createElement("style");
    style.textContent = '#ob-cart-drawer{position:fixed;inset:0;z-index:9999;visibility:hidden;opacity:0;transition:opacity .25s}' +
      '#ob-cart-drawer[aria-hidden="false"]{visibility:visible;opacity:1}' +
      '#ob-cart-drawer .ob-drawer-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4)}' +
      '#ob-cart-drawer .ob-drawer-panel{position:absolute;right:0;top:0;bottom:0;width:min(420px,100%);background:white;display:flex;flex-direction:column;box-shadow:-8px 0 30px rgba(0,0,0,.15);transform:translateX(100%);transition:transform .25s}' +
      '#ob-cart-drawer[aria-hidden="false"] .ob-drawer-panel{transform:translateX(0)}' +
      '#ob-cart-drawer header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #E5E7EB}' +
      '#ob-cart-drawer header h2{margin:0;font-size:1.125rem}' +
      '#ob-cart-drawer header button{background:transparent;border:0;font-size:1.5rem;cursor:pointer;color:#6B7280}' +
      '#ob-cart-drawer .ob-drawer-body{flex:1;overflow-y:auto;padding:16px 20px}' +
      '#ob-cart-drawer .ob-cart-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #F3F4F6}' +
      '#ob-cart-drawer .ob-cart-item img{width:64px;height:64px;object-fit:cover;border-radius:8px;background:#F9FAFB}' +
      '#ob-cart-drawer .ob-cart-item-body{flex:1;display:flex;flex-direction:column;gap:4px}' +
      '#ob-cart-drawer .ob-cart-item-name{font-weight:600;color:#111827;font-size:.9375rem}' +
      '#ob-cart-drawer .ob-cart-item-price{color:#6B7280;font-size:.875rem}' +
      '#ob-cart-drawer .ob-cart-item-qty{display:flex;align-items:center;gap:8px;margin-top:4px}' +
      '#ob-cart-drawer .ob-cart-item-qty button{width:26px;height:26px;border:1px solid #E5E7EB;background:white;border-radius:6px;cursor:pointer;color:#374151}' +
      '#ob-cart-drawer .ob-cart-item-qty span{min-width:24px;text-align:center;font-weight:600}' +
      '#ob-cart-drawer .ob-cart-item-remove{background:transparent;border:0;color:#9CA3AF;cursor:pointer;font-size:.8125rem}' +
      '#ob-cart-drawer footer{padding:20px;border-top:1px solid #E5E7EB}' +
      '#ob-cart-drawer .ob-drawer-subtotal{display:flex;justify-content:space-between;margin-bottom:12px;font-weight:600}' +
      '#ob-cart-drawer .ob-drawer-checkout{width:100%;padding:14px;background:linear-gradient(135deg,#3B82F6,#6366F1);color:white;border:0;border-radius:10px;font-weight:600;cursor:pointer;font-size:1rem}' +
      '#ob-cart-drawer .ob-drawer-empty{padding:40px 0;text-align:center;color:#9CA3AF}' +
      '#ob-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#111827;color:white;padding:10px 18px;border-radius:8px;font-size:.875rem;font-weight:500;opacity:0;transition:opacity .2s;z-index:10000;pointer-events:none}' +
      '#ob-toast[data-show="true"]{opacity:1}';
    document.head.appendChild(style);
    return drawer;
  }

  function renderCartDrawer(){
    var drawer = document.getElementById("ob-cart-drawer");
    if (!drawer) return;
    var body = drawer.querySelector("[data-ob-cart-body]");
    var subtotalEl = drawer.querySelector("[data-ob-cart-subtotal]");
    var checkoutBtn = drawer.querySelector("[data-ob-checkout]");
    var items = loadCart();
    if (items.length === 0){
      body.innerHTML = '<div class="ob-drawer-empty">Your cart is empty.</div>';
      if (subtotalEl) subtotalEl.textContent = "";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }
    if (checkoutBtn) checkoutBtn.disabled = false;
    body.innerHTML = items.map(function(item){
      var product = productMap[item.productId];
      if (!product) return "";
      var image = (product.images || [])[0];
      var variant = variantOf(product, item.variantId);
      return '<div class="ob-cart-item" data-ob-item="' + item.productId + '" data-ob-item-variant="' + (item.variantId || "") + '">' +
        (image ? '<img src="' + image.url + '" alt="">' : '<div style="width:64px;height:64px;background:#F3F4F6;border-radius:8px"></div>') +
        '<div class="ob-cart-item-body">' +
          '<div class="ob-cart-item-name">' + escapeText(product.name + (variant ? " — " + variant.name : "")) + '</div>' +
          '<div class="ob-cart-item-price">' + formatMoney(item.capturedPrice) + '</div>' +
          '<div class="ob-cart-item-qty">' +
            '<button data-ob-qty="-1" aria-label="Decrease quantity">−</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button data-ob-qty="1" aria-label="Increase quantity">+</button>' +
            '<button class="ob-cart-item-remove" data-ob-remove aria-label="Remove">Remove</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");
    var subtotal = cartSubtotal();
    if (subtotalEl && subtotal) subtotalEl.textContent = formatMoney(subtotal);
  }

  function openDrawer(){ ensureDrawer().setAttribute("aria-hidden", "false"); }
  function closeDrawer(){ var d = document.getElementById("ob-cart-drawer"); if (d) d.setAttribute("aria-hidden", "true"); }

  /* ---------- Checkout ---------- */

  function buildSuccessUrl(){
    return location.origin + (location.pathname.replace(/\\/$/, "")) + "?ob_checkout=success";
  }
  function buildCancelUrl(){
    return location.origin + location.pathname;
  }

  async function checkout(){
    var items = loadCart();
    if (items.length === 0) return;
    var mode = SETTINGS.checkout || { type: "mock" };
    try {
      if (mode.type === "stripe-payment-link"){
        if (items.length > 1){
          toast("Multi-item Stripe Payment Link checkout not supported. Configure a Checkout Session endpoint.");
          return;
        }
        var item = items[0];
        var p = productMap[item.productId];
        var v = variantOf(p, item.variantId);
        var url = (v && v.stripePaymentLinkUrl) || (p && p.stripePaymentLinkUrl);
        if (!url){ toast("No Stripe Payment Link configured for this product."); return; }
        var u = new URL(url);
        u.searchParams.set("quantity", String(item.quantity));
        location.href = u.toString();
        return;
      }
      if (mode.type === "stripe-checkout-session" || mode.type === "custom-webhook"){
        var resp = await fetch(mode.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map(function(i){ return { productId: i.productId, variantId: i.variantId, quantity: i.quantity }; }),
            successUrl: buildSuccessUrl(),
            cancelUrl: buildCancelUrl()
          })
        });
        if (!resp.ok){ toast("Checkout error (" + resp.status + ")"); return; }
        var data = await resp.json();
        if (data.url){ location.href = data.url; return; }
      }
      toast("Demo mode — wire up checkout in your store settings.");
    } catch(err){
      console.error(err);
      toast("Checkout failed. Please try again.");
    }
  }

  /* ---------- UI bits ---------- */

  var toastTimeout;
  function ensureToast(){
    var el = document.getElementById("ob-toast");
    if (el) return el;
    el = document.createElement("div");
    el.id = "ob-toast";
    document.body.appendChild(el);
    return el;
  }
  function toast(msg){
    var el = ensureToast();
    el.textContent = msg;
    el.setAttribute("data-show", "true");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ el.setAttribute("data-show", "false"); }, 2500);
  }
  function flashAdded(){ toast("Added to cart"); }

  /* ---------- Event wiring ---------- */

  document.addEventListener("click", function(e){
    var target = e.target;
    if (!(target instanceof Element)) return;
    var addBtn = target.closest("[data-ob-add-to-cart]");
    if (addBtn){
      e.preventDefault();
      addToCart(addBtn.getAttribute("data-ob-add-to-cart"), {
        variantId: addBtn.getAttribute("data-ob-variant") || undefined
      });
      return;
    }
    if (target.closest("[data-ob-cart-toggle]")){
      e.preventDefault();
      ensureDrawer();
      openDrawer();
      return;
    }
    if (target.closest("[data-ob-cart-close]")){
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (target.closest("[data-ob-checkout]")){
      e.preventDefault();
      checkout();
      return;
    }
    var qtyBtn = target.closest("[data-ob-qty]");
    if (qtyBtn){
      var item = qtyBtn.closest(".ob-cart-item");
      if (!item) return;
      var pid = item.getAttribute("data-ob-item");
      var vid = item.getAttribute("data-ob-item-variant") || undefined;
      var delta = Number(qtyBtn.getAttribute("data-ob-qty"));
      var current = loadCart().find(function(i){ return i.productId === pid && i.variantId === vid; });
      if (current) setQuantity(pid, vid, current.quantity + delta);
      return;
    }
    if (target.closest("[data-ob-remove]")){
      var rItem = target.closest(".ob-cart-item");
      if (!rItem) return;
      setQuantity(rItem.getAttribute("data-ob-item"), rItem.getAttribute("data-ob-item-variant") || undefined, 0);
      return;
    }
  });

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll("[data-ob-product]:not([data-ob-product-grid])").forEach(hydrateProductCard);
    document.querySelectorAll("[data-ob-product-grid]").forEach(hydrateProductGrid);
    document.querySelectorAll("[data-ob-price]").forEach(hydratePriceTag);
    ensureDrawer();
    syncCartUI();

    // Optional checkout success handler. Snapshot the cart-as-it-was BEFORE
    // clearing so a merchant browsing their own site sees a local order record
    // in the editor (useful for end-to-end testing of checkout configuration).
    if (location.search.indexOf("ob_checkout=success") >= 0){
      try {
        var snapshot = loadCart();
        if (snapshot.length > 0){
          var subtotalSnap = cartSubtotal();
          var sessionId = new URLSearchParams(location.search).get('session_id') || null;
          var pending = JSON.parse(localStorage.getItem('openbuild_orders_pending') || '[]');
          pending.unshift({
            id: 'ord_' + Math.random().toString(36).slice(2, 14),
            items: snapshot,
            totals: { subtotal: subtotalSnap, discount: { amount: 0, currency: subtotalSnap && subtotalSnap.currency }, tax: { amount: 0, currency: subtotalSnap && subtotalSnap.currency }, shipping: { amount: 0, currency: subtotalSnap && subtotalSnap.currency }, total: subtotalSnap },
            customer: { email: '' },
            status: 'paid',
            stripeCheckoutSessionId: sessionId,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('openbuild_orders_pending', JSON.stringify(pending.slice(0, 100)));
        }
      } catch(e){ /* don't let order capture break the thank-you flow */ }
      clearCart();
      toast("Order received — thank you!");
    }
  });

  // Expose API for custom code
  window.OpenBuildCommerce = {
    addToCart: addToCart,
    setQuantity: setQuantity,
    clearCart: clearCart,
    openCart: openDrawer,
    closeCart: closeDrawer,
    checkout: checkout,
    cart: loadCart,
    catalog: CATALOG
  };
})();
`;
}
