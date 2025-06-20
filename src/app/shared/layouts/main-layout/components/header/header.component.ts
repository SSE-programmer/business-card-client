import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { INavigationRoute } from '@models/INavigationRoute';
import { LogoComponent } from '@components/logo/logo.component';
import { IconSettingsComponent } from '@components/icons/icon-settings/icon-settings.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';

@Component({
    selector: 'bc-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        RouterLink,
        RouterLinkActive,
        LogoComponent,
        IconSettingsComponent,
        SettingsMenuComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    public navigationRoutes: INavigationRoute[] = [
        {
            title: 'Home',
            link: '/home'
        },
        // {
        //     title: 'Projects',
        //     link: '/projects'
        // },
        {
            title: 'Blog',
            link: '/blog'
        }
    ];

    public showSettingsMenu = false;

    public toggleSettingsMenu() {
        this.showSettingsMenu = !this.showSettingsMenu;
    }
}
