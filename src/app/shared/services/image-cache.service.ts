import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, shareReplay, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageCacheService {
    private readonly cache = new Map<string, Observable<string>>();

    cacheImage(url: string): Observable<string> {
        const cachedUrl = this.cache.get(url);

        if (cachedUrl) {
            return cachedUrl;
        }

        const request$ = from(fetch(url)).pipe(
            switchMap(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load image: ${response.statusText}`);
                }

                return from(response.blob());
            }),
            switchMap(blob => {
                return new Observable<string>((observer) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        observer.next(reader.result as string);
                        observer.complete();
                    };
                    reader.onerror = (error) => observer.error(error);
                    reader.readAsDataURL(blob);
                });
            }),
            catchError(error => {
                console.error(`Failed to cache image: ${url}`, error);

                return of(url);
            }),
            shareReplay(1)
        );

        this.cache.set(url, request$);

        return request$;
    }

    clearCache(): void {
        this.cache.clear();
    }

    removeFromCache(url: string): void {
        this.cache.delete(url);
    }
}
