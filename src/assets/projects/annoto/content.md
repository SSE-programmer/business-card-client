# Annoto — Text Annotation SPA

A single-page application for creating articles and annotating text, built entirely **without third-party UI libraries** — all functionality is implemented using Angular, TypeScript, HTML, CSS, and native browser APIs.

**Demo:** [annoto-vercel.vercel.app](https://annoto-vercel.vercel.app)  
**Source:** [github.com/SSE-programmer/Annoto](https://github.com/SSE-programmer/Annoto)

---

## Features

- **CRUD for articles** — create, edit, delete, and browse articles (plain text, no formatting).
- **Text annotation** — select any text fragment, assign a color and a text note.
- **Highlight rendering** — annotated text is underlined with the selected color.
- **Tooltips** — hovering over highlighted text shows the annotation.
- **Persistent storage** — all data is stored in `localStorage` and restored on reload.

## Technical Approach

- **Angular 21**, standalone components, no NgModules.
- **Zoneless** — `provideZonelessChangeDetection()`.
- **Lazy loading** for routes, **OnPush** change detection.
- **Signals + RxJS** — signals for component state, RxJS for async streams.
- DOM manipulation via **Range API, TreeWalker, Renderer2** — no external annotation libraries.

## Possible Improvements

- Scroll-to-top button.
- Overlapping annotations (splitting annotation tags at intersection points).
- In-place article text editing without discarding existing annotations.
