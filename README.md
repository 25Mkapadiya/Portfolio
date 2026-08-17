# Milind Kapadiya — Portfolio

The `main` branch is the current recruiter-focused portfolio deployed through Vercel at `milindkapadiya.com`.

It is a lightweight Next.js single-page portfolio built around Milind's current resume: introduction, Crux internship experience, current projects, technical skills, Yale education, leadership/community work, and direct contact links.

## Important: 3D portfolio preservation

The interactive bookshelf / 3D portfolio was intentionally preserved before the simplified site replaced the production homepage.

Continue 3D development from:

```text
3d-portfolio-wip
```

That branch contains the bookshelf prototype and its React Three Fiber / Three.js / Drei / GSAP work as it existed before the temporary simplified portfolio was introduced.

The 3D source also remains in `main` for now, but it is disconnected from the primary navigation and homepage. Next.js route splitting keeps the Three.js experience out of the homepage JavaScript bundle.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Main portfolio files

```text
app/page.jsx          # recruiter-facing single-page portfolio
app/portfolio.css     # simple portfolio visual system + responsive/accessibility styles
app/layout.jsx        # global metadata + homepage styles
public/Milind_Kapadiya_Resume.pdf
```

The existing 3D route-specific styles are loaded from `app/projects/layout.jsx` instead of the root layout so they are not needed by the production homepage.
