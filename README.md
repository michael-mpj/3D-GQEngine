
# 🛰️ 3D Geospatial Quantum Engine

<defs>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 204, 0.04)" stroke-width="1" />
  </pattern>
  <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#020617" />
    <stop offset="100%" stop-color="#090514" />
  </linearGradient>
  <linearGradient id="laser" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="rgba(0, 255, 204, 0)" />
    <stop offset="50%" stop-color="rgba(0, 255, 204, 0.4)" />
    <stop offset="100%" stop-color="rgba(0, 255, 204, 0)" />
  </linearGradient>
</defs>

<rect width="100%" height="100%" fill="url(#bg-grad)" />
<rect width="100%" height="100%" fill="url(#grid)" />

<!-- Isometric Radar Rings in Center -->
<g transform="translate(0, 0)">
  <ellipse cx="400" cy="160" rx="320" ry="120" fill="none" stroke="rgba(0, 255, 204, 0.08)" stroke-width="1.5" />
  <ellipse cx="400" cy="160" rx="240" ry="90" fill="none" stroke="rgba(0, 255, 204, 0.15)" stroke-width="1" />
  <ellipse cx="400" cy="160" rx="160" ry="60" fill="none" stroke="rgba(255, 0, 255, 0.2)" stroke-width="1" />
</g>

<!-- Rotating Dial Graphics -->
<g class="rotate-cw">
  <circle cx="400" cy="160" r="140" fill="none" stroke="rgba(0, 255, 204, 0.25)" stroke-width="1" stroke-dasharray="20 40 10 5" />
  <circle cx="400" cy="160" r="100" fill="none" stroke="rgba(255, 0, 255, 0.3)" stroke-width="1.5" stroke-dasharray="120 40 10 30" />
</g>
<g class="rotate-ccw">
  <circle cx="400" cy="160" r="120" fill="none" stroke="rgba(0, 255, 204, 0.15)" stroke-width="1" stroke-dasharray="5 15 30 10" />
  <circle cx="400" cy="160" r="80" fill="none" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5" stroke-dasharray="60 10" />
</g>

<!-- Bezier Network Data Links -->
<path d="M 220 110 Q 310 30 400 160" fill="none" stroke="#ff00ff" stroke-width="1.5" class="data-link" />
<path d="M 400 160 Q 490 290 580 210" fill="none" stroke="#00ffcc" stroke-width="1.5" class="data-link" />
<path d="M 220 110 Q 400 240 580 210" fill="none" stroke="rgba(139, 92, 246, 0.4)" stroke-width="1" stroke-dasharray="4 4" />

<!-- Pulsing Radar Waves on Nodes -->
<circle cx="220" cy="110" r="10" fill="none" stroke="#ff00ff" stroke-width="1" class="pulse-ring-1" />
<circle cx="580" cy="210" r="10" fill="none" stroke="#00ffcc" stroke-width="1" class="pulse-ring-2" />

<!-- Physical Solid Nodes -->
<!-- Core Hub -->
<circle cx="400" cy="160" r="10" fill="#030712" stroke="#00ffcc" stroke-width="3" />
<circle cx="400" cy="160" r="4" fill="#00ffcc" />
<!-- Node Alpha -->
<circle cx="220" cy="110" r="7" fill="#030712" stroke="#ff00ff" stroke-width="2.5" />
<circle cx="220" cy="110" r="3" fill="#ff00ff" />
<!-- Node Beta -->
<circle cx="580" cy="210" r="7" fill="#030712" stroke="#00ffcc" stroke-width="2.5" />
<circle cx="580" cy="210" r="3" fill="#00ffcc" />

<!-- Scanning Laser Line -->
<rect x="0" y="158" width="800" height="4" fill="url(#laser)" class="scanner" />

<!-- Hud Text Overlay -->
<text x="30" y="50" font-family="'JetBrains Mono', monospace" font-size="12" fill="#00ffcc" font-weight="bold" tracking-wide>SYSTEM: ACTIVE</text>
<text x="30" y="70" font-family="'JetBrains Mono', monospace" font-size="10" fill="rgba(255,255,255,0.4)">LATENCY: 12ms // FPS: 60</text>

<text x="770" y="50" font-family="'JetBrains Mono', monospace" font-size="11" fill="#ff00ff" text-anchor="end" font-weight="bold" class="blinker">WARP MATRIX SECURE</text>
<text x="770" y="70" font-family="'JetBrains Mono', monospace" font-size="10" fill="rgba(255,255,255,0.4)" text-anchor="end">GRID STABLE [1.90-HYPER]</text>

<!-- Central Project Brand Title -->
<text x="400" y="275" font-family="'Inter', sans-serif" font-size="18" fill="#ffffff" font-weight="bold" letter-spacing="0.3em" text-anchor="middle">GEO-SPATIAL QUANTUM MATRIX</text>
<text x="400" y="295" font-family="'JetBrains Mono', monospace" font-size="9" fill="#00ffcc" letter-spacing="0.1em" text-anchor="middle">3D CARTOGRAPHIC PROJECTION ENGINE</text>

# 🛰️ 3D Geospatial Quantum Engine

An immersive, high-performance **3D Geospatial Engine** that combines **MapLibre GL JS** and **Three.js** into a synchronized WebGL rendering environment.

Built as a **Progressive Web Application (PWA)**, the engine enables users to deploy interactive structures, load cloud-hosted GLB models, create animated geospatial connections, visualize terrain, and simulate live weather conditions in real time.

---

## ✨ Features

### 🌍 Unified 3D WebGL Environment

- Seamless MapLibre GL JS + Three.js integration
- Shared synchronized WebGL rendering pipeline
- Accurate GPS → Three.js coordinate conversion using Mercator projection
- Hardware accelerated rendering
- High-performance animation loop

---

### 🏙️ Interactive 3D City Rendering

- Extruded vector buildings
- Dynamic building heights
- Real-time shadow rendering
- Adjustable terrain exaggeration
- Smooth zoom transitions

---

### ⛰️ Digital Elevation Models (DEM)

Supports real terrain rendering using Digital Elevation Models.

Examples include:

- Grand Canyon
- Mountain ranges
- Valleys
- Hills
- Coastal terrain

---

### 🚀 Quantum Deployment Sandbox

Deploy interactive objects anywhere on the map.

Supported deployment types include:

- 📡 Beacon
- 💎 Holographic Crystal
- 🛰 Orbital Ring
- 🧭 Marker Nodes
- ⚡ Energy Towers

Deployment is performed by simply double-clicking anywhere on the map.

---

### 📦 GLB Model Loader

Load custom cloud-hosted GLB models.

Features include:

- Remote URL loading
- Automatic scaling
- Automatic positioning
- Rotation controls
- Fallback procedural meshes
- CORS compatible

---

### 🔗 Animated Network Connections

Automatically create animated links between deployed nodes.

Includes:

- Quadratic Bezier curves
- Traveling data packets
- Animated pulse effects
- Dynamic routing

---

### 📍 Live GPS Integration

Uses the browser Geolocation API.

Features:

- Current position detection
- Spawn personal beacon
- Coordinate display
- Accuracy indicator

---

### ☁️ Live Weather Synchronization

Powered by **Open-Meteo**.

Weather influences rendering in real time.

Supported effects:

- ☀️ Clear
- 🌧 Rain
- ❄ Snow
- 🌩 Storm
- 🌫 Fog

---

### ✨ Particle Simulation

GPU-accelerated particle systems including:

- Neon Sparks
- Quantum Blizzards
- Solar Rain
- Energy Dust
- Atmospheric Particles

---

### 🕒 Chronological Telemetry

Displays:

- Local Time
- UTC Offset
- Weather Status
- Coordinates
- FPS
- Network Latency

---

### 📍 Dynamic POI Filtering

Filter map data by category.

Supported filters:

- Attractions
- Shopping
- Restaurants
- Transit
- Hotels
- Public Services

---

### 🎮 Cinematic Controls

Interactive navigation includes:

- 2D / 3D Toggle
- Orbit Camera
- Pitch Control
- Bearing Rotation
- Smooth Fly-To Animations
- Automatic Camera Sweep

---

### 🔊 Retro Audio Synthesizer

Built entirely using the Web Audio API.

Generated sounds include:

- Click
- Spawn
- Delete
- Warp
- Hover
- Notifications

No external audio files required.

---

## ⚙️ Technology Stack

| Category | Technology |
|-----------|------------|
| Mapping | MapLibre GL JS |
| 3D Engine | Three.js |
| Model Loader | GLTFLoader |
| Styling | Tailwind CSS CDN |
| Weather | Open-Meteo API |
| Audio | Web Audio API |
| Analytics | Google Analytics 4 |
| Tag Manager | Google Tag Manager |
| PWA | Service Workers + Manifest |

---

## 🚀 Quick Start

### Clone Repository

```bash
git clone https://github.com/your-username/3d-geospatial-engine.git
cd 3d-geospatial-engine
```

---

### Run Local Server

Because the application registers a Service Worker and fetches external assets, run it through an HTTP server.

### Python

```bash
python3 -m http.server 8080
```

### Node.js

```bash
npm install -g serve
serve .
```

### VS Code

Install the **Live Server** extension.

Right-click:

```
index.html
```

Select:

```
Open with Live Server
```

Then open:

```
http://localhost:8080
```

---

## 📦 Deployment

### Vercel

1. Push repository to GitHub.
2. Login to Vercel.
3. Import the repository.
4. Click **Deploy**.

No build configuration required.

---

### GitHub Pages

Navigate to:

```
Repository Settings
```

Then:

```
Pages
```

Select:

```
Deploy from branch
```

Choose:

```
main
```

Your site becomes available at:

```
https://your-username.github.io/your-repository/
```

---

## 🛸 User Controls

| Action | Result |
|---------|--------|
| Right Click + Drag | Rotate Camera |
| Scroll Wheel | Zoom |
| Double Click | Deploy Structure |
| Preset Warp | Fly to Landmark |
| 3D Toggle | Switch Between 2D & 3D |
| Install Button | Install as PWA |

---

## 🌍 Preset Destinations

Built-in camera fly-to locations include:

- Manhattan
- Tokyo
- Paris
- Pyramids of Giza
- Grand Canyon

---

## 📂 Repository Structure

```
3d-geospatial-engine/
│
├── index.html
├── README.md
├── manifest.json
├── sw.js
├── assets/
│   ├── models/
│   └── icons/
└── screenshots/
```

---

## 📡 Progressive Web App

Features include:

- Offline Support
- Service Worker
- Install Prompt
- App Manifest
- Background Caching
- Fast Startup
- Native App Experience

---

## 📈 Analytics

Integrated with:

- Google Analytics 4
- Google Tag Manager

Tracks:

- Page Views
- User Events
- Camera Actions
- Deployments
- Weather Requests
- Performance Metrics

---

## 🔒 Security

The application is designed with modern web security practices.

Features include:

- HTTPS Compatible
- CORS-safe Asset Loading
- Offline Cache Isolation
- Service Worker Sandboxing
- Browser Geolocation Permissions

---

## 🎯 Performance

Optimized for:

- Desktop
- Mobile
- Tablets
- Touch Devices

Performance techniques:

- Shared WebGL Context
- GPU Buffer Geometry
- Frustum Culling
- Lazy GLB Loading
- RequestAnimationFrame Rendering
- Efficient Particle Systems

---

## 📸 Screenshots

```
screenshots/
├── overview.png
├── deployment.png
├── weather.png
├── terrain.png
└── pwa.png
```

---

## 🛣️ Roadmap

- [ ] Multiplayer Collaboration
- [ ] WebXR / VR Support
- [ ] Drone Simulation
- [ ] AI Route Prediction
- [ ] BIM Model Support
- [ ] Indoor Navigation
- [ ] Real-Time Traffic
- [ ] Terrain Editing
- [ ] Satellite Imagery Layers
- [ ] Digital Twin Synchronization

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

1. Commit changes

```bash
git commit -m "Added new feature"
```

1. Push

```bash
git push origin feature/my-feature
```

1. Open a Pull Request.

---

## 📄 License

Released under the **MIT License**.

You are free to use, modify, distribute, and build upon this project for personal or commercial applications.

---

## 👨‍💻 Author

**Michael Joseph**

**MJ Design Studio**

3D Mapping • GIS • UI/UX • WebGL • Three.js • MapLibre • Interactive Experiences

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.

---
**Built with ❤️ using MapLibre GL JS, Three.js, WebGL, and modern browser technologies.**
