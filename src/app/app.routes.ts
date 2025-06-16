import { Routes } from '@angular/router';
import { _pagesRoutes } from './pages/_pages.routes';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: _pagesRoutes
    }
];
