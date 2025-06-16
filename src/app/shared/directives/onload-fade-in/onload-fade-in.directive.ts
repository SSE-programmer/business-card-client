import { ChangeDetectorRef, Directive, ElementRef, HostBinding, inject, OnInit } from '@angular/core';

@Directive({
    selector: '[bcOnloadFadeIn]',
    standalone: true,
})
export class OnloadFadeInDirective implements OnInit {
    public readonly elementRef = inject(ElementRef);
    public readonly cdr = inject(ChangeDetectorRef);

    @HostBinding('style.opacity') opacity: number | null | undefined = 0;

    public ngOnInit(): void {
        const element = this.elementRef.nativeElement;

        if (!(element instanceof HTMLImageElement)) {
            throw new Error('This is not an Image Element');
        }

        element.style.transition = 'opacity 0.2s';

        element.onload = () => {
            this.opacity = null;
            element.style.transition = '';
            this.cdr.markForCheck();
        };
    }
}
