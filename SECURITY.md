# Security Policy

This document describes the security posture of the **3D Geospatial Quantum Engine**
and how to report vulnerabilities responsibly.

## Scope

This is a **client-side static web application** — there is no backend, server-side
database, or authenticated API owned by this project. Security concerns therefore
center on the browser, third-party resources, and user data handled on-device.

## Data Handling

- **No personal data is collected by the app itself.** All interaction telemetry is
  routed through Google Tag Manager / Google Analytics 4 only after the user
  explicitly accepts the cookie/terms consent banner.
- **Consent is required.** Analytics events are suppressed (`logTrackingEvent`)
  until `localStorage['geoquantum_consent'] === 'accepted'`.
- **Geolocation** (the "Deploy Beacon At My Live GPS" feature) uses the
  browser Geolocation API and is requested only on explicit user action.
  The browser prompts for permission; no coordinate is sent to any first-party
  server (it is used only to center the local map view).
- **No cookies are set by this project directly.** Any cookies are set by
  Google's analytics tags, governed by Google's own policies.

## Third-Party Resources

| Resource | Purpose | Trust Boundary |
|-----------|---------|----------------|
| MapLibre GL JS | Map rendering | Loaded from local `assets/js/maplibre-gl.js` |
| Three.js (r128) | 3D rendering | Loaded from local `assets/js/three.min.js` |
| GLTFLoader | GLB model loading | Loaded from local `assets/js/GLTFLoader.js` |
| Fancybox 5 | Media modals | Loaded from local `assets/js/fancybox.umd.js` |
| Tailwind CSS | Styling | `cdn.tailwindcss.com` (development CDN) |
| Google Fonts | Typography | `fonts.googleapis.com` / `fonts.gstatic.com` |
| Open-Meteo | Weather data | `api.open-meteo.com` |
| Google Tag Manager / GA4 | Analytics (post-consent) | `googletagmanager.com` |
| Carto / OpenStreetMap tiles | Base map | External tile CDNs |

> **Note:** `cdn.tailwindcss.com` is the Tailwind *play CDN* and is intended for
> development. For production, compile Tailwind to a local stylesheet to remove the
> external dependency and the associated supply-chain surface.

## Service Worker & Offline Cache

- The service worker (`sw.js`) precaches only **same-origin local assets** plus a
  small allow-list of CDN dependencies.
- Cross-origin requests use network-first with a cache fallback; analytics beacons
  (`googletagmanager.com`, `google-analytics.com`, `googlesyndication.com`)
  are explicitly **excluded from caching**.
- The service worker runs in a sandboxed worker scope and cannot access the DOM
  or first-party cookies arbitrarily.
- Cache versioning is date-stamped (`geoquantum-YYYY-MM-DD-HHMM`). Old caches are
  purged on activation.

## Content Security

- The app is **HTTPS-compatible** and should always be served over HTTPS in
  production (required for Service Worker + Geolocation APIs in most browsers).
- No `eval()` is used in application code.
- External model/asset URLs loaded via the custom-GLB deployer should be
  treated as untrusted; they execute as WebGL geometry only.

## Reporting a Vulnerability

We take security seriously. If you discover a security issue, please report it
**privately** rather than opening a public issue:

- Email: **security@mikempj.com** (or open a private GitHub security advisory)
- Include steps to reproduce, impact, and any proof-of-concept.
- We aim to acknowledge reports within **72 hours** and provide a remediation
  timeline within **7 days** for confirmed issues.

Please do not disclose the issue publicly until a fix has been released.

## Responsible Disclosure Hall of Fame

_(To be added as reports are handled.)_
