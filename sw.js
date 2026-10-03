// Permite abrir la app sin internet. Rutas relativas: funciona en la raíz o en una subcarpeta (ej. /presupuesto/).
// Si cambias index.html después de publicar, sube la versión de CACHE.
const CACHE = "presupuesto-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./favicon.ico", "./apple-touch-icon.png", "./icon-192.png?v=g8b", "./icon-512.png?v=g8b"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("presupuesto-") && k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // el formulario (POST a Google) nunca pasa por aquí
  e.respondWith(fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })
    .catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(r => r || caches.match("./index.html"))));
});
