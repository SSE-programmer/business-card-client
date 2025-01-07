import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ELocale } from './shared/enums/locale.enum';
import { APP_DATE_FORMATS, AppDateAdapter } from './shared/adapters/date.adapter';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(
            routes,
            withEnabledBlockingInitialNavigation(),
            withHashLocation()
        ),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: DateAdapter,
            useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: APP_DATE_FORMATS
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'ru-RU'
        },
        {
            provide: LOCALE_ID,
            useValue: ELocale.RU
        },
    ]
};
