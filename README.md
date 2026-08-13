# Personal 3D Portfolio

A personal portfolio built with React, Vite, Three.js, React Three Fiber, Drei and GSAP.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
```

## 3D workflow

- Spline: use for quick scene exploration and web-ready experiments.
- Blender: export finished models as `.glb` / `.gltf`.
- Place local 3D assets in `public/models/`.
- Load them in React Three Fiber with Drei's `useGLTF`.

## Current status

The starter homepage includes:

- Responsive navigation
- Interactive 3D hero built with React Three Fiber
- Selected work section
- About section
- Contact section
- Mobile layout

All current copy, project names, colors and the placeholder 3D object are intended to be replaced as the personal visual direction develops.
