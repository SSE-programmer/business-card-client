import { Injectable } from '@angular/core';
import * as AOS from 'aos';

@Injectable({ providedIn: 'root' })
export class AosService {
    private initialized = false;

    public init(options?: Record<string, any>): void {
        if (typeof window !== 'undefined' && !this.initialized) {
            AOS.init(options || {
                duration: 800,
                easing: 'ease-in-out',
                debounceDelay: 50,
                throttleDelay: 100,
                once: true
            });
        }

        this.initialized = true;
    }

    public refresh(): void {
        if (typeof window !== 'undefined' && this.initialized) {
            AOS.refresh();
        }
    }
}
