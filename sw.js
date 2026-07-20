/*
 * 3D Geospatial Quantum Engine - Service Worker
 * ----------------------------------------------------
 * OFFLINE POLICY
 *  - App shell + local assets are pre-cached on install so the
 *    site loads even with NO internet (after the first online load).
 *  - Same-origin requests use STALE-WHILE-REVALIDATE: instant
 *    offline paint, background refresh when online.
 *  - Cross-origin (CDN / APIs) use NETWORK-FIRST with cache
 *    fallback so fresh data is preferred but offline still works.
 *
 * VERSIONING / CACHE UPDATES
 *  - Bump CACHE_VERSION (a date-time stamp) whenever files change.
 *  - The active tab is notified via postMessage on a new SW activate,
 *    and the page calls SW.update() to pull the new shell silently.
 *  - Old caches are purged on activate automatically.
 */

const CACHE_VERSION = "2026-07-20-0237"; // UPDATE THIS on every deploy
const CACHE_NAME = `geoquantum-${CACHE_VERSION}`;
const BUILD_TIME = "2026-07-20T02:37:00+04:00";

/* Local app shell + assets (pre-cached, required for offline boot) */
const LOCAL_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./privacy.html",
    "./terms.html",
    "assets/css/index.css",
    "assets/css/maplibre-gl.css",
    "assets/css/fancybox.css",
    "assets/js/index.js",
    "assets/js/maplibre-gl.js",
    "assets/js/three.min.js",
    "assets/js/GLTFLoader.js",
    "assets/js/fancybox.umd.js",
    "assets/icons/favicon.ico",
    "assets/icons/icon-192.png",
    "assets/icons/icon-512.png",
    "assets/icons/maskable-512.png"
];

/* Optional external deps (cached opportunistically when reachable) */
const CDN_ASSETS = [
    "https://cdn.tailwindcss.com",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
    "https://fonts.gstatic.com/"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(LOCAL_ASSETS))
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.warn("[SW] Precache partial failure:", err);
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            ))
            .then(() => self.clients.claim())
            .then(() => {
                // Tell any open tabs a newer shell is ready
                return self.clients.matchAll({ includeUncontrolled: true });
            })
            .then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: "SW_UPDATED", version: CACHE_VERSION, buildTime: BUILD_TIME });
                });
            })
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);

    // Never cache Google analytics / tag manager beacons
    if (url.hostname.includes("googletagmanager.com") ||
        url.hostname.includes("google-analytics.com") ||
        url.hostname.includes("googlesyndication.com")) {
        return;
    }

    // Same-origin -> stale-while-revalidate
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(req).then((cached) => {
                    const network = fetch(req)
                        .then((response) => {
                            if (response && response.status === 200) {
                                cache.put(req, response.clone());
                            }
                            return response;
                        })
                        .catch(() => cached);
                    return cached || network;
                })
            )
        );
        return;
    }

    // Cross-origin (CDN / APIs) -> network-first with cache fallback
    event.respondWith(
        fetch(req)
            .then((response) => {
                if (response && response.status === 200 && response.type === "basic") {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                }
                return response;
            })
            .catch(() => caches.match(req))
    );
});

/* Allow the page to trigger an immediate silent update */
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SW_CHECK_UPDATE") {
        self.skipWaiting();
    }
});
