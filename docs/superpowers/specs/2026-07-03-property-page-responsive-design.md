# Property Page Responsive Design Spec

**Date:** 2026-07-03  
**Project:** `figma-property-page`  
**Status:** Approved — ready for implementation plan

## Summary

Refactor the tonomo property listing hero page from a fixed 1440px desktop-only layout into a responsive design supporting desktop, tablet, and mobile. Extract focused components, unify the stats bar and broker profile into a single overlay card, and implement split-priority navigation on smaller screens.

## Decisions

| Topic | Decision |
|---|---|
| Design source | Hybrid — desktop matches Figma; tablet/mobile derived consistently |
| Agent card | One unified `PropertyInfoCard` component (stats + broker) |
| Overlay position | Absolute at bottom of hero; scrolls away with page (not sticky/fixed) |
| Mobile nav | Documents + Contact always visible; section links in More menu |
| Breakpoints | Desktop ≥1024px · Tablet 768–1023px · Mobile <768px |
| Approach | Component decomposition (Approach B) |

## Component Architecture

```
PropertyPage (full-width, no fixed 1440px)
│
├── SiteHeader
│   ├── Logo
│   ├── NavLinks          (desktop: inline center nav)
│   ├── MoreMenu          (tablet/mobile: hamburger → dropdown)
│   └── HeaderActions     (Documents + Contact — always visible on desktop/tablet)
│
├── Hero
│   ├── HeroBackground    (full-bleed image, object-fit cover)
│   ├── HeroContent       (title + subtitle)
│   └── PropertyInfoCard  (absolute bottom, z-index: 2)
│       ├── StatsBar      (5 stats in responsive grid)
│       └── BrokerSection (avatar + name + contact)
│
└── (future page sections below hero scroll naturally)
```

### Responsibilities

| Component | Purpose | Depends on |
|---|---|---|
| `PropertyPage` | Page wrapper, composes header + hero | `SiteHeader`, `Hero` |
| `SiteHeader` | Logo, navigation, CTAs, More menu | `data/property.js` |
| `NavLinks` | Desktop inline nav links | nav data |
| `MoreMenu` | Tablet/mobile dropdown with section links (+ Documents on mobile) | nav data |
| `Hero` | Background image, title/subtitle, hosts overlay card | `PropertyInfoCard` |
| `PropertyInfoCard` | Unified stats bar + broker profile overlay | property/broker data |

### Key Rules

- `PropertyInfoCard` is always one DOM block — stats and broker share a single BEM block (`property-info-card`).
- Positioned `absolute; bottom: 0; left/right: container padding` inside `Hero`.
- `Hero` height is fluid (`min-height` + aspect-ratio) instead of fixed `1024px`.
- `SiteHeader` is `position: absolute; top: 0; z-index: 3` over the hero background.

## Design Tokens

Shared CSS custom properties in `styles/tokens.css`:

| Token | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (<768px) |
|---|---|---|---|
| `--container-padding` | 100px | 48px | 24px |
| `--hero-min-height` | 1024px | 720px | 560px |

Additional tokens (unchanged from Figma):

- **Font:** IBM Plex Sans (300, 400, 500, 600, 700)
- **Colors:** `#22333b`, `#1e1e1e`, `#595959`, `#d0d0d0`, `#f1efef`, `rgba(30,30,30,0.7)`

## SiteHeader — Navigation

### Desktop (≥1024px)

Matches Figma:

- Row layout: Logo (left) · inline nav links (center) · Documents + Contact (right)
- Nav links: Gallery, Overview, 3D Tour, Floor Plans ▾, Videos ▾
- 48px gap between links; buttons keep current outline/filled styles

### Tablet (768–1023px)

- Row layout: Logo · More (☰ icon) · Documents + Contact
- More opens a dropdown panel below the header with the 5 section links
- Button padding shrinks to `12px 20px`

### Mobile (<768px)

- Row layout: Logo · More (☰) · Contact only (filled button)
- Documents moves into the More menu alongside section links
- More opens a full-width slide-down panel below the header
- Tap outside or Escape closes the menu

### MoreMenu Accessibility

- Owns open/close state
- Sets `aria-expanded` on trigger button
- Keyboard: Escape closes; links are focusable when open

## Hero

### Background

Replace fixed pixel positioning (`left: -174px`, fixed width/height) with:

```css
object-fit: cover;
width: 100%;
height: 100%;
```

inside an absolutely positioned container.

### Title / Subtitle Scaling

| Breakpoint | Title font-size | Subtitle font-size | Notes |
|---|---|---|---|
| Desktop | 88px | 20px | top-left at `--container-padding`; matches Figma |
| Tablet | 56px | 18px | same position |
| Mobile | 36px | 16px | title may wrap (remove `white-space: nowrap`) |

### Hero Height

- `min-height: var(--hero-min-height)`
- Extra bottom padding equal to overlay card height so title never hides behind the card

## PropertyInfoCard — Unified Overlay

Renamed from `AgentCard`. Single BEM block: `property-info-card`.

```
property-info-card
├── __stats          (dark rgba(30,30,30,0.7) panel)
│   └── __stat × 5
└── __broker         (grey #d0d0d0 panel)
    ├── __avatar
    ├── __info         (role + name)
    └── __contact
```

### Positioning (all breakpoints)

```css
.property-info-card {
  position: absolute;
  bottom: 0;
  left: var(--container-padding);
  right: var(--container-padding);
  z-index: 2;
}
```

### Desktop (≥1024px)

Matches Figma:

- Full width within container padding
- Stats: single row, 5 columns; price right-aligned in last column
- Broker: horizontal row — avatar | name/title | contact (right-aligned)

### Tablet (768–1023px)

- Stats: 5-column row; stat values at 24px font; price stays in row
- Broker: horizontal row preserved; avatar 120px; contact stacks tighter

### Mobile (<768px)

- Stats: 2×2 grid (Beds, Baths, Living Area, Lot Size) + full-width price row below
- Broker: vertical stack — avatar (full-width banner, ~120px tall) → name/title → contact list (left-aligned)
- Card spans edge-to-edge within hero (hero padding handles inset)

## File Structure

```
src/
├── components/
│   ├── PropertyPage/
│   │   ├── PropertyPage.jsx
│   │   └── PropertyPage.css
│   ├── SiteHeader/
│   │   ├── SiteHeader.jsx
│   │   ├── SiteHeader.css
│   │   ├── NavLinks.jsx
│   │   └── MoreMenu.jsx
│   ├── Hero/
│   │   ├── Hero.jsx
│   │   └── Hero.css
│   └── PropertyInfoCard/
│       ├── PropertyInfoCard.jsx
│       └── PropertyInfoCard.css
├── data/
│   └── property.js               (nav items, stats, broker info)
├── styles/
│   ├── global.css
│   └── tokens.css
└── assets/
```

### Migration

- Delete `AgentCard/` component
- Move `NAV_ITEMS`, `STATS`, and broker data from `Hero.jsx` / `AgentCard.jsx` into `data/property.js`
- Remove fixed `1440px` widths from all CSS files
- Extract header markup from `Hero.jsx` into `SiteHeader`
- Move stats markup from `Hero.jsx` into `PropertyInfoCard`

## Testing & Success Criteria

Manual verification at three viewport widths:

| Viewport | Criteria |
|---|---|
| 1440px | Pixel-close to current Figma desktop layout |
| 768px | Tablet layout; More menu opens/closes; card readable |
| 375px | Mobile layout; no horizontal scroll; Contact CTA visible; More menu accessible |

No automated tests for this static page. Visual check via browser devtools is sufficient.

## Out of Scope

- Page sections below hero (Gallery, Overview, etc. content)
- Functional nav scrolling / routing
- Floor Plans / Videos dropdown submenus (chevrons remain visual only)
- Figma mobile/tablet mockups (none exist)
