/**
 * Escritório Virtual — Service Worker
 *
 * Estratégia: cache-first com fallback offline.
 * Versão é injetada no build via tools/pwa/inject-sw-version.ts.
 */

const VERSION = "__SW_VERSION__";
const CACHE_PREFIX = "ev-cache";
const CACHE_RUNTIME = `${CACHE_PREFIX}-runtime-${VERSION}`;
const CACHE_PRECACHE = `${CACHE_PREFIX}-precache-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/configurar/",
  "/manifest.webmanifest",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/icons/favicon.svg",
];

// ── INSTALL ────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

// ── ACTIVATE ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith(CACHE_PREFIX) && !k.endsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── FETCH ──────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML: network-first (atualização visível) com fallback ao cache
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("/"))),
    );
    return;
  }

  // Assets estáticos: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE_RUNTIME).then((c) => c.put(req, copy));
        }
        return res;
      });
    }),
  );
});

// ── MESSAGE (pra forçar update) ────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
