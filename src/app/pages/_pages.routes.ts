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
        path: 'blog',
        loadComponent: () =>
            import('./blog/blog-page/blog-page.component')
                .then(m => m.BlogPageComponent)
    },
    {
        path: '**', loadComponent: () =>
            import('./not-found-page/not-found-page.component')
                .then(m => m.NotFoundPageComponent)
    }
];
