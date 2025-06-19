import { effect, Injectable, signal } from '@angular/core';

export enum EThemeType {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    Green = 'green',
    Black = 'black',
}

export const DEFAULT_THEME = EThemeType.Blue;
export const STORAGE_THEME_FIELD_NAME = 'theme:color';
export const THEME_CHANGE_TRANSITION_CLASS = 'global-color-transition';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    public readonly colorTheme = signal<EThemeType>(this._loadInitialThemeState());

    private readonly _themePrefix = 'bc-theme-';

    constructor() {
        this._applyThemeToBody(this.colorTheme());

        effect(() => {
            const theme = this.colorTheme();

            localStorage.setItem(STORAGE_THEME_FIELD_NAME, theme);
            this._applyThemeToBody(theme);
        });
    }

    public toggleColorTheme(theme: EThemeType): void {
        this.colorTheme.update(() => theme);
    }

    private _loadInitialThemeState() {
        const saved = localStorage.getItem(STORAGE_THEME_FIELD_NAME);

        const foundedTheme = Object
            .values(EThemeType)
            .find((theme: EThemeType) => theme === saved);

        if (foundedTheme) {
            return foundedTheme;
        }

        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            return confirm('🌙 We noticed your dark theme. Use it here?') ? EThemeType.Black : DEFAULT_THEME;
        }

        return DEFAULT_THEME;
    }

    private _applyThemeToBody(theme: EThemeType): void {
        const classList = document.body.classList;
        Array.from(classList)
            .filter(className => className.startsWith(this._themePrefix))
            .forEach(className => classList.remove(className));

        classList.add(`${this._themePrefix}${theme}`);
        classList.add(THEME_CHANGE_TRANSITION_CLASS);
        localStorage.setItem(STORAGE_THEME_FIELD_NAME, theme.toString());

        setTimeout(() => {
            classList.remove(THEME_CHANGE_TRANSITION_CLASS);
        }, 500);
    }
}
