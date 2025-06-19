import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
    selector: '[bcFocusVisible]',
})
export class FocusVisibleDirective {
    private readonly elementRef = inject(ElementRef);

    @Output() bcFocusVisible = new EventEmitter<FocusEvent>();

    @HostListener('focus', ['$event'])
    onFocus(event: FocusEvent) {
        if (this.elementRef.nativeElement.matches(':focus-visible')) {
            this.bcFocusVisible.emit(event);
        }
    }
}
