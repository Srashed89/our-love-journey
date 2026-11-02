/* Offline support: precache the whole app on install, serve it from the cache,
   and refresh pages from the network when online so updates still arrive. */
const CACHE = "our-love-journey-mvykaaz6";
const PRECACHE = [
  "./",
  "app.css?v=mvykaaz6",
  "app.js?v=mvykaaz6",
  "fonts/bodoni-moda-latin-ext-opsz-italic-LIMRBNUY.woff2",
  "fonts/bodoni-moda-latin-ext-opsz-normal-AEDWSHLF.woff2",
  "fonts/bodoni-moda-latin-opsz-italic-7IXSHFJR.woff2",
  "fonts/bodoni-moda-latin-opsz-normal-DBREMYZ3.woff2",
  "fonts/bodoni-moda-math-opsz-italic-YPEWALDB.woff2",
  "fonts/bodoni-moda-math-opsz-normal-BZJMIBEJ.woff2",
  "fonts/bodoni-moda-symbols-opsz-italic-33JBSX6M.woff2",
  "fonts/bodoni-moda-symbols-opsz-normal-6Q3BCZR2.woff2",
  "fonts/jost-latin-300-normal-QHSN6R2L.woff2",
  "fonts/jost-latin-400-normal-ODD52N44.woff2",
  "fonts/jost-latin-500-normal-LFWO7UH7.woff2",
  "fonts/jost-latin-600-normal-HIICMCNS.woff2",
  "fonts/pinyon-script-latin-400-normal-3XNMWQJV.woff2",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("our-love-journey-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  if (req.mode === "navigate") {
    // network first, so a new version shows up; the cached copy when offline
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./", copy)); return res; })
        .catch(() => caches.match("./", { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
