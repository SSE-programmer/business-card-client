# Inschooltech — Educational Platform & Neurodidactic MVP

**Role:** Lead Frontend Developer  
**Type:** Full-time, Remote  
**Period:** Jul 2023 — Present

Private school educational platform with a neurodidactic MVP module, serving hundreds of students and educators.

---

## Technical Leadership & Process Optimization

- Established development workflows: introduced code standards, task tracking/commenting processes, and biweekly retrospectives — **reduced sprint delays by 30%**.
- Mentored **4 frontend developers** on best practices, improving code quality and **reducing PR review time by 40%**.
- Migrated legacy code from **AngularJS to Angular 17+** (hybrid mode), updated libraries, and replaced Grunt with Webpack — **cut build time by 50%**.
- **Reduced bundle size by 35%** by removing unused libraries, adding minified dependencies, and optimizing assets.

## UI & Architecture

- Introduced **TypeScript**, modular architecture, and PrimeNG with custom theming/wrappers. Later replaced PrimeNG with an **in-house UI library** (using `ControlValueAccessor`) to avoid licensing issues.
- Created a **reusable Angular component library** published via Nexus npm, documented with a demo project and later migrated to **Storybook** for streamlined testing and documentation.
- Rewrote a **Unified Auth Portal from React to Angular 17+** to unify the tech stack, simplifying hiring and maintenance.
- Built a **real-time WebSocket chat** with group/private messaging, file sharing, and user management.

## Performance & Tooling

- Overhauled PDF generation: migrated from `html2canvas + jsPDF` (client-side) to a **Bun + Elysia + Gotenberg** microservice — improved PDF quality while reducing file size and generation time from **dozens of minutes to a few seconds**.
- Implemented **pre-commit hooks** for ESLint, catching 90% of syntax errors before code review.

## Team & Collaboration

- Interviewed and onboarded new hires for a cross-functional team: 4 FE/BE devs, 3 QA, 3 analysts, 1 designer.
