import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[bcInsertion]',
    standalone: true
})
export class InsertionDirective {
    public readonly viewContainerRef = inject(ViewContainerRef);
}
