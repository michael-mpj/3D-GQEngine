# Changelog

All notable changes to the **3D Geospatial Quantum Engine** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.90.0-UAE] - 2026-07-20

### Fixed
- **Custom cursor**: Initial off-screen position (`-100,-100`) caused the cursor to be invisible until first mouse move. Now centered on the viewport on load and slightly enlarged (dot `6px → 8px`, ring `30px → 36px`) for visibility. Animation loop wrapped in `try/catch` so unrelated JS errors cannot stop it.
- **Location / sector animations not showing**: The three core library files were missing their `.js` extension (`three.min`, `GLTFLoader`, `fancybox.umd`) so the browser failed to load `THREE`, `GLTFLoader`, and `Fancybox` — which broke all 3D entity spawning and sector presets. Renamed to `three.min.js`, `GLTFLoader.js`, `fancybox.umd.js`.
- **Privacy & Terms links**: Converted the dead `<span>` placeholders in the consent banner into real anchors (`#privacy`, `#terms`) pointing at `privacy.html` / `terms.html`.
- **Cookie/terms consent re-prompt**: Accepted consent is now persisted in `localStorage` (`geoquantum_consent`) and the banner is suppressed on return visits.

### Added
- **Offline PWA engine** (`sw.js`): Full app-shell precache (17 local assets), versioned cache key (`geoquantum-YYYY-MM-DD-HHMM`), stale-while-revalidate for same-origin requests, network-first with cache fallback for cross-origin (CDN / APIs), automatic purging of stale caches on activate, and a silent version-update handshake between page and service worker.
- **Service worker registration** in `index.html` with periodic `reg.update()` polling and a `controllerchange` reload on new builds.
- **Consent-gated analytics**: `logTrackingEvent()` now only forwards events to Google Tag Manager / GA4 after the user accepts the consent banner (GDPR / PDPL compliant). Analytics IDs centralized as `GTM_ID` / `GA4_ID` constants.

### Changed
- Consent banner flow now stores acceptance and self-hides on subsequent loads.
- Analytics events are always logged to the console for development, but are suppressed from GTM/GA4 until consent is given.

## [1.0.0-UAE] - 2026 (initial)

- MapLibre GL JS + Three.js synchronized WebGL rendering.
- Sector presets (Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Jebel Jais).
- Interactive 3D entity deployment (cyber-tower, holo-crystal, orbital-ring, custom GLB).
- Animated Bezier network links, weather particle systems, DEM terrain, extruded buildings.
- POI layers with Fancybox galleries and YouTube embeds.
- Web Audio retro synthesizer, live GPS beacon, Open-Meteo weather sync.
- PWA manifest + basic service worker, GTM / GA4 integration.
