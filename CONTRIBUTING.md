# Contributing to 3D Geospatial Quantum Engine

Thanks for your interest in contributing! This document covers the workflow,
branching model, and commit conventions used by this project.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold that code.

## How to Contribute

### 1. Fork & Branch

```bash
git checkout -b feature/my-feature
```

Branch naming conventions:
- `feature/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — tooling, docs, maintenance
- `refactor/<short-description>` — code restructuring without behavior change

### 2. Validate Before Committing

```bash
npm run validate
```

This runs:
- `node --check assets/js/index.js` — syntax validation

If you add new JS modules, extend the `validate` script in `package.json`.

### 3. Commit

Write clear, present-tense commit messages:

```
Add offline retry for weather API fetches
```

Prefixes are optional but encouraged:
- `feat:` / `fix:` / `chore:` / `refactor:` / `docs:` / `style:`

### 4. Push & Open a Pull Request

```bash
git push origin feature/my-feature
```

Open a PR against `main`. Include:
- What changed and why.
- Screenshots or screen recordings for UI/3D changes.
- Notes on testing (browser, device, offline mode).

## Development Setup

```bash
# Serve locally
npm start
# or
python3 -m http.server 8080

# Open http://localhost:8080
```

The app registers a Service Worker. For offline testing:
1. Load the app once while online.
2. Open DevTools → Application → Service Workers.
3. Check "Offline" and reload.

## Project Structure

```
index.html            # App shell + PWA registration
sw.js                 # Service worker (offline + versioned cache)
manifest.json         # PWA manifest
assets/
  css/                # Stylesheets
  js/
    index.js          # Map + WebGL + UI logic (entry point)
    maplibre-gl.js    # MapLibre GL JS (local)
    three.min.js      # Three.js r128 (local)
    GLTFLoader.js     # GLTF model loader (local)
    fancybox.umd.js   # Fancybox media viewer (local)
  icons/              # PWA icons (192 / 512 / maskable)
  screenshots/        # README + OG images
privacy/ / terms/
```

## Reporting Issues

- Use GitHub Issues.
- Include browser, OS, and console output.
- For 3D rendering issues, include a screenshot or screen recording.

## Questions

Open a GitHub Discussion or reach out to **Michael Joseph** at **mj@mikempj.com**.
