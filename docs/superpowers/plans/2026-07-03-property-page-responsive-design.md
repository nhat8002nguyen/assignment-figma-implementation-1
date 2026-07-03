# Property Page Responsive Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the tonomo property hero page from fixed 1440px desktop-only into a responsive layout with decomposed components, unified overlay card, and split-priority navigation.

**Architecture:** Decompose `Hero` + `AgentCard` into `SiteHeader`, `Hero`, and `PropertyInfoCard`. Shared data in `data/property.js`, design tokens in `styles/tokens.css`. CSS media queries at 768px and 1024px breakpoints — no JS breakpoint hook.

**Tech Stack:** React 18, Vite 6, plain CSS with BEM, IBM Plex Sans

## Global Constraints

- Breakpoints: Desktop ≥1024px · Tablet 768–1023px · Mobile <768px
- `--container-padding`: 100px (desktop) · 48px (tablet) · 24px (mobile)
- `--hero-min-height`: 1024px (desktop) · 720px (tablet) · 560px (mobile)
- Colors: `#22333b`, `#1e1e1e`, `#595959`, `#d0d0d0`, `#f1efef`, `rgba(30,30,30,0.7)`
- PropertyInfoCard: single BEM block, absolute bottom of hero, `z-index: 2`
- SiteHeader: absolute top of hero, `z-index: 3`
- Mobile nav: Contact always visible; Documents + section links in More menu
- Tablet nav: Documents + Contact visible; section links in More menu
- No automated tests — manual browser verification at 1440px, 768px, 375px
- Chevrons on Floor Plans / Videos remain visual only (no dropdown logic)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/styles/tokens.css` | Create | Breakpoint tokens, container padding, hero min-height |
| `src/data/property.js` | Create | Nav items, stats, price, broker, property title |
| `src/components/PropertyInfoCard/PropertyInfoCard.jsx` | Create | Unified stats + broker overlay |
| `src/components/PropertyInfoCard/PropertyInfoCard.css` | Create | Responsive card styles |
| `src/components/SiteHeader/NavLinks.jsx` | Create | Desktop inline nav |
| `src/components/SiteHeader/MoreMenu.jsx` | Create | Tablet/mobile hamburger dropdown |
| `src/components/SiteHeader/SiteHeader.jsx` | Create | Header composition |
| `src/components/SiteHeader/SiteHeader.css` | Create | Header responsive styles |
| `src/components/Hero/Hero.jsx` | Modify | Background + content + hosts overlay |
| `src/components/Hero/Hero.css` | Modify | Fluid hero, remove header/stats styles |
| `src/components/PropertyPage/PropertyPage.jsx` | Modify | Compose SiteHeader + Hero |
| `src/components/PropertyPage/PropertyPage.css` | Modify | Remove fixed 1440px |
| `src/components/AgentCard/` | Delete | Replaced by PropertyInfoCard |
| `src/main.jsx` | Modify | Import tokens.css |
| `index.html` | Modify | Fix viewport meta |
| `README.md` | Modify | Document responsive structure |

---

### Task 1: Foundation — tokens, data, viewport

**Files:**
- Create: `figma-property-page/src/styles/tokens.css`
- Create: `figma-property-page/src/data/property.js`
- Modify: `figma-property-page/src/main.jsx`
- Modify: `figma-property-page/index.html`

**Interfaces:**
- Produces: `NAV_ITEMS`, `PROPERTY_STATS`, `PROPERTY_PRICE`, `BROKER`, `PROPERTY` from `data/property.js`
- Produces: CSS custom properties on `:root` from `tokens.css`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
:root {
  --container-padding: 24px;
  --hero-min-height: 560px;
  --color-primary: #22333b;
  --color-text: #1e1e1e;
  --color-muted: #595959;
  --color-broker-bg: #d0d0d0;
  --color-page-bg: #f1efef;
  --color-stats-bg: rgba(30, 30, 30, 0.7);
  --color-white: #ffffff;
}

@media (min-width: 768px) {
  :root {
    --container-padding: 48px;
    --hero-min-height: 720px;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 100px;
    --hero-min-height: 1024px;
  }
}
```

- [ ] **Step 2: Create `src/data/property.js`**

```javascript
export const NAV_ITEMS = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Overview', href: '#overview' },
  { label: '3D tour', href: '#3d-tour' },
  { label: 'Floor Plans', href: '#floor-plans', hasChevron: true },
  { label: 'Videos', href: '#videos', hasChevron: true },
];

export const PROPERTY = {
  title: '16926 Baederwood',
  subtitle: 'Rockville, Maryland 20855, USA',
};

export const PROPERTY_STATS = [
  { label: 'Beds', value: '4' },
  { label: 'Baths', value: '5' },
  { label: 'Living Area', value: '4' },
  { label: 'Lot Size', value: '11,000' },
];

export const PROPERTY_PRICE = {
  label: 'Offered at',
  value: '$1,350,000',
};

export const BROKER = {
  name: 'Jane Doesmith',
  role: 'Lead Broker / REMAX',
  license: '#123456',
  phone: '(914) 400-5228',
  email: 'jane.doesmith@remax.com',
};
```

- [ ] **Step 3: Import tokens in `src/main.jsx`**

Add after the global.css import:

```javascript
import './styles/tokens.css';
```

- [ ] **Step 4: Fix viewport in `index.html`**

Replace:

```html
<meta name="viewport" content="width=1440" />
```

With:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- [ ] **Step 5: Verify dev server starts**

Run: `cd figma-property-page && npm run dev`  
Expected: Server starts without errors; page still renders (unchanged visually)

---

### Task 2: PropertyInfoCard — unified overlay component

**Files:**
- Create: `figma-property-page/src/components/PropertyInfoCard/PropertyInfoCard.jsx`
- Create: `figma-property-page/src/components/PropertyInfoCard/PropertyInfoCard.css`

**Interfaces:**
- Consumes: `PROPERTY_STATS`, `PROPERTY_PRICE`, `BROKER` from `../../data/property.js`
- Produces: default export `PropertyInfoCard` — no props

- [ ] **Step 1: Create `PropertyInfoCard.jsx`**

```jsx
import agentPhoto from '../../assets/agent-photo.jpg';
import { PROPERTY_STATS, PROPERTY_PRICE, BROKER } from '../../data/property.js';
import './PropertyInfoCard.css';

export default function PropertyInfoCard() {
  return (
    <aside className="property-info-card" aria-label="Property details and broker">
      <div className="property-info-card__stats">
        {PROPERTY_STATS.map((stat) => (
          <div key={stat.label} className="property-info-card__stat">
            <span className="property-info-card__stat-label">{stat.label}</span>
            <span className="property-info-card__stat-value">{stat.value}</span>
          </div>
        ))}
        <div className="property-info-card__stat property-info-card__stat--price">
          <span className="property-info-card__stat-label">{PROPERTY_PRICE.label}</span>
          <span className="property-info-card__stat-value">{PROPERTY_PRICE.value}</span>
        </div>
      </div>

      <div className="property-info-card__broker">
        <div className="property-info-card__avatar">
          <img
            className="property-info-card__avatar-image"
            src={agentPhoto}
            alt={BROKER.name}
            width={156}
            height={156}
          />
        </div>

        <div className="property-info-card__info">
          <p className="property-info-card__role">{BROKER.role}</p>
          <h2 className="property-info-card__name">{BROKER.name}</h2>
        </div>

        <div className="property-info-card__contact">
          <p className="property-info-card__contact-item">{BROKER.license}</p>
          <p className="property-info-card__contact-item">{BROKER.phone}</p>
          <p className="property-info-card__contact-item">{BROKER.email}</p>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create `PropertyInfoCard.css`**

```css
.property-info-card {
  position: absolute;
  bottom: 0;
  left: var(--container-padding);
  right: var(--container-padding);
  z-index: 2;
}

/* --- Stats panel --- */
.property-info-card__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px;
  background-color: var(--color-stats-bg);
  color: var(--color-white);
}

.property-info-card__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.property-info-card__stat--price {
  grid-column: 1 / -1;
  align-items: flex-start;
}

.property-info-card__stat-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

.property-info-card__stat-value {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.1;
}

/* --- Broker panel --- */
.property-info-card__broker {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-broker-bg);
}

.property-info-card__avatar {
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.property-info-card__avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.property-info-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-info-card__role {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
}

.property-info-card__name {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
}

.property-info-card__contact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-info-card__contact-item {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-text);
  opacity: 0.8;
}

/* --- Tablet --- */
@media (min-width: 768px) {
  .property-info-card__stats {
    grid-template-columns: repeat(5, 1fr);
    padding: 24px 32px;
    gap: 0;
  }

  .property-info-card__stat--price {
    grid-column: auto;
    align-items: flex-end;
  }

  .property-info-card__stat {
    align-items: flex-end;
  }

  .property-info-card__stat-value {
    font-size: 24px;
    text-align: right;
  }

  .property-info-card__broker {
    flex-direction: row;
    align-items: center;
    gap: 32px;
    padding: 32px;
  }

  .property-info-card__avatar {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
  }

  .property-info-card__avatar-image {
    width: 180px;
    height: 120px;
    max-width: none;
    margin-left: -30px;
  }

  .property-info-card__body {
    flex: 1;
  }

  .property-info-card__name {
    font-size: 32px;
  }

  .property-info-card__contact {
    flex-shrink: 0;
    align-items: flex-end;
    text-align: right;
    height: auto;
    gap: 12px;
  }
}

/* --- Desktop --- */
@media (min-width: 1024px) {
  .property-info-card__stats {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .property-info-card__stat-value {
    font-size: 32px;
  }

  .property-info-card__avatar {
    width: 156px;
    height: 156px;
  }

  .property-info-card__avatar-image {
    width: 234px;
    height: 156px;
    margin-left: -38px;
  }

  .property-info-card__broker {
    min-height: 220px;
  }

  .property-info-card__contact {
    justify-content: space-between;
    height: 91px;
  }
}
```

- [ ] **Step 3: Temporarily mount in Hero for visual check**

In `Hero.jsx`, add import and render `<PropertyInfoCard />` before closing `</section>`. Do NOT remove old stats yet — just verify card renders.

Run: `npm run dev` — resize to 375px, 768px, 1440px. Card should show stats + broker.

- [ ] **Step 4: Revert temporary Hero mount** (Task 4 will wire it properly)

---

### Task 3: SiteHeader — navigation components

**Files:**
- Create: `figma-property-page/src/components/SiteHeader/NavLinks.jsx`
- Create: `figma-property-page/src/components/SiteHeader/MoreMenu.jsx`
- Create: `figma-property-page/src/components/SiteHeader/SiteHeader.jsx`
- Create: `figma-property-page/src/components/SiteHeader/SiteHeader.css`

**Interfaces:**
- Consumes: `NAV_ITEMS` from `../../data/property.js`
- Produces: default export `SiteHeader` — no props
- Produces: default export `NavLinks` — no props
- Produces: default export `MoreMenu` — props: `{ includeDocuments?: boolean }`

- [ ] **Step 1: Create `NavLinks.jsx`**

```jsx
import chevronIcon from '../../assets/chevron.svg';
import { NAV_ITEMS } from '../../data/property.js';

export default function NavLinks() {
  return (
    <nav className="site-header__nav" aria-label="Property navigation">
      <ul className="site-header__nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="site-header__nav-item">
            <a className="site-header__nav-link" href={item.href}>
              {item.label}
              {item.hasChevron && (
                <img
                  className="site-header__nav-chevron"
                  src={chevronIcon}
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Create `MoreMenu.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../data/property.js';

export default function MoreMenu({ includeDocuments = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="site-header__more" ref={menuRef}>
      <button
        type="button"
        className="site-header__more-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More navigation options"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="site-header__more-icon" aria-hidden="true">☰</span>
      </button>

      {isOpen && (
        <div className="site-header__more-panel" role="menu">
          <ul className="site-header__more-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} role="none">
                <a
                  className="site-header__more-link"
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {includeDocuments && (
              <li role="none">
                <button
                  type="button"
                  className="site-header__more-link site-header__more-link--button"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Documents
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `SiteHeader.jsx`**

```jsx
import logo from '../../assets/logo.svg';
import NavLinks from './NavLinks.jsx';
import MoreMenu from './MoreMenu.jsx';
import './SiteHeader.css';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <img className="site-header__logo" src={logo} alt="tonomo" width={172} height={24} />

      <div className="site-header__nav-desktop">
        <NavLinks />
      </div>

      <div className="site-header__nav-compact">
        <MoreMenu includeDocuments />
      </div>

      <div className="site-header__actions">
        <button type="button" className="site-header__button site-header__button--outline site-header__button--documents">
          Documents
        </button>
        <button type="button" className="site-header__button site-header__button--filled">
          Contact
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `SiteHeader.css`**

```css
.site-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 24px var(--container-padding) 0;
}

.site-header__logo {
  flex-shrink: 0;
  width: 172px;
  height: 24px;
}

.site-header__nav-desktop {
  display: none;
}

.site-header__nav-compact {
  display: block;
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-header__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.site-header__button--outline {
  border: 1px solid var(--color-white);
  color: var(--color-white);
  background: transparent;
}

.site-header__button--filled {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.site-header__button--documents {
  display: none;
}

/* More menu */
.site-header__more {
  position: relative;
}

.site-header__more-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--color-white);
  font-size: 20px;
}

.site-header__more-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  background-color: var(--color-primary);
  border-radius: 4px;
  padding: 8px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.site-header__more-list {
  list-style: none;
}

.site-header__more-link {
  display: block;
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-white);
  text-decoration: none;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.site-header__more-link:hover,
.site-header__more-link:focus {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Desktop nav links (hidden until ≥1024px) */
.site-header__nav-list {
  display: flex;
  align-items: center;
  gap: 48px;
  list-style: none;
}

.site-header__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-white);
  text-decoration: none;
  white-space: nowrap;
}

.site-header__nav-chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* --- Tablet --- */
@media (min-width: 768px) {
  .site-header__button {
    padding: 12px 20px;
    font-size: 16px;
  }

  .site-header__button--documents {
    display: inline-flex;
  }

  .site-header__more-panel {
    left: 0;
    transform: none;
    min-width: 240px;
  }
}

/* --- Desktop --- */
@media (min-width: 1024px) {
  .site-header__nav-desktop {
    display: block;
    position: absolute;
    left: 50%;
    top: 36px;
    transform: translateX(calc(-50% - 57.5px));
  }

  .site-header__nav-compact {
    display: none;
  }

  .site-header__actions {
    position: absolute;
    top: 24px;
    right: var(--container-padding);
    gap: 16px;
  }

  .site-header__button {
    padding: 12px 32px;
  }
}
```

- [ ] **Step 5: Verify header in isolation**

Temporarily import `SiteHeader` in `Hero.jsx` and render it. Check:
- 375px: Logo + ☰ + Contact only; More includes Documents + nav links
- 768px: Logo + ☰ + Documents + Contact
- 1440px: Full inline nav, no hamburger

---

### Task 4: Hero refactor — slim down and wire components

**Files:**
- Modify: `figma-property-page/src/components/Hero/Hero.jsx`
- Modify: `figma-property-page/src/components/Hero/Hero.css`

**Interfaces:**
- Consumes: `PropertyInfoCard`, `SiteHeader`, `PROPERTY` from data
- Produces: default export `Hero` containing header + background + content + overlay

- [ ] **Step 1: Replace `Hero.jsx` entirely**

```jsx
import heroBg from '../../assets/hero-bg.jpg';
import SiteHeader from '../SiteHeader/SiteHeader.jsx';
import PropertyInfoCard from '../PropertyInfoCard/PropertyInfoCard.jsx';
import { PROPERTY } from '../../data/property.js';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__background">
        <img
          className="hero__background-image"
          src={heroBg}
          alt=""
          aria-hidden="true"
        />
      </div>

      <SiteHeader />

      <div className="hero__content">
        <h1 className="hero__title">{PROPERTY.title}</h1>
        <p className="hero__subtitle">{PROPERTY.subtitle}</p>
      </div>

      <PropertyInfoCard />
    </section>
  );
}
```

- [ ] **Step 2: Replace `Hero.css` entirely**

```css
.hero {
  position: relative;
  width: 100%;
  min-height: var(--hero-min-height);
  overflow: hidden;
  padding-bottom: 280px;
}

.hero__background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero__content {
  position: absolute;
  top: 120px;
  left: var(--container-padding);
  right: var(--container-padding);
  z-index: 1;
}

.hero__title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.36px;
  color: var(--color-white);
}

.hero__subtitle {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.08px;
  color: var(--color-white);
}

@media (min-width: 768px) {
  .hero {
    padding-bottom: 240px;
  }

  .hero__content {
    top: 160px;
  }

  .hero__title {
    font-size: 56px;
    letter-spacing: -0.56px;
  }

  .hero__subtitle {
    margin-top: 11px;
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding-bottom: 341px;
  }

  .hero__content {
    top: 182px;
  }

  .hero__title {
    font-size: 88px;
    letter-spacing: -0.88px;
    white-space: nowrap;
  }

  .hero__subtitle {
    margin-left: 6px;
    font-size: 20px;
    letter-spacing: -0.1px;
    white-space: nowrap;
  }
}
```

- [ ] **Step 3: Verify hero at three viewports**

Run: `npm run dev`

| Viewport | Check |
|---|---|
| 1440px | Title 88px, full nav, overlay card matches Figma layout |
| 768px | Title 56px, More menu, card in tablet layout |
| 375px | Title wraps at 36px, Contact visible, no horizontal scroll |

---

### Task 5: PropertyPage — remove fixed width, delete AgentCard

**Files:**
- Modify: `figma-property-page/src/components/PropertyPage/PropertyPage.jsx`
- Modify: `figma-property-page/src/components/PropertyPage/PropertyPage.css`
- Delete: `figma-property-page/src/components/AgentCard/AgentCard.jsx`
- Delete: `figma-property-page/src/components/AgentCard/AgentCard.css`

**Interfaces:**
- Consumes: `Hero` only (AgentCard removed)

- [ ] **Step 1: Update `PropertyPage.jsx`**

```jsx
import Hero from '../Hero/Hero.jsx';
import './PropertyPage.css';

export default function PropertyPage() {
  return (
    <div className="property-page">
      <Hero />
    </div>
  );
}
```

- [ ] **Step 2: Update `PropertyPage.css`**

```css
.property-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-page-bg);
}
```

- [ ] **Step 3: Delete `AgentCard/` directory**

Run: `rm -rf figma-property-page/src/components/AgentCard`

- [ ] **Step 4: Verify build succeeds**

Run: `cd figma-property-page && npm run build`  
Expected: Build completes with no import errors

---

### Task 6: README update and final verification

**Files:**
- Modify: `figma-property-page/README.md`

- [ ] **Step 1: Update README structure section**

Replace the Structure and BEM blocks sections with:

```markdown
## Structure

\`\`\`
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
\`\`\`

## Breakpoints

| Name | Range | Nav behavior |
|---|---|---|
| Mobile | <768px | More menu (nav + Documents); Contact visible |
| Tablet | 768–1023px | More menu (nav only); Documents + Contact visible |
| Desktop | ≥1024px | Full inline nav; Documents + Contact visible |

## Verify responsive layout

\`\`\`bash
npm run dev
\`\`\`

Test at **1440px**, **768px**, and **375px** in browser devtools.
```

- [ ] **Step 2: Final manual verification checklist**

Run: `npm run dev`

- [ ] 1440px — desktop layout pixel-close to Figma
- [ ] 768px — More menu opens/closes; Documents + Contact visible; card readable
- [ ] 375px — No horizontal scroll; Contact visible; More includes Documents
- [ ] More menu closes on Escape and outside click
- [ ] `aria-expanded` toggles on More trigger
- [ ] Hero title does not hide behind overlay card
- [ ] Page scrolls naturally (overlay is not fixed/sticky)

- [ ] **Step 3: Production build check**

Run: `npm run build && npm run preview`  
Expected: Preview serves built assets without layout regressions

---

## Self-Review (plan vs spec)

| Spec requirement | Task |
|---|---|
| Component decomposition | Tasks 2, 3, 4, 5 |
| Unified PropertyInfoCard overlay | Task 2 |
| Absolute bottom positioning, z-index 2 | Task 2 CSS |
| SiteHeader z-index 3 | Task 3 CSS |
| Breakpoints 768 / 1024 | Task 1 tokens + all CSS |
| Split-priority nav | Task 3 MoreMenu + SiteHeader CSS |
| Hero fluid height + title scaling | Task 4 |
| Remove fixed 1440px | Tasks 1, 4, 5 |
| data/property.js extraction | Task 1 |
| Delete AgentCard | Task 5 |
| Manual verification | Tasks 1–6 |
| Out of scope items excluded | No tasks for routing/dropdowns |

No placeholders. All code blocks are complete and copy-paste ready.
