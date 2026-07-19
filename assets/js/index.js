let audioActive = true;
let orbitActive = false;
let map;
let activeDeployType = 'cyber-tower';
let entityScaleValue = 1.0;
let entityAltitudeValue = 0;
let activeEntities = [];
let activeLinks = [];
let activePoiMarkers = []; // Tracking POI markers specifically
let weatherSystem;
let threeLayerInstance;
let gltfLoaderInstance;

let anchorLngLat = [55.1565, 25.0768]; // Centered on Dubai Marina / Palm Jumeirah
let modelTransform = {};

// Custom Cursor Coordinate States
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;
let dotX = -100, dotY = -100;

// Active filters state
let poiLayersVisibility = {
    'Attractions': true,
    'Shopping': true,
    'Transit': true,
    'POI': true
};

const CATEGORY_COLORS = {
    'Energy': '#ffaa00',
    'Infrastructure': '#00ffcc',
    'Defense': '#ff00ff',
    'Research': '#8b5cf6'
};

const POI_CATEGORY_COLORS = {
    'Attractions': '#ff00ff',
    'Shopping': '#00ffcc',
    'Transit': '#8b5cf6',
    'POI': '#ffaa00'
};

// Custom Web App Manifest setup
(function setupPWAManifest() {
    try {
        const manifestObj = {
            "name": "3D Geospatial UAE Quantum Engine",
            "short_name": "UAEGeoQuantum",
            "description": "High-fidelity spatial telemetry matrix visualizer",
            "start_url": window.location.href,
            "display": "standalone",
            "orientation": "any",
            "background_color": "#030712",
            "theme_color": "#030712",
            "icons": [
                {
                    "src": "https://placehold.co/192x192/030712/00ffcc?text=UAE_GEO",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "https://placehold.co/512x512/030712/00ffcc?text=UAE_3D",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        };

        const manifestStr = JSON.stringify(manifestObj);
        const manifestBlob = new Blob([manifestStr], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        document.getElementById('pwa-manifest-link').setAttribute('href', manifestUrl);
    } catch (err) {
        console.warn("Dynamic PWA manifest initialization interrupted: ", err);
    }
})();

// Register Dynamic Service Worker to enable offline capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swContent = `
            const CACHE_NAME = 'geo-quantum-v5';
            const MAP_ASSETS = [
                'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css',
                'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js',
                'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
                'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
                'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js'
            ];

            self.addEventListener('install', (event) => {
                event.waitUntil(
                    caches.open(CACHE_NAME).then((cache) => {
                        return cache.addAll(MAP_ASSETS);
                    })
                );
            });

            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || fetch(event.request);
                    })
                );
            });
        `;

        const swBlob = new Blob([swContent], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(swBlob);

        navigator.serviceWorker.register(swUrl).then((registration) => {
            console.log('Quantum Matrix Service Worker operational scope: ', registration.scope);
        }).catch((error) => {
            console.log('Standalone Service Worker operational fallback initialized.');
        });
    });
}

// Custom Analytics Logger
function logTrackingEvent(eventName, params = {}) {
    console.log(`%c[ANALYTICS] %c${eventName}`, "color: #ff00ff; font-weight: bold;", "color: #00ffcc;", params);
    try {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                eventParameters: params
            });
        }
    } catch (err) {
        console.warn("Datalayer telemetry routing deferred:", err);
    }
}

// FM Synthesizer utilizing browser AudioContext
const SynthEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playTone(freq, type, duration, vol = 0.1) {
        if (!audioActive) return;
        try {
            this.init();
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.log("Audio synth blocked: ", e);
        }
    },
    triggerSpawn() {
        this.playTone(320, 'triangle', 0.1, 0.15);
        setTimeout(() => this.playTone(640, 'sine', 0.4, 0.12), 80);
    },
    triggerWarp() {
        this.playTone(180, 'sawtooth', 0.1, 0.15);
        setTimeout(() => this.playTone(380, 'sine', 0.2, 0.12), 80);
        setTimeout(() => this.playTone(760, 'sine', 0.5, 0.08), 160);
    },
    triggerLink() {
        this.playTone(440, 'sine', 0.08, 0.1);
        setTimeout(() => this.playTone(880, 'sine', 0.2, 0.08), 50);
    },
    triggerDelete() {
        this.playTone(400, 'triangle', 0.08, 0.15);
        setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.12), 60);
    },
    triggerClick() {
        this.playTone(880, 'sine', 0.05, 0.05);
    }
};

const preloaderLogs = [
    "Initializing hardware-accelerated UAE spatial nodes...",
    "Mapping coordinate projections (Dubai to Ras Al Khaimah)...",
    "Establishing real-time connection to Jebel Jais elevation arrays...",
    "Compiling procedural environment atmospheric filters...",
    "Loading GLTF/GLB 3D spatial loader engines...",
    "Assembling Google Tag Manager tracking nodes (GTM-PROD999)...",
    "Establishing secure connection to OpenStreetMap engine...",
    "PWA Standalone config verification sequence completed."
];

let currentLogIndex = 0;
let preloaderPercent = 0;

function updatePreloaderLog(text) {
    const container = document.getElementById('preloader-log-container');
    const logLine = document.createElement('div');
    logLine.innerHTML = `<span class="text-cyber-cyan font-bold">&gt;</span> ${text}`;
    container.appendChild(logLine);
    container.scrollTop = container.scrollHeight;
}

function runPreloaderStep() {
    if (preloaderPercent < 100) {
        preloaderPercent += Math.floor(Math.random() * 8) + 5;
        if (preloaderPercent > 100) preloaderPercent = 100;

        document.getElementById('preloader-progress-bar').style.width = `${preloaderPercent}%`;

        const maxStep = Math.floor((preloaderPercent / 100) * preloaderLogs.length);
        while (currentLogIndex < maxStep && currentLogIndex < preloaderLogs.length) {
            updatePreloaderLog(preloaderLogs[currentLogIndex]);
            currentLogIndex++;
        }

        setTimeout(runPreloaderStep, 100 + Math.random() * 100);
    } else {
        updatePreloaderLog("UAE ENGINE GRID ONLINE.");
        const actionBtn = document.getElementById('preloader-action-btn');
        actionBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        actionBtn.classList.add('opacity-100', 'translate-y-0');
    }
}

function engageCoreMatrix() {
    SynthEngine.init();
    SynthEngine.triggerWarp();

    const overlay = document.getElementById('preloader-overlay');
    overlay.classList.add('opacity-0', 'pointer-events-none', 'scale-110');
    setTimeout(() => {
        overlay.remove();
    }, 1000);

    showToast("ENGINE CONNECTED: Dubai Matrix online.");
    logTrackingEvent('System Engage', { status: 'Success' });
}

function toggleAudio() {
    audioActive = !audioActive;
    const status = document.getElementById('audio-status');
    const ind = document.getElementById('sfx-indicator');
    if (audioActive) {
        status.innerText = "ACTIVE";
        status.className = "text-cyber-cyan";
        ind.classList.remove('hidden');
    } else {
        status.innerText = "DISABLED";
        status.className = "text-slate-500";
        ind.classList.add('hidden');
    }
    SynthEngine.triggerClick();
    logTrackingEvent('Toggle Audio', { enabled: audioActive });
}

function toggleOrbitMode(active) {
    SynthEngine.triggerClick();
    orbitActive = active;
    document.getElementById('toggle-orbit').checked = active;
    if (active) {
        showToast("CINEMATIC ORBIT SEQUENCE ACTIVE");
    } else {
        showToast("Telemetry Orbit Stopped");
    }
    logTrackingEvent('Toggle Orbit Mode', { active });
}

function dismissHelp() {
    document.getElementById('help-modal').classList.add('hidden');
    SynthEngine.init();
    SynthEngine.triggerWarp();
    showToast("ENGINE CONNECTED: Initializing UAE Grid Map");
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    document.getElementById('custom-cursor-dot').style.opacity = '0';
    document.getElementById('custom-cursor-ring').style.opacity = '0';
});

document.addEventListener('mouseenter', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.getElementById('custom-cursor-dot').style.opacity = '1';
    document.getElementById('custom-cursor-ring').style.opacity = '1';
});

document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const isInteractive = target.closest('button') ||
        target.closest('a') ||
        target.closest('select') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.mapboxgl-ctrl') ||
        target.closest('.maplibregl-popup-close-button');

    const ring = document.getElementById('custom-cursor-ring');
    const dot = document.getElementById('custom-cursor-dot');

    if (isInteractive) {
        ring.style.width = '45px';
        ring.style.height = '45px';
        ring.style.borderColor = '#ff00ff';
        ring.style.backgroundColor = 'rgba(255, 0, 255, 0.05)';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.backgroundColor = '#ff00ff';
    } else {
        ring.style.width = '30px';
        ring.style.height = '30px';
        ring.style.borderColor = '#00ffcc';
        ring.style.backgroundColor = 'transparent';
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.backgroundColor = '#00ffcc';
    }
});

function animateCustomCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    const ring = document.getElementById('custom-cursor-ring');
    const dot = document.getElementById('custom-cursor-dot');

    if (ring && dot) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCustomCursor);
}
requestAnimationFrame(animateCustomCursor);

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('no-custom-cursor');
    document.getElementById('custom-cursor-dot').style.display = 'none';
    document.getElementById('custom-cursor-ring').style.display = 'none';
}

function handleCustomZoom(direction) {
    SynthEngine.triggerClick();
    if (!map) return;
    const currentZoom = map.getZoom();
    map.easeTo({
        zoom: direction === 'in' ? currentZoom + 1 : currentZoom - 1,
        duration: 400
    });
}

function toggle3DViewProjection() {
    SynthEngine.triggerClick();
    if (!map) return;
    const currentPitch = map.getPitch();
    const btn = document.getElementById('nav-btn-3d');

    if (currentPitch > 10) {
        map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
        btn.classList.remove('text-cyber-pink', 'border-cyber-pink/40', 'shadow-neon-pink');
        btn.classList.add('text-slate-400', 'border-white/10');
        btn.querySelector('span:last-child').innerText = 'OFF';
    } else {
        map.easeTo({ pitch: 60, bearing: -20, duration: 1000 });
        btn.classList.add('text-cyber-pink', 'border-cyber-pink/40', 'shadow-neon-pink');
        btn.classList.remove('text-slate-400', 'border-white/10');
        btn.querySelector('span:last-child').innerText = 'ON';
    }
}

let searchTimeout;
const searchInput = document.getElementById('search-location-input');
const searchResultsDiv = document.getElementById('autocomplete-results');
const clearBtn = document.getElementById('search-clear-btn');

searchInput.addEventListener('input', function () {
    const query = this.value.trim();
    clearTimeout(searchTimeout);

    if (query.length < 3) {
        searchResultsDiv.classList.add('hidden');
        clearBtn.classList.add('hidden');
        return;
    }

    clearBtn.classList.remove('hidden');

    searchTimeout = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
            .then(res => res.json())
            .then(data => {
                searchResultsDiv.innerHTML = '';
                if (data.length === 0) {
                    searchResultsDiv.innerHTML = `<div class="p-3 text-slate-500">No telemetry results located.</div>`;
                    searchResultsDiv.classList.remove('hidden');
                    return;
                }

                data.forEach(item => {
                    const opt = document.createElement('div');
                    opt.className = "p-3 hover:bg-cyber-cyan/15 hover:text-cyber-cyan border-b border-white/5 cursor-pointer truncate transition-colors";
                    opt.innerText = item.display_name;
                    opt.onclick = () => {
                        triggerSearchWarp(parseFloat(item.lon), parseFloat(item.lat), item.display_name);
                    };
                    searchResultsDiv.appendChild(opt);
                });
                searchResultsDiv.classList.remove('hidden');
            })
            .catch(err => {
                console.warn("Geocoding fetch failure: ", err);
            });
    }, 400);
});

function clearLocationSearch() {
    SynthEngine.triggerClick();
    searchInput.value = '';
    searchResultsDiv.innerHTML = '';
    searchResultsDiv.classList.add('hidden');
    clearBtn.classList.add('hidden');
}

function triggerSearchWarp(lon, lat, name) {
    SynthEngine.triggerWarp();
    searchResultsDiv.classList.add('hidden');

    if (!map) return;

    map.flyTo({
        center: [lon, lat],
        zoom: 15,
        pitch: 60,
        bearing: -20,
        duration: 3500
    });

    updateModelAnchor([lon, lat]);
    showToast(`WARPING VECTORS TO: ${name.split(',')[0].toUpperCase()}`);

    setTimeout(() => {
        activeLinks.forEach(link => {
            if (threeLayerInstance && threeLayerInstance.meshGroup) {
                threeLayerInstance.meshGroup.remove(link.line);
                threeLayerInstance.meshGroup.remove(link.pulse);
            }
        });
        activeLinks = [];

        activeEntities.forEach(ent => {
            if (threeLayerInstance && threeLayerInstance.meshGroup) {
                threeLayerInstance.meshGroup.remove(ent.group);
            }
            if (ent.marker) ent.marker.remove();
        });
        activeEntities = [];

        deployNewMesh('cyber-tower', [lon, lat], 0, 1.4, `${name.split(',')[0]} Main Core`, 'Infrastructure', 'Warp designated main network terminal.');
        deployNewMesh('orbital-ring', [lon + 0.002, lat - 0.001], 80, 1.0, `Dynamic Collector Array`, 'Energy', 'Harnessing spatial flux particles.');

        updateEntitiesDashboard();
    }, 3600);

    fetchCurrentWeather(lat, lon);
    logTrackingEvent('Search Location Warp', { lon, lat, name });
}

function updateModelAnchor(lngLat) {
    anchorLngLat = lngLat;
    if (typeof maplibregl !== 'undefined') {
        const merc = maplibregl.MercatorCoordinate.fromLngLat(anchorLngLat, 0);
        modelTransform = {
            translateX: merc.x,
            translateY: merc.y,
            translateZ: merc.z,
            scale: merc.meterInMercatorCoordinateUnits()
        };
    }
    document.getElementById('telemetry-anchor').innerText = `${lngLat[0].toFixed(4)}, ${lngLat[1].toFixed(4)}`;
}
updateModelAnchor(anchorLngLat);

let deferredPrompt;
const installBtn = document.getElementById('pwa-install-btn');
const mobileInstallBtn = document.getElementById('pwa-mobile-install-btn');
const badge = document.getElementById('pwa-mode-badge');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
    installBtn.classList.add('flex');
    mobileInstallBtn.classList.remove('hidden');

    const pwaPrompt = document.getElementById('pwa-prompt-notification');
    if (pwaPrompt) {
        pwaPrompt.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-20');
        pwaPrompt.classList.add('opacity-100', 'translate-y-0');
    }

    showToast("GEOSPATIAL ENGINE: Installation Available for Desktop/Mobile");
});

async function handleAppInstallation() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        showToast("CORE ENGINE INSTALLED SUCCESSFULLY");
        logTrackingEvent('App Installed', { platform: 'Browser' });
    }
    deferredPrompt = null;
    installBtn.classList.add('hidden');
    mobileInstallBtn.classList.add('hidden');

    dismissPwaPrompt();
}

function acceptCookieConsent() {
    SynthEngine.triggerClick();
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.classList.add('opacity-0', 'pointer-events-none', 'translate-y-20');
        setTimeout(() => banner.remove(), 500);
    }
    showToast("PRIVACY & TERMS POLICY ACCEPTED");
    logTrackingEvent('Terms Accepted', { consent: 'True' });
}

function dismissPwaPrompt() {
    SynthEngine.triggerClick();
    const pwaPrompt = document.getElementById('pwa-prompt-notification');
    if (pwaPrompt) {
        pwaPrompt.classList.add('opacity-0', 'pointer-events-none', 'translate-y-20');
        pwaPrompt.classList.remove('opacity-100', 'translate-y-0');
    }
}

installBtn.onclick = handleAppInstallation;
mobileInstallBtn.onclick = handleAppInstallation;

window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        badge.classList.remove('hidden');
    }
    runPreloaderStep();
    runChronometerTick();
    setInterval(runChronometerTick, 1000);
    fetchCurrentWeather(anchorLngLat[1], anchorLngLat[0]);
});

function runChronometerTick() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('live-time').innerText = `${hrs}:${mins}:${secs}`;

    const yr = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const dy = String(now.getDate()).padStart(2, '0');
    document.getElementById('live-date').innerText = `${yr}-${mo}-${dy} UTC${now.getTimezoneOffset() <= 0 ? '+' : ''}${Math.abs(Math.round(now.getTimezoneOffset() / -60))}`;
}

async function fetchCurrentWeather(lat, lng) {
    const weatherDescEl = document.getElementById('weather-desc');
    const weatherTempEl = document.getElementById('weather-temp');
    const weatherWindEl = document.getElementById('weather-wind');
    const iconContainer = document.getElementById('weather-icon-container');

    try {
        weatherDescEl.innerText = "POLLING WEATHER API...";
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        if (!response.ok) throw new Error("Weather service offline");

        const data = await response.json();
        const current = data.current_weather;
        if (!current) throw new Error("Incomplete weather payload");

        const temp = Math.round(current.temperature);
        const wind = Math.round(current.windspeed);
        const code = current.weathercode;

        weatherTempEl.innerText = `${temp}°C`;
        weatherWindEl.innerText = `${wind}km/h`;

        let desc = "Clear Skies";
        let particleMode = "cyan-sparks";
        let iconSvg = "";

        if (code === 0) {
            desc = "Clear Skies";
            particleMode = "cyan-sparks";
            iconSvg = `
                <svg class="w-7 h-7 text-amber-400 animate-spin" style="animation-duration: 18s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5" fill="rgba(251,191,36,0.2)"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
            `;
        } else if (code >= 1 && code <= 3) {
            desc = "Partly Cloudy";
            particleMode = "cyan-sparks";
            iconSvg = `
                <svg class="w-7 h-7 text-slate-300 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2" />
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="rgba(255,255,255,0.05)" />
                </svg>
            `;
        } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
            desc = "Rain Shower";
            particleMode = "golden-rain";
            iconSvg = `
                <div class="relative w-7 h-7 flex items-center justify-center">
                    <svg class="absolute w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                    </svg>
                    <div class="absolute bottom-1 w-4 h-2 flex justify-between">
                        <div class="w-0.5 h-1.5 bg-blue-400 animate-bounce"></div>
                        <div class="w-0.5 h-1.5 bg-blue-400 animate-bounce" style="animation-delay: 0.2s;"></div>
                    </div>
                </div>
            `;
        } else {
            desc = "Standard Climate";
            particleMode = "cyan-sparks";
            iconSvg = `
                <svg class="w-7 h-7 text-cyber-cyan animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="rgba(0,255,204,0.05)" />
                </svg>
            `;
        }

        weatherDescEl.innerText = desc;
        iconContainer.innerHTML = iconSvg;

        const weatherSelector = document.getElementById('weather-select');
        if (weatherSelector) {
            weatherSelector.value = particleMode;
            changeWeather(particleMode);
        }
        logTrackingEvent('Weather Synchronized', { desc, temp });
    } catch (err) {
        console.warn("Weather fetch bypassed:", err);
        weatherDescEl.innerText = "STABLE";
        weatherTempEl.innerText = "32°C";
        weatherWindEl.innerText = "8km/h";
        iconContainer.innerHTML = `
            <svg class="w-7 h-7 text-cyber-cyan animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
            </svg>
        `;
    }
}

function getThreeCoordinates(lng, lat, altitudeMeters = 0) {
    const merc = maplibregl.MercatorCoordinate.fromLngLat([lng, lat], altitudeMeters);
    const dx = merc.x - modelTransform.translateX;
    const dy = merc.y - modelTransform.translateY;
    const dz = merc.z - modelTransform.translateZ;
    return new THREE.Vector3(dx / modelTransform.scale, dz / modelTransform.scale, dy / modelTransform.scale);
}

const SECTOR_PRESETS = {
    dubai: {
        center: [55.2708, 25.2048],
        zoom: 15,
        pitch: 62,
        bearing: -25,
        title: 'Dubai Downtown Matrix',
        initEntities: [
            { type: 'cyber-tower', offset: [0, 0], altitude: 0, scale: 1.6, title: "Burj Khalifa Apex Core", category: "Infrastructure", desc: "Dynamic server router core." },
            { type: 'orbital-ring', offset: [0.003, -0.002], altitude: 150, scale: 1.2, title: "Downtown Collector Node", category: "Energy", desc: "Holographic tracking node." }
        ],
        pois: [
            {
                category: "Attractions",
                lngLat: [55.2744, 25.1972],
                title: "The Dubai Fountain Show",
                desc: "Visual spectacular combining neon laser displays and synchronized audio frequencies.",
                images: [
                    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1549944850-84e00be4115b?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/M166_4r0Lsc",
                phone: "+97143661688",
                web: "https://www.thedubaifountain.com",
                social: { insta: "https://instagram.com/dubai", fb: "https://facebook.com/dubai", x: "https://x.com/dubai" }
            },
            {
                category: "Shopping",
                lngLat: [55.2784, 25.1986],
                title: "The Dubai Mall Matrix",
                desc: "High density quantum luxury retail terminal hosting over 1200 commercial nodes.",
                images: [
                    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/Z0XGg4L3uQA",
                phone: "+971800382246255",
                web: "https://thedubaimall.com",
                social: { insta: "https://instagram.com/thedubaimall", fb: "https://facebook.com/thedubaimall", x: "https://x.com/thedubaimall" }
            },
            {
                category: "Transit",
                lngLat: [55.2690, 25.2015],
                title: "Burj Khalifa Metro Terminal",
                desc: "High speed pneumatic mag-level transit hub connecting Dubai metropolitan zones.",
                images: [
                    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/5D2t0bOatcQ",
                phone: "+9718009090",
                web: "https://rta.ae",
                social: { insta: "https://instagram.com/rta_dubai", fb: "https://facebook.com/rtadubai", x: "https://x.com/rta_dubai" }
            }
        ]
    },
    abudhabi: {
        center: [54.3548, 24.4741],
        zoom: 14.8,
        pitch: 60,
        bearing: 30,
        title: 'Abu Dhabi Capitol Sector',
        initEntities: [
            { type: 'holo-crystal', offset: [0, 0], altitude: 50, scale: 1.5, title: "Marina Spire Focus", category: "Research", desc: "Secured data storage beacon." },
            { type: 'cyber-tower', offset: [-0.003, 0.003], altitude: 0, scale: 1.4, title: "Corniche Sector Gateway", category: "Defense", desc: "Friction atmospheric radar array." }
        ],
        pois: [
            {
                category: "Attractions",
                lngLat: [54.3640, 24.4810],
                title: "Abu Dhabi Corniche Beach",
                desc: "Seaside coastal park hosting continuous security patrols and dynamic monitoring systems.",
                images: [
                    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/W9LgG_2FpY8",
                phone: "+97126786000",
                web: "https://visitabudhabi.ae",
                social: { insta: "https://instagram.com/visitabudhabi", fb: "https://facebook.com/visitabudhabi", x: "https://x.com/visitabudhabi" }
            },
            {
                category: "POI",
                lngLat: [54.3210, 24.4340],
                title: "Sheikh Zayed Grand Mosque",
                desc: "Architectural masterpiece with capacity for over 41,000 worshippers.",
                images: [
                    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/XmZ_i7vS6R0",
                phone: "+97124191919",
                web: "https://www.szgmc.gov.ae",
                social: { insta: "https://instagram.com/szgmc_ae", fb: "https://facebook.com/szgmc", x: "https://x.com/szgmc" }
            }
        ]
    },
    sharjah: {
        center: [55.3908, 25.3211],
        zoom: 15,
        pitch: 58,
        bearing: 110,
        title: 'Sharjah Majaz Lagoon Sector',
        initEntities: [
            { type: 'orbital-ring', offset: [0, 0], altitude: 100, scale: 1.4, title: "Majaz Water Flux Ring", category: "Energy", desc: "Hydro-thermal collector terminal." }
        ],
        pois: [
            {
                category: "Attractions",
                lngLat: [55.3920, 25.3225],
                title: "Al Majaz Waterfront",
                desc: "Panoramic lagoon hub holding visual installations, sonic musical fountains, and family play coordinates.",
                images: [
                    "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/vAnQ8kO51d8",
                phone: "+97165110555",
                web: "https://almajaz.ae",
                social: { insta: "https://instagram.com/sharjah", fb: "https://facebook.com/sharjah", x: "https://x.com/sharjah" }
            },
            {
                category: "Shopping",
                lngLat: [55.3888, 25.3340],
                title: "Central Souk Sharjah",
                desc: "Historic architecture node housing traditional merchants under iconic blue vaulted domes.",
                images: [
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/XyY39fC25s4",
                phone: "+97165111111",
                web: "https://sharjahcommerce.ae",
                social: { insta: "https://instagram.com/sharjahcommerce", fb: "https://facebook.com/sharjahcommerce", x: "https://x.com/sharjahcommerce" }
            }
        ]
    },
    rasalkhaimah: {
        center: [56.0286, 25.8812],
        zoom: 14.5,
        pitch: 52,
        bearing: -15,
        title: 'Ras Al Khaimah Dhayah Fort Sector',
        initEntities: [
            { type: 'holo-crystal', offset: [0, 0], altitude: 80, scale: 1.3, title: "Fort Sentinel Focus", category: "Research", desc: "Securing historic spatial archives." }
        ],
        pois: [
            {
                category: "Attractions",
                lngLat: [56.0298, 25.8825],
                title: "Dhayah Fort Lookout",
                desc: "Historic 16th century hilltop battlefort offering sweeping panoramas of coastal oasis domains.",
                images: [
                    "https://images.unsplash.com/photo-1582730147233-0df152015091?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/0G6TIn1y3C0",
                phone: "+97172338998",
                web: "https://visitrasalkhaimah.com",
                social: { insta: "https://instagram.com/visitrasalkhaimah", fb: "https://facebook.com/visitrasalkhaimah", x: "https://x.com/visitrasalkhaimah" }
            }
        ]
    },
    jebeljais: {
        center: [56.1245, 25.9452],
        zoom: 12.8,
        pitch: 72,
        bearing: 85,
        title: 'UAE Jebel Jais Ridge',
        initEntities: [
            { type: 'holo-crystal', offset: [0, 0], altitude: 2000, scale: 2.2, title: "Jebel Jais Apex Crystal", category: "Research", desc: "Prismatic altitude monitoring core." },
            { type: 'orbital-ring', offset: [0.012, -0.008], altitude: 2200, scale: 1.8, title: "Highwind Turbine Array", category: "Energy", desc: "Harnessing dynamic mountain draft flow fields." }
        ],
        pois: [
            {
                category: "Attractions",
                lngLat: [56.1265, 25.9468],
                title: "Jais Flight Zipline Peak",
                desc: "The world's longest dynamic zipline, cutting through atmospheric coordinates at up to 150 km/h.",
                images: [
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                ],
                youtube: "https://www.youtube.com/embed/G6j5n08q_Xw",
                phone: "+97172046250",
                web: "https://visitjebeljais.com",
                social: { insta: "https://instagram.com/jebeljais", fb: "https://facebook.com/jebeljais", x: "https://x.com/jebeljais" }
            }
        ]
    }
};

window.onload = function () {
    try {
        if (typeof maplibregl === 'undefined') {
            throw new Error("Maplibre library offline");
        }

        map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: anchorLngLat,
            zoom: 15,
            pitch: 60,
            bearing: -20,
            antialias: true
        });
    } catch (e) {
        console.warn("WebGL blocked: ", e);
        document.getElementById('map').innerHTML = `
            <div class="h-full w-full flex items-center justify-center p-6 bg-slate-950 text-center">
                <div class="glass-panel border-cyber-pink/40 p-8 rounded-2xl max-w-md">
                    <span class="text-3xl">⚠️</span>
                    <h3 class="text-white font-mono font-bold uppercase mt-4 mb-2 text-cyber-pink">WebGL Blocked</h3>
                    <p class="text-xs text-slate-400">Maplibre GL JS requires hardware acceleration to map dynamic coordinate planes.</p>
                </div>
            </div>
        `;
        showToast("Engine offline: WebGL context disabled");
        return;
    }

    map.on('style.load', function () {
        setupTerrain();
        setupBuildings();
        registerThreeCustomLayer();
    });

    map.on('dblclick', function (e) {
        e.originalEvent.preventDefault();
        const coordinates = [e.lngLat.lng, e.lngLat.lat];

        const titleInput = document.getElementById('input-entity-title').value.trim() || `Node_${Math.floor(100 + Math.random() * 900)}`;
        const categoryInput = document.getElementById('select-entity-category').value;
        const descInput = document.getElementById('input-entity-desc').value.trim() || "Active quantum telemetry core.";
        const customGlbUrl = document.getElementById('input-glb-url').value.trim();

        deployNewMesh(
            activeDeployType,
            coordinates,
            entityAltitudeValue,
            entityScaleValue,
            titleInput,
            categoryInput,
            descInput,
            customGlbUrl
        );

        document.getElementById('input-entity-title').value = "";
        document.getElementById('input-entity-desc').value = "";
    });

    map.on('moveend', function () {
        const center = map.getCenter();
        fetchCurrentWeather(center.lat, center.lng);
    });

    const sliderScale = document.getElementById('slider-entity-scale');
    sliderScale.oninput = function () {
        entityScaleValue = parseFloat(this.value);
        document.getElementById('label-entity-scale').innerText = entityScaleValue.toFixed(1) + 'x';
    };

    const sliderAlt = document.getElementById('slider-entity-altitude');
    sliderAlt.oninput = function () {
        entityAltitudeValue = parseInt(this.value);
        document.getElementById('label-entity-altitude').innerText = entityAltitudeValue + 'm';
    };

    setupFpsCounter();

    Fancybox.bind("[data-fancybox]", {
        dragToClose: true,
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["slideshow", "download", "thumbs", "close"],
            }
        }
    });
};

function setupTerrain() {
    if (!map) return;
    try {
        map.addSource('terrain-dem-src', {
            type: 'raster-dem',
            tiles: ['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 14
        });
        if (document.getElementById('toggle-terrain').checked) {
            map.setTerrain({ source: 'terrain-dem-src', exaggeration: 1.5 });
        }
    } catch (err) {
        console.log("DEM Terrain failure: ", err);
    }
}

function toggleTerrain(active) {
    SynthEngine.triggerClick();
    if (!map) return;
    try {
        if (!map.getSource('terrain-dem-src')) {
            setupTerrain();
        }
        if (active) {
            map.setTerrain({ source: 'terrain-dem-src', exaggeration: 1.5 });
            showToast("3D Elevation Map (DEM) layers enabled");
        } else {
            map.setTerrain(null);
            showToast("Flat Cartesian projection active");
        }
        logTrackingEvent('Toggle Terrain', { active });
    } catch (err) {
        showToast("Terrain adjustment bypassed");
    }
}

function setupBuildings() {
    if (!map) return;
    try {
        const styleLayers = map.getStyle().layers;
        let buildingLayerExists = styleLayers.some(layer => layer.id === '3d-buildings');
        if (!buildingLayerExists) {
            map.addLayer({
                'id': '3d-buildings',
                'source': 'openmaptiles',
                'source-layer': 'building',
                'type': 'fill-extrusion',
                'minzoom': 13,
                'paint': {
                    'fill-extrusion-color': '#111827',
                    'fill-extrusion-height': ['get', 'render_height'],
                    'fill-extrusion-base': ['get', 'render_min_height'],
                    'fill-extrusion-opacity': 0.6
                }
            });
        }
    } catch (e) {
        console.log("Extrusion layer maps built.");
    }
}

function toggleBuildings(active) {
    SynthEngine.triggerClick();
    if (!map) return;
    try {
        const mapLayer = map.getLayer('3d-buildings');
        if (mapLayer) {
            map.setLayoutProperty('3d-buildings', 'visibility', active ? 'visible' : 'none');
        }
        showToast(`Extruded structures: ${active ? 'ENABLED' : 'DISABLED'}`);
        logTrackingEvent('Toggle Buildings', { active });
    } catch (err) {
        showToast("Building extrusions toggled");
    }
}

function registerThreeCustomLayer() {
    if (!map) return;
    if (map.getLayer('threejs-layer')) {
        map.removeLayer('threejs-layer');
    }

    threeLayerInstance = {
        id: 'threejs-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (mapInstance, gl) {
            this.scene = new THREE.Scene();
            this.camera = new THREE.Camera();

            this.renderer = new THREE.WebGLRenderer({
                canvas: mapInstance.getCanvas(),
                context: gl,
                antialias: true
            });
            this.renderer.autoClear = false;

            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            this.scene.add(this.ambientLight);

            this.spotLight = new THREE.DirectionalLight(0x00ffcc, 1.8);
            this.spotLight.position.set(2000, 4000, 2000);
            this.scene.add(this.spotLight);

            this.meshGroup = new THREE.Group();
            this.scene.add(this.meshGroup);

            gltfLoaderInstance = new THREE.GLTFLoader();

            initWeatherSystem(this.scene);
            createDefaultPresetMeshes('dubai');
            initAnimatedMobileAssets(this.scene);
        },
        render: function (gl, matrix) {
            const time = Date.now() * 0.001;

            animateCustomEntities(time);
            animateWeatherParticles();
            animateMobileAssets(time);

            if (orbitActive && map) {
                map.setBearing(map.getBearing() + 0.06);
            }

            const projMatrix = new THREE.Matrix4().fromArray(matrix);
            const transformMatrix = new THREE.Matrix4()
                .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
                .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
                .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

            this.camera.projectionMatrix = projMatrix.multiply(transformMatrix);
            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
            map.triggerRepaint();
        }
    };

    map.addLayer(threeLayerInstance);
}

const maxParticlesCount = 1500;
let particlesGeometry, particlesMesh;
let particlePositions, particleVelocities;
let weatherMode = "cyan-sparks";

function initWeatherSystem(scene) {
    particlesGeometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(maxParticlesCount * 3);
    particleVelocities = new Float32Array(maxParticlesCount * 3);
    const colors = new Float32Array(maxParticlesCount * 3);

    for (let i = 0; i < maxParticlesCount; i++) {
        const radiusRange = 2500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const r = Math.random() * radiusRange;
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = Math.random() * 800;
        particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.8;

        particleVelocities[i * 3] = (Math.random() - 0.5) * 1.5;
        particleVelocities[i * 3 + 1] = -0.5 - Math.random() * 1.5;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,255,204,0.8)');
    grad.addColorStop(1, 'rgba(0,255,204,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const pTexture = new THREE.CanvasTexture(canvas);
    const pMaterial = new THREE.PointsMaterial({
        size: 8,
        map: pTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    particlesMesh = new THREE.Points(particlesGeometry, pMaterial);
    scene.add(particlesMesh);
}

function animateWeatherParticles() {
    if (!particlesMesh || weatherMode === "none") {
        particlesMesh.visible = false;
        return;
    }
    particlesMesh.visible = true;

    const positions = particlesGeometry.attributes.position.array;
    const colors = particlesGeometry.attributes.color.array;

    for (let i = 0; i < maxParticlesCount; i++) {
        if (weatherMode === "cyan-sparks") {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            const angle = 0.005;

            positions[i * 3] = x * Math.cos(angle) - z * Math.sin(angle);
            positions[i * 3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);
            positions[i * 3 + 1] += 0.3;
            if (positions[i * 3 + 1] > 1000) {
                positions[i * 3 + 1] = 0;
            }

            colors[i * 3] = 0.0;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;

        } else if (weatherMode === "golden-rain") {
            positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * 4;
            positions[i * 3] += particleVelocities[i * 3] * 0.5;

            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 800 + Math.random() * 200;
            }

            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.6 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.0;

        } else if (weatherMode === "blizzard") {
            positions[i * 3] += 4.5 + particleVelocities[i * 3];
            positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * 0.8;

            if (positions[i * 3] > 1800) {
                positions[i * 3] = -1800;
            }
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 800;
            }

            colors[i * 3] = 0.8;
            colors[i * 3 + 1] = 0.5;
            colors[i * 3 + 2] = 1.0;
        }
    }

    particlesGeometry.attributes.position.needsUpdate = true;
    particlesGeometry.attributes.color.needsUpdate = true;
}

function changeWeather(type) {
    weatherMode = type;
    const weatherSelector = document.getElementById('weather-select');
    if (weatherSelector && weatherSelector.value !== type) {
        weatherSelector.value = type;
    }
}

let mobileAssetsGroup;
let animatedCars = [];
let animatedFlights = [];
let animatedHeli = null;
let animatedBalloons = [];

function initAnimatedMobileAssets(scene) {
    mobileAssetsGroup = new THREE.Group();
    scene.add(mobileAssetsGroup);

    for (let i = 0; i < 20; i++) {
        const carGeom = new THREE.BoxGeometry(4, 2, 8);
        const carMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 });
        const car = new THREE.Mesh(carGeom, carMat);

        const head = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xffffaa }));
        head.position.set(0, 0, 4.1);
        const tail = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        tail.position.set(0, 0, -4.1);
        car.add(head);
        car.add(tail);

        mobileAssetsGroup.add(car);
        animatedCars.push({
            mesh: car,
            angle: Math.random() * Math.PI * 2,
            radius: 200 + Math.random() * 300,
            speed: 0.005 + Math.random() * 0.005,
            height: 1
        });
    }

    for (let i = 0; i < 3; i++) {
        const flightGroup = new THREE.Group();
        const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 18, 8), new THREE.MeshBasicMaterial({ color: 0xcccccc }));
        fuselage.rotation.x = Math.PI / 2;
        const wings = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 4), new THREE.MeshBasicMaterial({ color: 0xbbbbbb }));
        flightGroup.add(fuselage);
        flightGroup.add(wings);

        const portLight = new THREE.Mesh(new THREE.SphereGeometry(0.6), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        portLight.position.set(-11, 0, 0);
        const starboardLight = new THREE.Mesh(new THREE.SphereGeometry(0.6), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        starboardLight.position.set(11, 0, 0);
        flightGroup.add(portLight);
        flightGroup.add(starboardLight);

        mobileAssetsGroup.add(flightGroup);
        animatedFlights.push({
            group: flightGroup,
            portLight,
            starboardLight,
            x: (Math.random() - 0.5) * 1500,
            z: (Math.random() - 0.5) * 1500,
            y: 400 + Math.random() * 200,
            speedX: 1.5 + Math.random(),
            speedZ: (Math.random() - 0.5) * 0.8
        });
    }

    const heliGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111827 }));
    body.scale.set(1, 0.8, 1.8);
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.1, 1), new THREE.MeshBasicMaterial({ color: 0x00ffcc }));
    rotor.position.y = 5.5;
    heliGroup.add(body);
    heliGroup.add(rotor);

    const lightGeom = new THREE.CylinderGeometry(0.5, 35, 180, 16, 1, true);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
    const searchlight = new THREE.Mesh(lightGeom, lightMat);
    searchlight.position.y = -90;
    searchlight.rotation.x = 0.1;
    heliGroup.add(searchlight);

    mobileAssetsGroup.add(heliGroup);
    animatedHeli = { group: heliGroup, rotor, searchlight, angle: 0, hoverHeight: 120 };

    for (let i = 0; i < 4; i++) {
        const balloonGroup = new THREE.Group();
        const envelope = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
        envelope.scale.set(1, 1.4, 1);
        envelope.position.y = 12;
        const basket = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshBasicMaterial({ color: 0x475569 }));
        balloonGroup.add(envelope);
        balloonGroup.add(basket);

        mobileAssetsGroup.add(balloonGroup);
        animatedBalloons.push({
            group: balloonGroup,
            envelope,
            x: (Math.random() - 0.5) * 600,
            z: (Math.random() - 0.5) * 600,
            y: 180 + Math.random() * 80,
            speed: 0.1 + Math.random() * 0.1,
            burnTimer: Math.random() * Math.PI
        });
    }
}

function animateMobileAssets(time) {
    if (!mobileAssetsGroup) return;

    animatedCars.forEach(car => {
        car.angle += car.speed;
        car.mesh.position.set(Math.cos(car.angle) * car.radius, car.height, Math.sin(car.angle) * car.radius);
        car.mesh.rotation.y = -car.angle + Math.PI / 2;
    });

    animatedFlights.forEach(flight => {
        flight.x += flight.speedX;
        flight.z += flight.speedZ;

        if (flight.x > 1000) flight.x = -1000;
        flight.group.position.set(flight.x, flight.y, flight.z);

        const blink = Math.floor(time * 5) % 2 === 0;
        flight.portLight.visible = blink;
        flight.starboardLight.visible = blink;
    });

    if (animatedHeli) {
        animatedHeli.angle += 0.015;
        const hX = Math.cos(animatedHeli.angle) * 450;
        const hZ = Math.sin(animatedHeli.angle * 0.5) * 200;
        animatedHeli.group.position.set(hX, animatedHeli.hoverHeight + Math.sin(time * 2) * 15, hZ);
        animatedHeli.rotor.rotation.y += 0.6;
        animatedHeli.searchlight.rotation.z = Math.sin(time) * 0.15;
    }

    animatedBalloons.forEach(b => {
        b.x += b.speed;
        b.group.position.set(b.x, b.y + Math.sin(time * 0.5) * 8, b.z);
        if (b.x > 800) b.x = -800;

        b.burnTimer += 0.05;
        const glow = 0.6 + Math.sin(b.burnTimer * 4) * 0.4;
        b.envelope.material.color.setHSL(0.08, 1.0, 0.4 + glow * 0.15);
    });
}

function selectDeployType(type) {
    SynthEngine.triggerClick();
    activeDeployType = type;

    const cards = ['cyber-tower', 'holo-crystal', 'orbital-ring', 'custom-glb'];
    cards.forEach(c => {
        const el = document.getElementById(`deploy-${c.split('-')[1] || c}`);
        if (c === type) {
            el.classList.add('bg-cyber-cyan/10', 'border-cyber-cyan', 'border-2');
            el.classList.remove('border-white/10', 'border');
        } else {
            el.classList.remove('bg-cyber-cyan/10', 'border-cyber-cyan', 'border-2');
            el.classList.add('border-white/10', 'border');
        }
    });

    const glbInput = document.getElementById('glb-input-container');
    if (type === 'custom-glb') {
        glbInput.classList.remove('hidden');
    } else {
        glbInput.classList.add('hidden');
    }
}

function deployNewMesh(type, lngLat, altitude = 0, scale = 1.0, title = "", category = "Infrastructure", description = "Operational core node.", glbUrl = "") {
    if (!threeLayerInstance) return;

    const id = 'entity-' + Date.now();
    const group = new THREE.Group();
    const pos = getThreeCoordinates(lngLat[0], lngLat[1], altitude);
    group.position.copy(pos);

    const data = {
        id: id,
        type: type,
        lngLat: lngLat,
        altitude: altitude,
        scale: scale,
        group: group,
        title: title || `${type.toUpperCase().replace("-", " ")} Node`,
        category: category,
        description: description,
        spawnTime: new Date().toLocaleTimeString(),
        marker: null
    };

    if (type === 'cyber-tower') {
        const outerGeom = new THREE.CylinderGeometry(14 * scale, 24 * scale, 160 * scale, 6, 5, true);
        const outerMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.4 });
        const outerMesh = new THREE.Mesh(outerGeom, outerMat);
        outerMesh.position.y = (160 * scale) / 2;
        group.add(outerMesh);

        const coreGeom = new THREE.CylinderGeometry(4 * scale, 4 * scale, 150 * scale, 12);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        coreMesh.position.y = (150 * scale) / 2;
        group.add(coreMesh);

        const laserGeom = new THREE.CylinderGeometry(0.3 * scale, 1.5 * scale, 2000, 4, 1, true);
        const laserMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
        const laserMesh = new THREE.Mesh(laserGeom, laserMat);
        laserMesh.position.y = (160 * scale) + 1000;
        group.add(laserMesh);

        const ringGeom = new THREE.TorusGeometry(32 * scale, 1.5 * scale, 8, 32);
        const ringMesh = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true }));
        ringMesh.rotation.x = Math.PI / 2;
        group.add(ringMesh);

        data.animate = (time) => {
            outerMesh.rotation.y = time * 0.15;
            coreMat.opacity = 0.5 + Math.sin(time * 6) * 0.3;
            ringMesh.rotation.z = -time * 0.8;
            ringMesh.position.y = (80 + Math.sin(time * 2) * 55) * scale;
        };

    } else if (type === 'holo-crystal') {
        const crystalGeom = new THREE.OctahedronGeometry(22 * scale, 1);
        const crystalMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0x663300, transparent: true, opacity: 0.75, shininess: 90, flatShading: true });
        const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
        crystalMesh.position.y = 35 * scale;
        group.add(crystalMesh);

        const ringGeom = new THREE.TorusGeometry(35 * scale, 1.0 * scale, 8, 48);
        const ringMesh = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.5, wireframe: true }));
        ringMesh.position.y = 35 * scale;
        ringMesh.rotation.x = Math.PI / 3;
        group.add(ringMesh);

        data.animate = (time) => {
            crystalMesh.rotation.y = time * 0.4;
            crystalMesh.rotation.x = time * 0.2;
            crystalMesh.position.y = (35 + Math.sin(time * 2.5) * 12) * scale;
            ringMesh.rotation.z = -time * 0.6;
            ringMesh.position.y = crystalMesh.position.y;
        };

    } else if (type === 'orbital-ring') {
        const sphereMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(12 * scale, 0), new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }));
        sphereMesh.position.y = 30 * scale;
        group.add(sphereMesh);

        const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(40 * scale, 1.8 * scale, 8, 40), new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.7 }));
        torusMesh.position.y = 30 * scale;
        torusMesh.rotation.x = Math.PI / 2;
        group.add(torusMesh);

        data.animate = (time) => {
            sphereMesh.rotation.y = time * 1.2;
            torusMesh.rotation.y = time * 0.5;
        };

    } else if (type === 'custom-glb') {
        const actualUrl = glbUrl || "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxVertexColors/glTF-Binary/BoxVertexColors.glb";
        showToast("FETCHING GLB...");

        gltfLoaderInstance.load(actualUrl,
            function (gltf) {
                const glbMesh = gltf.scene;
                glbMesh.scale.set(15 * scale, 15 * scale, 15 * scale);
                glbMesh.position.y = 0;
                group.add(glbMesh);
                data.animate = (time) => { glbMesh.rotation.y = time * 0.3; };
                showToast(`LOADED GLB RESOURCE`);
            },
            null,
            function (error) {
                showToast("GLB OFFLINE: Materializing Fallback");
                const fallGeom = new THREE.BoxGeometry(20 * scale, 20 * scale, 20 * scale);
                const fallMat = new THREE.MeshPhongMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 });
                const coreFall = new THREE.Mesh(fallGeom, fallMat);
                coreFall.position.y = 20 * scale;
                group.add(coreFall);
                data.animate = (time) => { coreFall.rotation.y = -time * 0.5; };
            }
        );
    }

    threeLayerInstance.meshGroup.add(group);

    const markerEl = document.createElement('div');
    markerEl.className = 'relative w-8 h-8 flex items-center justify-center cursor-pointer';

    const catColor = CATEGORY_COLORS[category] || '#00ffcc';
    markerEl.innerHTML = `
        <div class="marker-ripple-effect absolute w-full h-full rounded-full opacity-60" style="background-color: ${catColor};"></div>
        <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow-lg relative z-10" style="background-color: ${catColor};"></div>
    `;

    const popupHtml = `
        <div class="font-mono text-left p-4 space-y-2 select-text">
            <div class="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                <span class="text-[9px] font-bold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-1.5 py-0.5 rounded tracking-widest">${category.toUpperCase()}</span>
                <span class="text-[8px] text-slate-500 font-mono">${id.replace("entity-", "#")}</span>
            </div>
            <div class="text-xs font-bold text-white tracking-wide uppercase">${data.title}</div>
            <p class="text-[10px] text-slate-300 leading-relaxed font-sans normal-case">${data.description}</p>
            <div class="border-t border-white/5 pt-1.5 mt-2 flex justify-between text-[8px] text-slate-500">
                <span>LAT: ${lngLat[1].toFixed(5)}</span>
                <span>LNG: ${lngLat[0].toFixed(5)}</span>
            </div>
        </div>
    `;

    const popup = new maplibregl.Popup({ offset: 15, closeOnClick: false }).setHTML(popupHtml);

    const mapMarker = new maplibregl.Marker({ element: markerEl })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map);

    data.marker = mapMarker;

    if (activeEntities.length > 0) {
        const prevEntity = activeEntities[activeEntities.length - 1];
        createSpatialLink(prevEntity, data);
    }

    activeEntities.push(data);
    SynthEngine.triggerSpawn();
    updateEntitiesDashboard();
    logTrackingEvent('Deploy Mesh', { type, coordinates: lngLat, title });
}

function createSpatialLink(entity1, entity2) {
    if (!threeLayerInstance) return;

    const pos1 = getThreeCoordinates(entity1.lngLat[0], entity1.lngLat[1], entity1.altitude);
    const pos2 = getThreeCoordinates(entity2.lngLat[0], entity2.lngLat[1], entity2.altitude);

    const distance = pos1.distanceTo(pos2);
    const midPoint = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    const curveHeight = (distance * 0.3) + 40;
    const controlPoint = midPoint.clone();
    controlPoint.y += curveHeight;

    const curve = new THREE.QuadraticBezierCurve3(pos1, controlPoint, pos2);
    const points = curve.getPoints(50);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineDashedMaterial({
        color: 0x00ffcc,
        dashSize: 4,
        gapSize: 2,
        transparent: true,
        opacity: 0.35
    });
    const linkLine = new THREE.Line(lineGeometry, lineMaterial);
    linkLine.computeLineDistances();
    threeLayerInstance.meshGroup.add(linkLine);

    const pulseGeometry = new THREE.SphereGeometry(3 * Math.min(entity1.scale, entity2.scale, 1.2), 8, 8);
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const pulseTraveler = new THREE.Mesh(pulseGeometry, pulseMaterial);
    threeLayerInstance.meshGroup.add(pulseTraveler);

    const linkData = {
        id: `link-${entity1.id}-${entity2.id}`,
        entity1Id: entity1.id,
        entity2Id: entity2.id,
        line: linkLine,
        pulse: pulseTraveler,
        curve: curve,
        progress: Math.random()
    };

    activeLinks.push(linkData);
    SynthEngine.triggerLink();
}

function animateCustomEntities(time) {
    activeEntities.forEach(ent => {
        if (typeof ent.animate === 'function') {
            ent.animate(time);
        }
    });

    activeLinks.forEach(link => {
        link.progress += 0.008;
        if (link.progress > 1.0) link.progress = 0;
        const newPos = link.curve.getPointAt(link.progress);
        link.pulse.position.copy(newPos);
    });
}

function deployAtUserGPS() {
    SynthEngine.triggerClick();
    if (!navigator.geolocation) {
        showToast("GEOLOCATION DENIED");
        return;
    }

    showToast("Searching GPS metrics...");
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (!map) return;
            updateModelAnchor([lng, lat]);
            map.flyTo({ center: [lng, lat], zoom: 16, pitch: 58, duration: 2500 });

            setTimeout(() => {
                deployNewMesh('orbital-ring', [lng, lat], 0, 1.3, "LIVE GPS BEACON", "Infrastructure", `Located at lat ${lat.toFixed(4)}, lng ${lng.toFixed(4)}.`);
                showToast("DEPLOYED BEACON AT YOUR ACTUAL POSITION");
            }, 1200);

            fetchCurrentWeather(lat, lng);
        },
        () => { showToast("GPS FAIL: Authorize permission"); },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function updateEntitiesDashboard() {
    const listEl = document.getElementById('entities-list');
    const counterEl = document.getElementById('entities-count');
    const emptyEl = document.getElementById('empty-entities-state');

    document.getElementById('telemetry-meshes').innerText = activeEntities.length;
    counterEl.innerText = `${activeEntities.length} Deployed`;

    if (activeEntities.length === 0) {
        emptyEl.classList.remove('hidden');
        Array.from(listEl.querySelectorAll('.entity-item')).forEach(el => el.remove());
        return;
    }
    emptyEl.classList.add('hidden');

    const existingItems = Array.from(listEl.querySelectorAll('.entity-item'));
    const activeIds = activeEntities.map(e => e.id);

    existingItems.forEach(item => {
        if (!activeIds.includes(item.dataset.id)) item.remove();
    });

    activeEntities.forEach((ent, index) => {
        let node = listEl.querySelector(`[data-id="${ent.id}"]`);
        const catColor = CATEGORY_COLORS[ent.category] || '#00ffcc';
        if (!node) {
            node = document.createElement('div');
            node.className = "entity-item p-2.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between text-[11px] font-mono group hover:bg-cyber-cyan/5 hover:border-cyber-cyan/30 transition-all";
            node.dataset.id = ent.id;
            node.innerHTML = `
                <div class="cursor-pointer flex-1 min-w-0 mr-2" onclick="zoomToEntity(${index})">
                    <div class="flex items-center gap-1.5 text-white font-bold uppercase text-[10px]">
                        <span class="h-2 w-2 rounded-full" style="background-color: ${catColor};"></span>
                        <span class="truncate max-w-[130px] text-slate-100">${ent.title}</span>
                    </div>
                    <span class="text-[9px] text-slate-400 block truncate font-sans">${ent.description}</span>
                </div>
                <button onclick="deleteEntity('${ent.id}')" class="text-slate-400 hover:text-cyber-pink p-1 bg-white/5 hover:bg-cyber-pink/10 rounded border border-white/10 transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                    </svg>
                </button>
            `;
            listEl.appendChild(node);
        }
    });
}

function deleteEntity(id) {
    SynthEngine.triggerDelete();
    const index = activeEntities.findIndex(e => e.id === id);
    if (index !== -1) {
        const ent = activeEntities[index];
        if (threeLayerInstance && threeLayerInstance.meshGroup) {
            threeLayerInstance.meshGroup.remove(ent.group);
        }
        if (ent.marker) ent.marker.remove();

        const remainingLinks = [];
        activeLinks.forEach(link => {
            if (link.entity1Id === id || link.entity2Id === id) {
                if (threeLayerInstance && threeLayerInstance.meshGroup) {
                    threeLayerInstance.meshGroup.remove(link.line);
                    threeLayerInstance.meshGroup.remove(link.pulse);
                }
            } else {
                remainingLinks.push(link);
            }
        });
        activeLinks = remainingLinks;

        activeEntities.splice(index, 1);
        updateEntitiesDashboard();
        showToast("Dismantled quantum mesh");
    }
}

function zoomToEntity(index) {
    if (index < 0 || index >= activeEntities.length) return;
    const ent = activeEntities[index];
    SynthEngine.triggerWarp();

    if (!map) return;
    map.flyTo({ center: ent.lngLat, zoom: 16.5, pitch: 60, duration: 2200 });
    if (ent.marker) ent.marker.togglePopup();
}

function deploySectorPois(sectorKey) {
    activePoiMarkers.forEach(m => m.remove());
    activePoiMarkers = [];

    const sector = SECTOR_PRESETS[sectorKey];
    if (!sector || !sector.pois) return;

    sector.pois.forEach((poi, idx) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'poi-marker relative w-7 h-7 flex items-center justify-center cursor-pointer';
        markerEl.dataset.category = poi.category;

        const catColor = POI_CATEGORY_COLORS[poi.category] || '#ff00ff';
        markerEl.innerHTML = `
            <div class="marker-ripple-effect absolute w-full h-full rounded-full opacity-40" style="background-color: ${catColor};"></div>
            <div class="w-3 h-3 rounded-full border border-slate-900 shadow-md relative z-10" style="background-color: ${catColor};"></div>
        `;

        if (!poiLayersVisibility[poi.category]) {
            markerEl.classList.add('hidden');
        }

        const galleryId = `poi-gallery-${sectorKey}-${idx}`;
        const firstImg = poi.images[0] || 'https://placehold.co/320x160/030712/00ffcc?text=UAE+POI';

        let thumbnailsHtml = '';
        if (poi.images.length > 1) {
            thumbnailsHtml = `<div class="flex gap-1.5 mt-2 overflow-x-auto pb-1">`;
            poi.images.forEach((img, i) => {
                thumbnailsHtml += `
                    <a href="${img}" data-fancybox="${galleryId}" data-caption="${poi.title} - Preview ${i + 1}" class="shrink-0 block w-11 h-11 rounded-lg overflow-hidden border border-white/10 hover:border-cyber-cyan/50 transition-colors">
                        <img src="${img}" class="w-full h-full object-cover" />
                    </a>
                `;
            });
            thumbnailsHtml += `</div>`;
        }

        const popupHtml = `
            <div class="w-full text-left font-mono select-text">
                <div class="relative w-full h-28 bg-slate-950 overflow-hidden group">
                    <img src="${firstImg}" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    ${poi.youtube ? `
                        <a href="${poi.youtube}" data-fancybox="${galleryId}" data-width="800" data-height="450" class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors group/play">
                            <div class="w-10 h-10 rounded-full bg-cyber-pink/90 flex items-center justify-center shadow-neon-pink group-hover/play:scale-110 transition-transform">
                                <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                            <span class="absolute bottom-2 left-3 text-[8px] bg-slate-950/80 text-cyber-pink border border-cyber-pink/30 px-1.5 py-0.5 rounded tracking-widest font-bold uppercase">PLAY VIDEO</span>
                        </a>
                    ` : ''}
                </div>

                <div class="p-4 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="text-[8px] font-bold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-1.5 py-0.5 rounded tracking-widest uppercase">${poi.category}</span>
                    </div>
                    <div class="text-[11px] font-bold text-white tracking-wide uppercase leading-tight">${poi.title}</div>
                    <p class="text-[9px] text-slate-300 leading-relaxed font-sans normal-case">${poi.desc}</p>
                    
                    ${thumbnailsHtml}

                    <div class="border-t border-white/10 pt-2.5 mt-1.5 flex items-center justify-between">
                        <a href="${poi.web}" target="_blank" class="px-2.5 py-1.5 bg-cyber-cyan/15 hover:bg-cyber-cyan text-cyber-cyan hover:text-slate-950 border border-cyber-cyan/30 rounded text-[9px] uppercase font-bold transition-all tracking-wider shrink-0">Know More</a>
                        <div class="flex gap-1.5">
                            ${poi.phone ? `
                                <a href="tel:${poi.phone}" title="Call Office" class="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1.3 1.3 0 01-.321 1.05l-1.305 1.305a11.934 11.934 0 005.152 5.152l1.305-1.305a1.3 1.3 0 011.05-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                </a>
                            ` : ''}
                            ${poi.social?.insta ? `
                                <a href="${poi.social.insta}" target="_blank" title="Instagram" class="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyber-pink hover:border-cyber-pink/50 transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke-width="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="2"/></svg>
                                </a>
                            ` : ''}
                            ${poi.social?.fb ? `
                                <a href="${poi.social.fb}" target="_blank" title="Facebook" class="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-400/50 transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke-width="2"/></svg>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const popup = new maplibregl.Popup({ offset: 12, closeOnClick: false }).setHTML(popupHtml);
        const marker = new maplibregl.Marker({ element: markerEl })
            .setLngLat(poi.lngLat)
            .setPopup(popup)
            .addTo(map);

        activePoiMarkers.push(marker);
    });
}

function togglePoiLayer(category, checked) {
    SynthEngine.triggerClick();
    poiLayersVisibility[category] = checked;

    const markers = document.querySelectorAll(`.poi-marker[data-category="${category}"]`);
    markers.forEach(el => {
        if (checked) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
    showToast(`${category} POI layers: ${checked ? 'VISIBLE' : 'HIDDEN'}`);
    logTrackingEvent('Toggle POI Layer', { category, visible: checked });
}

function flyToSector(key) {
    const sector = SECTOR_PRESETS[key];
    if (!sector || !map) return;

    SynthEngine.triggerWarp();
    showToast(`Warping to: ${sector.title.toUpperCase()}`);

    map.flyTo({
        center: sector.center,
        zoom: sector.zoom,
        pitch: sector.pitch,
        bearing: sector.bearing,
        duration: 3800
    });

    updateModelAnchor(sector.center);

    setTimeout(() => {
        createDefaultPresetMeshes(key);
        deploySectorPois(key);
    }, 600);

    fetchCurrentWeather(sector.center[1], sector.center[0]);
    logTrackingEvent('Warp Sector', { sector: key });
}

function createDefaultPresetMeshes(key) {
    const sector = SECTOR_PRESETS[key];
    if (!sector || !threeLayerInstance) return;

    activeLinks.forEach(link => {
        if (threeLayerInstance.meshGroup) {
            threeLayerInstance.meshGroup.remove(link.line);
            threeLayerInstance.meshGroup.remove(link.pulse);
        }
    });
    activeLinks = [];

    activeEntities.forEach(ent => {
        if (threeLayerInstance.meshGroup) threeLayerInstance.meshGroup.remove(ent.group);
        if (ent.marker) ent.marker.remove();
    });
    activeEntities = [];

    sector.initEntities.forEach(entDef => {
        const computedLngLat = [
            sector.center[0] + entDef.offset[0],
            sector.center[1] + entDef.offset[1]
        ];
        deployNewMesh(entDef.type, computedLngLat, entDef.altitude, entDef.scale, entDef.title, entDef.category, entDef.desc);
    });
}

function changeMapStyle(val) {
    SynthEngine.triggerClick();
    if (!map) return;

    let styleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
    if (val === 'light') styleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    else if (val === 'voyager') styleUrl = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

    map.setStyle(styleUrl);
    showToast(`Matrix shifted: ${val.toUpperCase()}`);
    logTrackingEvent('Change Map Style', { style: val });
}

function resetDefaultEnvironment() {
    SynthEngine.triggerWarp();

    activeLinks.forEach(link => {
        if (threeLayerInstance && threeLayerInstance.meshGroup) {
            threeLayerInstance.meshGroup.remove(link.line);
            threeLayerInstance.meshGroup.remove(link.pulse);
        }
    });
    activeLinks = [];

    activeEntities.forEach(ent => {
        if (threeLayerInstance && threeLayerInstance.meshGroup) threeLayerInstance.meshGroup.remove(ent.group);
        if (ent.marker) ent.marker.remove();
    });
    activeEntities = [];
    updateEntitiesDashboard();

    if (!map) return;
    map.flyTo({ center: [55.1565, 25.0768], zoom: 15, pitch: 60, bearing: -20, duration: 2000 });
    updateModelAnchor([55.1565, 25.0768]);

    setTimeout(() => {
        createDefaultPresetMeshes('dubai');
        deploySectorPois('dubai');
    }, 800);

    fetchCurrentWeather(25.0768, 55.1565);
    showToast("System Reset completed");
}

function setupFpsCounter() {
    let lastTime = performance.now();
    let frames = 0;
    const fpsLabel = document.getElementById('telemetry-fps');

    function tick() {
        const now = performance.now();
        frames++;
        if (now >= lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (now - lastTime));
            fpsLabel.innerText = fps;
            frames = 0;
            lastTime = now;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

let toastTimeout;
function showToast(text) {
    const el = document.getElementById('toast');
    const txt = document.getElementById('toast-text');
    txt.innerText = text;

    el.classList.remove('translate-y-20', 'opacity-0');
    el.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        el.classList.remove('translate-y-0', 'opacity-100');
        el.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

const sidePanel = document.getElementById('side-panel');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const toggleIconArrow = document.getElementById('toggle-icon-arrow');
let sidebarCollapsed = false;

toggleSidebarBtn.onclick = function () {
    SynthEngine.triggerClick();
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
        sidePanel.classList.add('-translate-x-full');
        toggleIconArrow.classList.add('rotate-180');
    } else {
        sidePanel.classList.remove('-translate-x-full');
        toggleIconArrow.classList.remove('rotate-180');
    }
};
