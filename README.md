# Milind Kapadiya — Personal Portfolio

Personal portfolio built with Next.js, React, Three.js, React Three Fiber, Drei and GSAP, deployed through Vercel at `milindkapadiya.com`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Production build

```bash
npm run build
npm start
```

## Current prototype

The `/projects` route is the first proof of concept for the interactive digital library:

- Procedural spiral bookshelf
- 12 generated placeholder books
- 3 interactive project books
- Hover / pull-out response
- Camera focus
- Physical cover-opening animation
- 3 placeholder project spreads per interactive book
- Page-turn animation
- Close and return-to-shelf behavior
- Project URLs such as `/projects/yale-housing`
- Browser back/forward support
- Keyboard controls: arrows to turn pages, Escape to close
- Reduced-motion support
- Mobile project index
- Custom loading experience

## Add or edit projects

Project content lives in:

```text
data/projects.js
```

Each project defines metadata, book styling and page content. Books are generated from this data automatically.

The three current interactive prototypes are:

- `yale-housing`
- `chess`
- `deed-filings`

Set `interactive: true` and provide `pages` to make another book openable.

## 3D architecture

```text
components/projects/
├── ProjectsExperience.jsx
├── book/
│   └── ProjectBook.jsx
├── library/
│   └── SpiralBookcase.jsx
├── scene/
│   ├── Atmosphere.jsx
│   ├── CameraRig.jsx
│   └── ProjectsScene.jsx
└── ui/
    ├── ProjectLoader.jsx
    └── ProjectOverlay.jsx
```

Spiral placement is generated in `lib/spiral.js`.

## Asset workflow

- Spline: quick visual exploration and interaction tests.
- Blender: final custom geometry and optimized models.
- Export Blender assets as `.glb` / `.gltf`.
- Put production models in `public/models/`.
- Put project imagery in `public/projects/<project-slug>/`.
- Prefer WebP / AVIF for still imagery.

## Prototype note

This is deliberately a proof of concept. The current books, materials, project page content, shelf proportions and homepage art direction are placeholders. The next step is visual refinement using the actual project assets and final portfolio identity.
