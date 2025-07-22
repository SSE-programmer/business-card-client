import { IJobExperience } from '@components/career-timeline/models/IJobExperience';

export const JOB_EXPERIENCE: IJobExperience[] = [
    {
        company: 'Smart Consulting',
        positions: [
            {
                title: 'Software Engineer',
                startDate: new Date('2021-07-15'),
                endDate: new Date('2022-09-15'),
                isFullTime: true,
                projects: [
                    'Regional portals of public services',
                    'Active citizen',
                ],
                techStack: ['AngularJS', 'JavaScript', 'JQuery', 'Grunt', 'REST API', 'Swagger', 'Websocket'],
                description: 'Refactored legacy code and improved system scalability',
            },
            {
                title: 'Web developer',
                startDate: new Date('2022-09-15'),
                endDate: new Date('2023-07-15'),
                isFullTime: true,
                projects: [
                    'Regional portals of public services',
                    'Active citizen',
                ],
                techStack: ['AngularJS', 'JavaScript', 'JQuery', 'Grunt', 'REST API', 'Swagger', 'Websocket'],
                achievements: [
                    'Expanded the functionality of the dynamic form designer',
                    'Implemented a redesign of the entire platform for one of the clients',
                ],
                description: 'Refactoring legacy code, improving system scalability, creating new modules',
            },
            {
                title: 'Software Engineer',
                startDate: new Date('2023-08-15'),
                endDate: new Date('2023-12-15'),
                isFullTime: false,
                projects: [
                    'Regional portals of public services',
                    'Active citizen',
                ],
                techStack: ['AngularJS', 'JavaScript', 'JQuery', 'Grunt', 'REST API', 'Swagger', 'Websocket'],
                achievements: [
                    'Implemented the "Life Situations" module for quick navigation through services',
                    'I have improved the "Mode for the visually impaired" and implemented it on all pages where it was not available',
                ],
                description: 'Refactoring legacy code, improving system scalability, creating new modules',
            },
        ],
    },
    {
        company: 'Inschooltech',
        positions: [
            {
                title: 'Frontend Developer',
                startDate: new Date('2023-07-15'),
                endDate: new Date('2024-07-15'),
                isFullTime: true,
                projects: ['Education platform', 'Neurodidactic service'],
                techStack: [
                    'Angular',
                    'TypeScript',
                    'JavaScript',
                    'Webpack',
                    'Chart.js',
                    'REST API',
                    'NGRX',
                    'RxJS',
                    'PrimeNG',
                    'BEM',
                ],
                achievements: [
                    'Developed a prototype of a neurodidactic service from scratch',
                    'Migrated legacy AngularJS/JavaScript projects to Angular 17+ (hybrid mode), reducing technical debt',
                ],
                description: 'Developed and maintained web applications for education and SaaS platforms. Upgraded AngularJS projects to Angular 17 with TypeScript integration.',
            },
            {
                title: 'Head of Frontend Development',
                startDate: new Date('2024-07-15'),
                isFullTime: true,
                projects: ['Education platform'],
                techStack: [
                    'Angular',
                    'TypeScript',
                    'JavaScript',
                    'Webpack',
                    'Chart.js',
                    'REST API',
                    'NGRX',
                    'RxJS',
                    'PrimeNG',
                    'BEM',
                    'Storybook',
                    'WebSocket'
                ],
                achievements: [
                    'Lead frontend development for multiple projects, optimizing performance and workflows',
                    'Reduced bundle size by 30% via dead-code elimination and minification',
                    'Designed a custom UI library (replacing PrimeNG) using ControlValueAccessor and complex components',
                    'Established monorepo architecture with Nexus for shared Angular libraries (+ demo/docs via Storybook)',
                    'Introduced pre-commit hooks (ESLint) and standardized code practices across teams',
                    'Hired/trained 5+ developers and conducted technical interviews',
                ],
                description: 'Developed and maintained web applications for education and SaaS platforms. Upgraded AngularJS projects to Angular 17 with TypeScript integration.',
            },
        ],
    },
];
