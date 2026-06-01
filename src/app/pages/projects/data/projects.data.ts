import { EProjectCategory, IProject, IProjectCategory } from '../models/project.model';

export const PROJECT_CATEGORIES: IProjectCategory[] = [
    { type: EProjectCategory.Commercial, title: 'Commercial' },
    { type: EProjectCategory.Pet, title: 'Pet' },
    { type: EProjectCategory.Challenge, title: 'Challenges' },
];

export const PROJECTS: IProject[] = [
    {
        id: 'inschooltech',
        title: 'Inschooltech',
        category: EProjectCategory.Commercial,
        description: 'Private school educational platform & neurodidactic MVP. Led a cross-functional team, migrated from AngularJS to Angular 17+, built an in-house UI library, and optimized PDF generation.',
        stack: ['Angular 17+', 'TypeScript', 'AngularJS', 'WebSocket', 'Webpack', 'Storybook', 'Bun', 'Elysia', 'Gotenberg'],
        period: { from: '2023-07' },
        contentPath: 'assets/projects/inschooltech/content.md',
        previewImage: 'assets/projects/inschooltech/preview.webp',
        images: [
            'assets/projects/inschooltech/img.webp',
            'assets/projects/inschooltech/img_1.webp',
            'assets/projects/inschooltech/img_2.webp',
            'assets/projects/inschooltech/img_3.webp',
            'assets/projects/inschooltech/img_4.webp',
            'assets/projects/inschooltech/img_5.webp',
            'assets/projects/inschooltech/img_6.webp',
            'assets/projects/inschooltech/img_7.webp',
        ]
    },
    {
        id: 'smart-consulting',
        title: 'Smart Consulting',
        category: EProjectCategory.Commercial,
        description: 'Regional government services portals and social projects for dozens of regions. Implemented accessibility modes, real-time booking, dynamic form architecture, and customizable regional themes.',
        stack: ['Angular', 'TypeScript', 'RxJS', 'WebSocket', 'SCSS', 'WCAG 2.1'],
        period: { from: '2021-07', to: '2023-12' },
        contentPath: 'assets/projects/smart-consulting/content.md',
        previewImage: 'assets/projects/smart-consulting/preview.webp',
        images: [
            'assets/projects/smart-consulting/img.webp',
            'assets/projects/smart-consulting/img_1.webp',
            'assets/projects/smart-consulting/img_2.webp',
            'assets/projects/smart-consulting/img_3.webp',
            'assets/projects/smart-consulting/img_4.webp',
            'assets/projects/smart-consulting/img_5.webp',
        ]
    },
    {
        id: 'business-card',
        title: 'Personal Portfolio',
        category: EProjectCategory.Pet,
        description: 'Digital business card & portfolio website with blog integration, theming, project showcase, and smooth page transitions.',
        stack: ['Angular 20', 'TypeScript', 'SCSS', 'Three.js', 'highlight.js', 'AOS', 'View Transitions API'],
        period: { from: '2024-06' },
        contentPath: 'assets/projects/business-card/content.md',
        previewImage: 'assets/projects/business-card/preview.webp',
    },
    {
        id: 'budesh',
        title: 'Budesh? Cafe',
        category: EProjectCategory.Pet,
        description: 'Full-stack website for a real coffee shop: SSR public site, admin CMS, Go API, PostgreSQL, Docker deployment on budesh-coffee.ru with 152-FZ compliance.',
        stack: ['Angular 21', 'SSR', 'Go', 'Fiber v3', 'PostgreSQL', 'Docker', 'Nginx', 'Tailwind CSS v4.0', 'GitLab CI'],
        period: { from: '2026-05', to: '2026-05' },
        contentPath: 'assets/projects/budesh/content.md',
        previewImage: 'assets/projects/budesh/preview.webp',
        images: [
            'assets/projects/budesh/img_1.webp',
            'assets/projects/budesh/img_2.webp',
            'assets/projects/budesh/img_3.webp',
            'assets/projects/budesh/img_4.webp',
            'assets/projects/budesh/img_5.webp',
            'assets/projects/budesh/img_6.webp',
            'assets/projects/budesh/img_7.webp',
            'assets/projects/budesh/img_8.webp',
        ]
    },
    {
        id: 'annoto',
        title: 'Annoto',
        category: EProjectCategory.Challenge,
        description: 'SPA for creating articles and annotating text. Built entirely without third-party UI libraries using Range API, TreeWalker, and Renderer2.',
        stack: ['Angular 21', 'TypeScript', 'SCSS', 'Range API', 'DOM API', 'localStorage'],
        period: { from: '2026-03', to: '2026-03' },
        contentPath: 'assets/projects/annoto/content.md',
        previewImage: 'assets/projects/annoto/preview.webp',
        images: [
            'assets/projects/annoto/img.webp',
            'assets/projects/annoto/img_1.webp',
            'assets/projects/annoto/img_2.webp',
            'assets/projects/annoto/img_3.webp',
            'assets/projects/annoto/img_4.webp',
        ]
    },
    {
        id: 'soft-mall-calendar',
        title: 'Soft Mall Calendar',
        category: EProjectCategory.Challenge,
        description: 'Employee calendar with event management, JSON import/export, real-time time indicator, and keyboard navigation. All UI components built from scratch.',
        stack: ['Vue 3', 'TypeScript', 'Vite', 'SCSS'],
        period: { from: '2025-07', to: '2025-07' },
        contentPath: 'assets/projects/soft-mall-calendar/content.md',
        previewImage: 'assets/projects/soft-mall-calendar/preview.webp',
        images: [
            'assets/projects/soft-mall-calendar/img.webp',
            'assets/projects/soft-mall-calendar/img_1.webp',
        ]
    },
];
