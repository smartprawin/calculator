const CACHE = 'calc-v4';
const ASSETS = [
  'common.js?v=2', 'emi.js?v=2', 'ebbill.js?v=2', 'tax.js?v=2',
  'weightloss.js?v=2', 'irpart.js?v=2', 'sip.js?v=2', 'bmi.js?v=2',
  'offer.js?v=2', 'payslip.js?v=2', 'gst.js?v=2', 'chit.js?v=2',
  'style.css?v=2', 'favicon.png?v=2', 'og-image.png', 'manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // HTML pages are always fetched fresh from the network (no stale cache).
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).catch(function () { return caches.match(e.request); })
    );
    return;
  }

  // Assets: network-first, fall back to cache when offline.
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || new Response('', { status: 503 });
      });
    })
  );
});
