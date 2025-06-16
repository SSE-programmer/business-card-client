import { Component, inject } from '@angular/core';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';
import { EThemeType, ThemeService } from '../../../../../../services/theme.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'bc-settings-menu',
    templateUrl: './settings-menu.component.html',
    styleUrls: ['./settings-menu.component.scss'],
    imports: [
        ColorSelectorComponent,
    ],
    standalone: true,
    animations: [
        trigger('hostHeightAnimation', [
            transition(':enter', [
                style({ maxHeight: '0', opacity: 0, overflow: 'hidden' }),
                animate('200ms ease-out', style({ maxHeight: '33px', opacity: 1 })),
            ]),
            transition(':leave', [
                style({ maxHeight: '33px', opacity: 1, overflow: 'hidden' }),
                animate('200ms ease-in', style({ maxHeight: '0', opacity: 0 })),
            ]),
        ]),
    ],
    host: {
        '[@hostHeightAnimation]': '', // Привязываем анимацию к хосту
    },
})
export class SettingsMenuComponent {
    protected readonly EThemeType = EThemeType;

    private readonly themeService = inject(ThemeService);

    public themes: EThemeType[] = Object.values(EThemeType);

    public toggleColorTheme(theme: EThemeType): void {
        this.themeService.toggleColorTheme(theme);
    }

}
