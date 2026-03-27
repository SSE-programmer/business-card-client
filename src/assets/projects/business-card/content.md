A personal portfolio and digital business card website showcasing career, skills, blog, and projects.

**Live:** [sse-programmer.com](https://sse-programmer.com)

---

## Features

- **Home page** — avatar, contacts, career timeline, skills, education, interests.
- **Blog** — Telegram channel integration with real-time post rendering, media grids, reactions, and comments count.
- **Projects** — categorized portfolio with detail pages and markdown rendering.
- **Theming** — 5 color themes (Blue, Red, Yellow, Green, Black) with smooth transitions, persisted to `localStorage`.
- **Settings menu** — theme selector accessible from the header.
- **View Transitions API** — smooth page transition animations.
- **AOS** — scroll-driven entrance animations on the home page.

## Technical Highlights

- **Angular 20**, standalone components, no NgModules.
- **Zoneless** — `provideZonelessChangeDetection()` for maximum performance.
- **Signals** — reactive state management without Zone.js overhead.
- **OnPush** change detection strategy across all components.
- **Lazy loading** — all pages loaded on demand via `loadComponent`.
- **Hash-based routing** with `withViewTransitions()`.
- Custom **design system** with utility CSS classes (`bc-flex`, `bc-gap-*`, `bc-text-*`, etc.).
- **Image Viewer** — full-screen media viewer with keyboard navigation.
- **Dynamic Modals** — service-based modal system with media query support.
- **Markdown rendering** via `marked` + `highlight.js` for project descriptions.
- Fully responsive layout with mobile-first approach.
