import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ComponentsService {
    public isInside(element: HTMLElement, container: HTMLElement, includingSelf?: boolean) {
        return (element === container && includingSelf) || container.contains(element);
    }
}
