🛰️ 3D Geospatial Quantum Engine

<!-- Grid Background Layer -->
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


An immersive, high-performance 3D Geospatial Engine merging Maplibre GL JS and Three.js into a synchronized WebGL canvas rendering environment. Programmed as a self-contained progressive application (PWA), it enables users to deploy custom structures, load 3D GLB models from cloud paths, connect locations using curves, and view simulated meteorological conditions in real-time.

🌟 Key Features

1. Unified 3D WebGL Coordinates

Three.js & Maplibre Fusion: Aligning geospatial projections with WebGL objects by converting standard GPS coordinates into Three.js local coordinate systems using the Mercator scale.

Extruded 3D Cityscapes: Interactive building vector layers rendering dynamic block models based on local geographic heights.

3D Elevation (DEM): Integrates real digital elevation models to map slopes, ravines, and relief terrain (e.g., Grand Canyon).

2. Quantum Deployment Sandbox

Dynamic Node Deployment: Double-click on any map location to instantly generate structures like Beacons, Holographic Crystals, or Orbital Rings.

Custom GLB Model Loader: Supports loading external, CORS-enabled .glb models directly via cloud links, with a dynamic procedural fallback mesh system.

Sequenced Bezier Network Links: Spawning nodes sequentially automatically creates animated quadratic Bezier link lines and traveling data pulse packets between them.

Live GPS Mapping: Instantly query location metrics using the browser Geolocation API to spawn a dedicated anchor beacon on your coordinates.

3. Chrono & Weather Telemetry

Open-Meteo API Sync: Coordinates from the map focus are queried in real-time to adjust rendering parameters.

Particle Shaders: Simulates conditions like Neon Sparks, Solar Rain, and Quantum Blizzards using high-speed Three.js buffer geometry particle meshes.

Chronological Widget: A continuous clock rendering active UTC time offsets alongside the weather indicator.

Dynamic POI Filtering: Renders and filters Attractions, Shopping, Transit, and General POIs based on the active sector.

4. Cinematic Controls & Retro Synthesizer

Glassmorphic Navigation: Zoom controls and perspective pitch switches (2D Nadir to 3D tilt) aligned on the right of the viewport.

Cinematic Orbit Sweep: Automatically drifts the camera's bearing continuously for a dynamic security/monitoring sweep view.

Web Audio Synthesis: Programs customized retro frequencies and sound effects (spawn, delete, warp, click) using the Web Audio API without relying on external assets.

🛠️ Tech Stack & Dependencies

UI Layer: Tailwind CSS CDN

Cartographic Engine: Maplibre GL JS

3D Graphics Framework: Three.js r128

3D Asset Loader: THREE.GLTFLoader

Weather API: Open-Meteo (No key required)

Sound Engine: Web Audio API (FM Synthesizer)

Analytics: Google Analytics 4 (GA4) + Google Tag Manager (GTM)

🚀 Quick Start (Local Setup)

The entire application is packed into a single, dependency-free HTML document to simplify hosting and local modification.

1. Download/Clone

git clone https://github.com/your-username/3d-geospatial-engine.git
cd 3d-geospatial-engine


2. Run a Local Server

Because the engine registers a PWA Service Worker and fetches cloud assets, it is highly recommended to run it through a local HTTP server instead of opening the file directly.

Using Python (Installed by default on macOS/Linux):

python3 -m http.server 8080


Using Node.js:

npm install -g serve
serve .


Using VS Code: Install the extension Live Server, right-click index.html, and select Open with Live Server.

Open http://localhost:8080 in your browser.

📦 Vercel & GitHub Pages Deployment

Deploying to Vercel (Recommended)

This engine is perfectly tailored for Vercel's zero-configuration static pipeline:

Push your repository to your GitHub account.

Sign in to your Vercel Dashboard.

Click Add New -> Project, then import your repository.

Keep the default settings and click Deploy. Vercel will serve your app and register its PWA assets on their global edge network.

Deploying to GitHub Pages

Go to your repository settings on GitHub.

Under the Pages menu on the left sidebar, locate Build and deployment.

Choose Deploy from a branch and select main (or your active branch) as the source, then click Save.

Your site will be online at https://your-username.github.io/your-repo-name/.

🛸 Cockpit Piloting Manual

Input Action

Command Outcome

Right-Click + Drag

Rotates camera bearing and pitch (3D orbit).

Scroll Wheel / Pinch Zoom

Changes distance altitude relative to coordinates.

Double Click Map Grid

Materializes the selected 3D structure and pops up its metadata tooltip.

Preset Warp Button

Fly directly to landmarks (Manhattan, Tokyo, Paris, Pyramids, Grand Canyon).

PWA Install Button

Prompts the host browser to install the engine as a native standalone app.

3D Sidebar Button

Switches the viewport instantly from flat 2D maps to 3D perspectives.

📁 Repository Structure

├── index.html        # Main self-contained application
├── README.md         # Documentation & Setup Guide
└── manifest.json     # (Optional) Static backup metadata manifest


🔒 Security, Analytics & Service Workers

Google Tag Manager: Standardized tracking hooks (GTM-PROD999) and Google Analytics (G-GEOQUANTUM) log tracking metrics automatically in the browser console.

Service Worker Caching: The script programmatically configures localized database stores mapping all CDNs (three.js, gltfloader, and maplibre) for fast startup and offline usability.

⚖️ License

Licensed under the MIT License. Build, customize, and share freely!