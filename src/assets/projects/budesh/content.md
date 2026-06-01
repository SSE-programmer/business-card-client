# Budesh? — Cafe Website & Admin Panel

Full-stack website for a real coffee shop **«Будешь?»** in Novosibirsk — public site with SSR, content management admin panel, and production deployment on **budesh-coffee.ru**.

**Live:** [budesh-coffee.ru](https://budesh-coffee.ru)

---

## Overview

End-to-end product for a small business: visitors browse the menu, promotions, gallery, and contacts; the cafe owner manages all content through a protected admin panel without touching code.

Monorepo structure:

```
budesh/
├── src/           # Angular 21 client (SSR)
├── server/        # Go backend (Fiber v3)
├── docker/        # Nginx, docker-compose, SSL
└── .gitlab-ci.yml # CI/CD pipeline
```

## Public Site

- **Home** — hero, cafe info, gallery preview, flying pet animation (CSS + Web Animations API, SSR-safe with `ngSkipHydration`).
- **Menu** — categories, items with price, weight, calories, allergens, labels, and variants.
- **Promotions** — seasonal offers and special deals.
- **About** — editable brand values and story blocks.
- **Contacts** — address, hours, phone, social links, static map image (no third-party map APIs), links to 2GIS and Yandex Maps profiles.
- **Legal pages** — privacy policy and cookie policy (152-FZ compliance).

### SEO & Performance

- **SSR** for all public pages via Angular Universal + Express.
- Per-route **meta tags**, Open Graph, canonical URLs, and **JSON-LD** (LocalBusiness, WebSite, BreadcrumbList).
- **NgOptimizedImage**, lazy-loaded routes, WebP images.
- **ETag** and Cache-Control headers on public API GET endpoints.
- Gzip and security headers (CSP, HSTS) via Nginx.

### UX Details

- Cookie consent banner (cannot be dismissed without consent — 152-FZ requirement).
- Maintenance mode banner driven by backend flag.
- Horizontal drag-scroll directive for touch-friendly carousels.
- Custom design system with CSS variables (`--b-*`), Golos Text font, no UI library.

## Admin Panel

JWT-based auth with **access (15 min) + refresh (7 days)** tokens in httpOnly cookies.

Sections:

- **Dashboard** — overview and quick links.
- **Menu** — CRUD for categories, items, labels, allergens, and size variants.
- **Promotions** — create and schedule promotional content.
- **Gallery** — image management with upload.
- **About** — editable value cards.
- **Info** — cafe details, contacts, work hours, social links, map image.

File uploads go through a dedicated endpoint with cleanup of orphaned files.

## Backend (Go)

- **Fiber v3** REST API with layered architecture: handlers → services → repositories.
- **PostgreSQL** via pgx with versioned SQL migrations.
- Parameterized queries only — no string concatenation in SQL.
- **Rate limiting** on all endpoints; stricter limits on login (10 attempts/min).
- **CORS** restricted to production domain.
- Input validation via go-playground/validator.

Public API: menu, cafe info, gallery, promotions, about values.  
Admin API: full CRUD + file upload.

## DevOps

- **Docker** multi-stage builds for client and server.
- **Nginx** reverse proxy: SSL (Let's Encrypt), HTTP→HTTPS, www→apex redirect, static file serving, API proxying.
- **GitLab CI/CD** — lint, build, docker push, deploy on `master`.
- Deploy scripts for env generation, DB restore, and upload sync.

## Compliance (152-FZ)

- Mandatory cookie consent before tracking.
- Privacy and cookie policy pages with business requisites (ИНН, ОГРНИП).
- Footer copyright with legal entity info.
- Instagram link includes required Meta extremist organization disclaimer.

## Technical Highlights

| Layer | Stack |
|-------|-------|
| Frontend | Angular 21, SSR, Tailwind CSS 4, standalone components, signals |
| Backend | Go 1.25, Fiber v3, JWT, pgx/PostgreSQL |
| Infra | Docker, Nginx, GitLab CI, Let's Encrypt |
| Security | httpOnly JWT cookies, rate limiting, CSP, CORS, bcrypt passwords |
