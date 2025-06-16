import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewportService {
    private _resizeSubject = new BehaviorSubject({
        width: window.innerWidth,
        height: window.innerHeight
    });

    public dimensions$ = this._resizeSubject.asObservable();

    constructor() {
        window.addEventListener('resize', () => {
            this._resizeSubject.next({
                width: window.innerWidth,
                height: window.innerHeight
            });
        });
    }
}
