# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
```

No test runner is configured.

## Architecture

This is a React 18 + Vite + Tailwind CSS marketing website for TRACECOOL, a German HVAC engineering company.

### Routing (`src/App.jsx`)
React Router v7 SPA with a single `<Navbar>` and `<Footer>` wrapping all routes:
- `/` — `HomePage` (all home-section components stacked vertically)
- `/solutions`, `/solutions/:id`
- `/services`, `/services/:id`
- `/products`, `/products/:id`
- `/about`, `/contact`

`ScrollToTop` (inside `App`) re-attaches an `IntersectionObserver` on every route change to trigger `.reveal` CSS animations for newly mounted elements.

### Internationalization (`src/context/LanguageContext.jsx`)
- `LanguageProvider` wraps the entire app (set in `src/main.jsx`)
- Supports English (`en`) and Arabic (`ar`); Arabic activates RTL layout via `document.documentElement.dir`
- `useLanguage()` hook provides `{ lang, setLang, t, isRTL }`
- `t('key.nested')` looks up dot-separated paths in `src/i18n/translations.js`
- Language preference persisted to `localStorage` under key `tc-lang`

### Content data (`src/data/pageData.js`)
All content for Solutions, Services, and Products (titles, descriptions, features, section breakdowns, image URLs) is exported as plain arrays from this single file. Detail pages (`SolutionDetailPage`, `ServiceDetailPage`, `ProductDetailPage`) find their record by matching `params.id` against the `id` field.

### Styling conventions
- Tailwind utility classes are primary; custom CSS lives in `src/index.css`
- Brand palette defined in `tailwind.config.js`: `primary` (#071525 navy), `accent` (#1A6FDB blue), `surface` (#F2F6FC)
- `.reveal` class + `.active` (added by `IntersectionObserver`) drives scroll-in animations
- RTL overrides are in `src/index.css` under `[dir="rtl"]` selectors; mirror any new directional CSS there when adding LTR layout features
- Fonts: Inter (default), Cairo (Arabic/RTL)

### Animation
GSAP with `ScrollTrigger` is registered globally in `src/App.jsx`. Used for hero and section entrance animations alongside the CSS-based `.reveal` system.

### Maps
Leaflet (`leaflet` package) is used in the `Branches` component for the global office map.
