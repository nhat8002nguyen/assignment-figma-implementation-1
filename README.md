# Figma Property Page — React + BEM

Responsive implementation of the **tonomo** property listing hero screen from Figma, built with React and CSS BEM architecture.

**Figma source:** [draft — Template 2](https://www.figma.com/design/Ap8KapBdTYBw5Ntx1THkH2/draft?node-id=0-1)

## Run locally

```bash
npm install --cache /tmp/npm-cache-figma
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and test at **1440px**, **768px**, and **375px**.

## Structure

```
src/
├── components/
│   ├── PropertyPage/       # Page wrapper (full-width)
│   ├── SiteHeader/         # Logo, nav, More menu, CTAs
│   ├── Hero/               # Background, title, hosts overlay
│   └── PropertyInfoCard/   # Unified stats + broker overlay
├── data/property.js        # Nav items, stats, broker data
├── assets/                 # Images exported from Figma
└── styles/
    ├── global.css          # Reset + IBM Plex Sans
    └── tokens.css          # Breakpoints, spacing, colors
```

## Breakpoints

| Name | Range | Nav behavior |
|---|---|---|
| Mobile | <768px | More menu (nav + Documents); Contact visible |
| Tablet | 768–1023px | More menu (nav only); Documents + Contact visible |
| Desktop | ≥1024px | Full inline nav; Documents + Contact visible |

## BEM blocks

| Block | Elements |
|-------|----------|
| `property-page` | — |
| `site-header` | `__logo`, `__nav`, `__more`, `__actions`, `__button` |
| `hero` | `__background`, `__content`, `__title`, `__subtitle` |
| `property-info-card` | `__stats`, `__stat`, `__broker`, `__avatar`, `__info`, `__contact` |

## Design tokens

- **Font:** IBM Plex Sans (300, 400, 500, 600, 700)
- **Colors:** `#22333b`, `#1e1e1e`, `#595959`, `#d0d0d0`, `#f1efef`, `rgba(30,30,30,0.7)`
- **Breakpoints:** 768px (tablet), 1024px (desktop)

## Verify responsive layout

```bash
npm run dev
```

Test at **1440px**, **768px**, and **375px** in browser devtools.
