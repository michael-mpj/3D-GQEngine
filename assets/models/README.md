# Models

Place your GLB or GLTF models inside this folder.

Example:

```
assets/models/
├── beacon.glb
├── crystal.glb
├── orbital-ring.glb
├── drone.glb
└── city.glb
```

Example loading:

```javascript
loader.load(
    "assets/models/beacon.glb",
    (gltf) => {
        scene.add(gltf.scene);
    }
);
```
