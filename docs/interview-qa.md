# Interview Q&A — Figma-to-Responsive Implementation

Likely questions an interviewer could ask about converting the desktop-only Figma property page into a responsive React implementation, based on the current codebase.

---

## 1. Why did you decompose the single Figma frame into `SiteHeader`, `Hero`, and `PropertyInfoCard` instead of one component?

Single-responsibility and reusability. The Figma frame is one visual composition, but it bundles three independent concerns: site-wide navigation, the hero banner, and property/broker info. Splitting them means each gets its own CSS file and responsive rules and can be reasoned about independently. `SiteHeader` is also the piece most likely to be reused across future pages, while `Hero`/`PropertyInfoCard` stay specific to this listing page — that reuse boundary is exactly where the component split falls.

## 2. Your breakpoints are 768px and 1280px. Why those specific values, and why does desktop start at 1280 instead of the more common 1024?

```css
/* src/styles/tokens.css */
:root {
  --container-padding: 24px;
  --hero-min-height: 560px;
  ...
}

@media (min-width: 768px) { ... }
@media (min-width: 1280px) { ... }
```

768px is the standard tablet-portrait boundary. 1280px was chosen deliberately over 1024px because iPad Pro's landscape width is exactly 1024px, and the desktop layout (inline nav with 48px gaps, 5-column stat grid) needs more horizontal breathing room than 1024px comfortably gives — per the README: "Desktop starts at 1280px so devices at exactly 1024px wide stay on the tablet layout." Widening the tablet range to 768–1279px keeps that device class on the more compact "More menu" nav and tighter stat spacing, which reads better at that width.

## 3. The design source is a desktop-only 1440px Figma file, yet your CSS is mobile-first (base styles + `min-width` media queries). Why not desktop-first with `max-width`?

Mobile-first is more maintainable even when the source design is desktop-only. Base styles carry the fewest assumptions — single column, stacked layout, smaller type — and each breakpoint only *adds* complexity as more space becomes available (grid columns increase, nav collapses into inline links, font sizes scale up). Desktop-first would mean the default styles carry the most complexity (absolute positioning, 5-column grids), and every media query would be spent *undoing* that for smaller screens — more error-prone and verbose. Since the tablet/mobile layouts didn't exist in Figma and had to be derived from scratch, building up from a simple base was the safer direction.

## 4. How does `--container-padding` and `--hero-min-height` work, and why CSS custom properties instead of hardcoding values per breakpoint in each component?

They're defined once in `tokens.css` on `:root` and redefined at each breakpoint, then every component references `var(--container-padding)` without needing its own duplicate media query just for spacing:

```css
/* src/components/PropertyPage/PropertyPage.css */
.property-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-page-bg);
}
```

This is a single source of truth — changing the desktop gutter from 100px to 120px is a one-line change instead of hunting through `Hero.css`, `SiteHeader.css`, and `PropertyInfoCard.css` for hardcoded numbers. It also guarantees the header, hero content, and overlay card stay visually aligned to the same edge, since they all read the same variable rather than three independently-tuned values that could drift.

## 5. Your git history shows `PropertyInfoCard.jsx` used to export a single wrapper component combining stats and broker into one `<aside>`, but it's now split into two separately-rendered pieces. What changed, and what are the trade-offs?

The earlier version had:

```jsx
export default function PropertyInfoCard() {
  return (
    <aside className="property-info-card" aria-label="Property details and broker">
      <PropertyInfoCardStats />
      <PropertyInfoCardBroker />
    </aside>
  );
}
```

The current code drops that wrapper — `PropertyInfoCardStats` is rendered inside `Hero.jsx` (so it can sit absolutely-positioned within the hero's clipped bounds) while `PropertyInfoCardBroker` is rendered as a sibling of `<Hero />` in `PropertyPage.jsx`:

```jsx
// src/components/PropertyPage/PropertyPage.jsx
export default function PropertyPage() {
  return (
    <div className="property-page">
      <Hero />
      <PropertyInfoCardBroker />
    </div>
  );
}
```

**Trade-offs:** the stats bar and broker card no longer share one semantic landmark (`<aside aria-label="...">`), so assistive tech no longer groups them as a single unit. Positioning logic is also now duplicated — `.property-info-card__stats` and `.property-info-card__broker` each need their own absolute/margin rules instead of one parent handling layout for both children. The likely motivation is that the stats bar needs to overlap the hero image directly (clipped by `overflow: hidden` on `.hero`), while the broker card sits in normal document flow just below the hero — a single absolutely-positioned wrapper spanning both would make that split harder to achieve.

## 6. For responsive navigation, you render all three nav variants (`nav-desktop`, `nav-compact--mobile`, `nav-compact--tablet`) in the DOM simultaneously and toggle with `display: none`, rather than conditionally rendering in JS based on viewport width. Why?

```css
/* src/components/SiteHeader/SiteHeader.css */
.site-header__nav-desktop {
  display: none;
}

.site-header__nav-compact {
  display: block;
}

.site-header__nav-compact--tablet {
  display: none;
}
```

CSS-driven visibility avoids a JS resize listener entirely, avoids layout flicker or hydration mismatches (a JS-based approach guessing viewport width on first render can pick the wrong variant), and responds instantly and synchronously as the viewport changes — no debounce needed. The cost is two extra `MoreMenu` instances always existing in the DOM (each with its own `isOpen` state) and duplicate nav markup, though hidden elements are excluded from the accessibility tree via `display: none`. For a page with only three nav variants, this is a standard, well-accepted trade-off.

## 7. How does `MoreMenu` handle accessibility and keyboard interaction, and what's missing?

```jsx
// src/components/SiteHeader/MoreMenu.jsx
const [isOpen, setIsOpen] = useState(false);
...
const handleKeyDown = (event) => {
  if (event.key === 'Escape') setIsOpen(false);
};

const handleClickOutside = (event) => {
  if (menuRef.current && !menuRef.current.contains(event.target)) {
    setIsOpen(false);
  }
};
```

It sets `aria-expanded`/`aria-haspopup` on the trigger button, uses `role="menu"`/`role="menuitem"` on the panel and links, and closes on both Escape and outside-click. What's missing for full menu semantics: no focus trap or auto-focus of the first item on open, no arrow-key navigation between items, and focus isn't returned to the trigger button on close. Reasonable follow-ups to mention if asked how you'd harden it further.

## 8. The hero image uses `object-fit: cover` with a single fixed-resolution source for every breakpoint. What's the concern, and how would you fix it?

```css
/* src/components/Hero/Hero.css */
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
```

A single `hero-bg.jpg` downloads at full desktop resolution even on a 375px mobile viewport, wasting bandwidth and hurting LCP (Largest Contentful Paint). The fix is `<picture>` with `srcset`/`sizes`, or a build-time responsive image pipeline, so smaller viewports fetch a smaller variant. The same applies to `agent-photo.jpg`, though it's a smaller, lower-impact asset.

## 9. How does the `PropertyInfoCard` stats overlay avoid covering the hero title, given it's `position: absolute` at the bottom of the hero?

```css
/* src/components/Hero/Hero.css */
.hero {
  position: relative;
  width: 100%;
  min-height: var(--hero-min-height);
  overflow: hidden;
  padding-bottom: 200px;
}
```

The hero reserves bottom padding (200px mobile → 100px tablet → 120px desktop, per the media queries further down the file) sized to roughly match the stats card's height at each breakpoint. Combined with `min-height`, that guarantees enough room for the absolutely-positioned overlay without it creeping over the title text above. This is a manually-tuned value rather than a measured one — a more robust approach would use `ResizeObserver` to measure the actual card height and set spacing dynamically, since any future content change to the stats card (e.g., wrapping to a third line) could silently break this padding assumption.

## 10. Why BEM instead of CSS Modules, Tailwind, or styled-components, given this is a React app?

Looking at the naming pattern throughout — `property-info-card__stat--price`, `site-header__nav-compact--tablet` — BEM gives zero build/tooling overhead beyond plain CSS, and every class name is self-documenting (block, element, and modifier state are all readable at a glance). It also sidesteps CSS Modules' local-scoping indirection and Tailwind's utility verbosity for what are a handful of highly custom, one-off components rather than a large design-system-driven UI. The trade-off is that BEM relies on developer discipline to avoid specificity creep and naming collisions as the app grows; CSS Modules or scoped styles enforce that automatically. For a small, single-page project like this, BEM's directness is a defensible, pragmatic choice.
