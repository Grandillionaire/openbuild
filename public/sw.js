/**
 * OpenBuild service worker — caching with a stale-while-revalidate strategy
 * for app shell + static assets, network-first for editor API-ish endpoints,
 * and an offline fallback for navigation. Commerce-aware: critical commerce
 * runtime artifacts (catalog snapshot, runtime script) are cached eagerly so
 * the published storefront stays interactive on flaky connections.
 */

const SHELL_CACHE = 'openbuild-shell-v2';
const ASSET_CACHE = 'openbuild-assets-v2';
const COMMERCE_CACHE = 'openbuild-commerce-v2';

const SHELL_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, ASSET_CACHE, COMMERCE_CACHE]);
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

function isStaticAsset(url) {
  return /\.(?:js|css|woff2?|ttf|otf|eot|svg|png|jpe?g|webp|avif|gif|ico)$/.test(url.pathname);
}

function isCommerceArtifact(url) {
  // The exported commerce runtime is inlined into HTML and product images come
  // from third-party CDNs (see imageOpt.ts). What we DO want to cache is the
  // hydrated catalog snapshot the editor saves under /commerce/catalog.json
  // and any locally-hosted product images.
  return url.pathname.startsWith('/commerce/') || url.pathname.startsWith('/products/');
}

// Stale-while-revalidate: serve from cache instantly, refresh in background.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await networkFetch) || new Response('Offline', { status: 503 });
}

// Network first: try the network, fall back to cache, then to offline page.
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await caches.match('/index.html');
      if (shell) return shell;
    }
    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isCommerceArtifact(url)) {
    event.respondWith(staleWhileRevalidate(request, COMMERCE_CACHE));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }
  event.respondWith(networkFirst(request));
});

// Allow the editor to evict its own caches without touching the user's other PWA caches.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) =>
        Promise.all(names.filter((n) => n.startsWith('openbuild-')).map((n) => caches.delete(n)))
      )
    );
  }
});
