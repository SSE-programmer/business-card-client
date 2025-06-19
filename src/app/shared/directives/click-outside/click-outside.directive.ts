import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ComponentsService } from '../../services/components.service';


@Directive({
    selector: '[bcClickOutside]',
    standalone: true,
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    private readonly componentsService = inject(ComponentsService);
    private readonly element = inject(ElementRef);
    private readonly document = inject(DOCUMENT);

    @Output() bcClickOutside = new EventEmitter<void>();

    public documentClickSubscription: Subscription | undefined;

    public ngAfterViewInit(): void {
        this.documentClickSubscription = fromEvent(this.document, 'click')
            .pipe(
                filter((event) => {
                    return !this.componentsService.isInside(
                        event.target as HTMLElement,
                        this.element.nativeElement,
                        true,
                    );
                }),
            )
            .subscribe(() => {
                this.bcClickOutside.emit();
            });
    }

    public ngOnDestroy(): void {
        this.documentClickSubscription?.unsubscribe();
    }
}
