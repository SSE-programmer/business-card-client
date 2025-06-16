import { Routes } from '@angular/router';

export const _pagesRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./home-page/home-page.component')
                .then(m => m.HomePageComponent)
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./home-page/home-page.component')
                .then(m => m.HomePageComponent)
    },
    {
        path: 'projects',
        loadComponent: () =>
            import('./projects/projects-page/projects-page.component')
                .then(m => m.ProjectsPageComponent)
    },
    {
        path: 'projects/:id',
        loadComponent: () =>
            import('./projects/project-detail-page/project-detail-page.component')
                .then(m => m.ProjectDetailPageComponent)
    },
    {
        path: 'blog',
        loadComponent: () =>
            import('./blog/blog-page/blog-page.component')
                .then(m => m.BlogPageComponent)
    },
    {
        path: 'blog/:id',
        loadComponent: () =>
            import('./blog/article-detail-page/article-detail-page.component')
                .then(m => m.ArticleDetailPageComponent)
    }
];
