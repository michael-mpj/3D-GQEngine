# 🛰️ 3D Geospatial Quantum Engine

An immersive, high-performance **3D Geospatial Engine** that fuses **MapLibre GL JS**
and **Three.js** into a single synchronized WebGL rendering pipeline.

Built as a **Progressive Web App (PWA)**, the engine lets you deploy interactive
3D structures, load cloud-hosted GLB models, draw animated geospatial links, render
real terrain (DEM), and simulate live weather — all in real time, and **offline**
after the first load.

---

## ✨ Features

### 🌍 Unified 3D WebGL Environment
- Seamless MapLibre GL JS + Three.js integration
- Shared synchronized WebGL rendering pipeline
- Accurate GPS → Three.js coordinate conversion via Mercator projection
- Hardware-accelerated rendering & high-performance animation loop

### 🏙️ Interactive 3D City Rendering
- Extruded vector buildings
- Dynamic building heights
- Real-time shadow rendering
- Adjustable terrain exaggeration

### ⛰️ Digital Elevation Models (DEM)
- Real terrain rendering using Digital Elevation Models
- Toggleable 3D terrain layer (`setupTerrain` / `toggleTerrain`)

### 🚀 Quantum Deployment Sandbox
Deploy interactive objects anywhere on the map by **double-clicking**.
Supported types: `cyber-tower`, `holo-crystal`, `orbital-ring`, `custom-glb`.

### 📦 GLB Model Loader
- Remote GLB URL loading (CORS-compatible)
- Automatic scaling & positioning
- Fallback procedural mesh on load failure

### 🔗 Animated Network Connections
- Quadratic Bezier curves between sequentially deployed nodes
- Traveling data packets (pulse spheres)
- Animated pulse effects

### 📍 Live GPS Integration
- Browser Geolocation API (permission-prompted)
- Personal beacon spawn + coordinate display

### ☁️ Live Weather Synchronization
- Powered by **Open-Meteo**
- Drives particle system mode (cyber-sparks / golden-rain / blizzard)

### ✨ Particle Simulation
- GPU-accelerated: Neon Sparks, Golden Rain, Quantum Blizzard

### 🕒 Chronological Telemetry
- Local time, UTC offset, weather, anchor coordinates, FPS, latency

### 📍 Dynamic POI Filtering
- Filter by category: Attractions, Shopping, Transit, General POI
- Fancybox image galleries + YouTube embeds

### 🎮 Cinematic Controls
- 2D / 3D toggle, orbit camera, pitch, bearing, fly-to, auto-sweep

### 🔊 Retro Audio Synthesizer
- Pure Web Audio API (no audio files): click, spawn, warp, link, delete, hover

---

## 🛰️ Technology Stack

| Category | Technology |
|-----------|------------|
| Mapping | MapLibre GL JS (local `assets/js/maplibre-gl.js`) |
| 3D Engine | Three.js r128 (local `assets/js/three.min.js`) |
| Model Loader | GLTFLoader (local `assets/js/GLTFLoader.js`) |
| Styling | Tailwind CSS (CDN play build) |
| Weather | Open-Meteo API |
| Audio | Web Audio API |
| Analytics | Google Analytics 4 + Google Tag Manager (consent-gated) |
| PWA | Service Worker (`sw.js`) + Web App Manifest |

---

## 🚀 Quick Start

Because the app registers a **Service Worker** and loads local + external assets,
serve it over **HTTP** (not `file://`).

### Python
```bash
python3 -m http.server 8080
```

### Node.js
```bash
npx serve .
```

Then open `http://localhost:8080`.

---

## 📦 Deployment

Static host (Vercel / GitHub Pages / Netlify / any static server).
No build step required — it is a plain static site.

> **Production note:** replace the Tailwind **play CDN** (`cdn.tailwindcss.com`)
> with a compiled local stylesheet to remove the runtime dependency and the
> associated console warning.

---

## 🛸 User Controls

| Action | Result |
|---------|--------|
| Right Click + Drag | Rotate camera (pitch & bearing) |
| Scroll Wheel | Zoom |
| Double Click | Deploy selected structure |
| Sector Preset | Fly-to landmark + spawn preset meshes/POIs |
| 3D Toggle | Switch 2D / 3D projection |
| Install Button | Install as PWA |

---

## 🌍 Sector Preset Destinations

Built-in camera fly-to locations (UAE):

- **Dubai** — Burj Khalifa area (cyber-tower + orbital-ring)
- **Abu Dhabi** — Corniche (holo-crystal + cyber-tower)
- **Sharjah** — Majaz Lagoon (orbital-ring)
- **Ras Al Khaimah** — Dhayah Fort (holo-crystal)
- **Jebel Jais** — Ridge peak (holo-crystal + orbital-ring)

Each preset spawns its 3D entities and shows category-filtered POI markers.

---

## 📂 Repository Structure

```
3d-geospatial-engine/
├── index.html              # App shell + PWA registration
├── index-bakup.html       # Reference snapshot (do not edit)
├── manifest.json           # PWA manifest
├── sw.js                  # Service worker (offline + versioned cache)
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
├── robots.txt
├── sitemap.xml
├── README.md
├── CHANGELOG.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE                # MIT
├── assets/
│   ├── css/
│   │   ├── index.css          # App + custom cursor styles
│   │   ├── maplibre-gl.css
│   │   └── fancybox.css
│   ├── js/
│   │   ├── index.js          # Map + WebGL + UI logic
│   │   ├── maplibre-gl.js
│   │   ├── three.min.js
│   │   ├── GLTFLoader.js
│   │   └── fancybox.umd.js
│   ├── icons/              # PWA icons (192 / 512 / maskable)
│   ├── screenshots/
│   └── data/
└── ...
```

---

## 📡 Progressive Web App

- **Offline support** — app shell + all local assets are precached on first
  load; the site boots with **no internet** afterward.
- **Versioned cache** — `sw.js` uses a date-stamped cache key
  (`geoquantum-YYYY-MM-DD-HHMM`); old caches are purged automatically
  on activation.
- **Silent updates** — the page polls for a new service-worker build and
  performs a background refresh, then reloads once on next navigation.
- Install prompt + app manifest + background caching + fast startup.

See [`SECURITY.md`](./SECURITY.md) for the caching / third-party trust boundary.

---

## 📈 Analytics (Consent-Gated)

Integrated with **Google Analytics 4** + **Google Tag Manager**.

- Events fire through `logTrackingEvent(eventName, params)`.
- **No analytics are sent until the user accepts** the cookie/terms consent
  banner (`localStorage['geoquantum_consent'] === 'accepted'`).
- IDs are centralized in `index.js` as `GTM_ID` / `GA4_ID` constants.
- All telemetry is wrapped in `try/catch` and never blocks the app.

> Replace the placeholder `GTM-NKQ8C9HH` / `G-V8RF39YJC5` IDs with
> your real container / property IDs to begin collecting data.

---

## 🔒 Security

See [`SECURITY.md`](./SECURITY.md). Highlights:

- HTTPS-compatible (required for SW + Geolocation in production)
- Consent-gated analytics; no first-party cookies set by the app
- Service-worker sandboxing; analytics/ads beacons excluded from cache
- Geolocation requested only on explicit user action

---

## 🎯 Performance

- Shared WebGL context (MapLibre + Three.js on one canvas)
- GPU buffer geometry & efficient particle systems
- `requestAnimationFrame` render loop
- Optimized for desktop, mobile, tablet, and touch devices

---

## 🛣️ Roadmap

- [ ] Multiplayer Collaboration
- [ ] WebXR / VR Support
- [ ] Drone Simulation
- [ ] AI Route Prediction
- [ ] BIM Model Support
- [ ] Real-Time Traffic
- [ ] Satellite Imagery Layers

---

## 🤝 Contributing

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Contributions welcome:

1. Fork & create a feature branch (`git checkout -b feature/my-feature`)
2. Commit (`git commit -m "Added new feature"`)
3. Push (`git push origin feature/my-feature`)
4. Open a Pull Request

---

## 📄 License

Released under the **MIT License** — see [`LICENSE`](./LICENSE).
Free to use, modify, and distribute for personal or commercial use.

---

## 👨‍💻 Author

**Michael Joseph** — MJ Design Studio
3D Mapping • GIS • UI/UX • WebGL • Three.js • MapLibre • Interactive Experiences

---

## ⭐ Support

If this project helped you, consider starring it on GitHub. It helps others
discover the project and supports future development.

---

**Built with ❤️ using MapLibre GL JS, Three.js, WebGL, and modern browser technologies.**
