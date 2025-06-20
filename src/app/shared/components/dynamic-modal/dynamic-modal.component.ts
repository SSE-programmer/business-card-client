import {
    AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
} from '@angular/core';
import { InsertionDirective } from '@directives/insertion/insertion.directive';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DynamicModalService } from './dynamic-modal.service';
import { DynamicModalConfig } from './dynamic-modal.config';

@Component({
    selector: 'bc-dynamic-modal',
    standalone: true,
    imports: [
        InsertionDirective,
    ],
    templateUrl: './dynamic-modal.component.html',
    styleUrl: './dynamic-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicModalComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly config = inject(DynamicModalConfig);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly dynamicModalService = inject(DynamicModalService);
    private readonly destroyRef = inject(DestroyRef);

    public childComponentType: Type<any> | null = null;
    public componentRef: ComponentRef<any> | null = null;
    public width: string | undefined;
    public height: string | undefined;

    private _resizeObserver: ResizeObserver | null = null;

    @ViewChild(InsertionDirective)
    insertionPoint!: InsertionDirective;

    @ViewChild('dynamicModal')
    dynamicModal!: ElementRef;

    @ViewChild('body')
    body!: ElementRef;


    @HostListener('document:keydown.escape')
    public onKeydownHandler() {
        this.closeModal();
    }

    public ngOnInit(): void {
        this._calculateWidth();

        fromEvent(window, 'resize')
            .pipe(
                debounceTime(500),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this._calculateWidth();
                this.cd.detectChanges();
            });
    }

    public ngAfterViewInit(): void {
        if (!this.childComponentType) {
            throw new Error('Child component type must be defined');
        }

        this._loadChildComponent(this.childComponentType);
        this.cd.detectChanges();

        if (this.config.autoHeight) {
            const bodyElement = this.body.nativeElement;
            const dynamicModalElement = this.dynamicModal.nativeElement;
            const observer = new ResizeObserver(() => {
                dynamicModalElement.style.height = `${bodyElement.offsetHeight}px`;
            });

            observer.observe(bodyElement);
        }
    }

    public closeModal(): void {
        this.dynamicModalService.closeModal(this.config.modalName);
    }

    public ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        this._resizeObserver?.disconnect();
        this._resizeObserver = null;
    }

    private _loadChildComponent(componentType: Type<any>): void {
        const viewContainerRef = this.insertionPoint.viewContainerRef;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent(componentType);
    }

    private _calculateWidth(): void {
        let width = this.config.width;
        let height = this.config.height;

        if (this.config.mediaQueries?.length) {
            const mediaQueries = this.config.mediaQueries;

            mediaQueries.forEach(mediaQuery => {
                const isMatch = window.matchMedia(mediaQuery.query).matches;

                if (isMatch) {
                    width = mediaQuery.width;
                    height = mediaQuery.height;
                }
            });
        }

        this.width = width;

        if (!this.config.autoHeight) {
            this.height = height;
        }
    }
}
