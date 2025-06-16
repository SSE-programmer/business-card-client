import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, Inject, OnDestroy, Output } from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ComponentsService } from '../../services/components.service';


@Directive({
    selector: '[bcClickOutside]',
    standalone: true
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    private readonly componentsService = inject(ComponentsService);

    @Output() bcClickOutside = new EventEmitter<void>();

    public documentClickSubscription: Subscription | undefined;

    constructor(
        private _element: ElementRef,
        @Inject(DOCUMENT) private _document: Document
    ) {
    }

    public ngAfterViewInit(): void {
        this.documentClickSubscription = fromEvent(this._document, 'click')
            .pipe(
                filter((event) => {
                    return !this.componentsService.isInside(
                        event.target as HTMLElement,
                        this._element.nativeElement,
                        true
                    );
                })
            )
            .subscribe(() => {
                this.bcClickOutside.emit();
            });
    }

    public ngOnDestroy(): void {
        this.documentClickSubscription?.unsubscribe();
    }
}
