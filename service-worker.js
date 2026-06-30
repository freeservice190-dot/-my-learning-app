/**
 * service-worker.js — caches the app shell on install, and dynamically
 * caches course content (courses/*.json) the first time each file is
 * fetched — so any course you add later becomes available offline too,
 * without ever editing this file again.
 */
const CACHE_NAME = "learning-app-cache-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./courses-index.json",
  "./css/style.css",
  "./js/icons.js",
  "./js/theme.js",
  "./js/db.js",
  "./js/firebase-config.js",
  "./js/auth.js",
  "./js/sync.js",
  "./js/seed.js",
  "./js/render.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache GitHub sync calls or Firebase/Google auth calls.
  if (url.origin.includes("githubusercontent.com") || url.origin.includes("firebase") || url.origin.includes("google")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
