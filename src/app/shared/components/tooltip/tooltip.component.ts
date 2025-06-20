import {
    AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef, HostBinding,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    Type,
    viewChild,
} from '@angular/core';
import { TooltipService } from './tooltip.service';
import { TooltipConfig } from './tooltip.config';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InsertionDirective } from '@directives/insertion/insertion.directive';
import { ClickOutsideDirective } from '@directives/click-outside/click-outside.directive';

@Component({
    selector: 'bc-tooltip',
    standalone: true,
    imports: [
        ClickOutsideDirective,
        InsertionDirective,
    ],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly tooltipConfig = inject(TooltipConfig);
    private readonly tooltipService = inject(TooltipService);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<TooltipComponent> | null = null;
    public childComponentRef: ComponentRef<any> | null = null;
    public childComponentType: Type<any> | null = null;
    public width: string | undefined;

    public insertionPoint = viewChild.required(InsertionDirective);

    @HostBinding('class.bc-tooltip-container') get tooltipContainerClass() {
        return true;
    }

    @HostListener('document:keydown.escape')
    public onKeydownHandler() {
        this.close();
    }

    public ngOnInit() {
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

    public ngAfterViewInit() {
        if (this.childComponentType) {
            this._loadChildComponent(this.childComponentType);
        }

        this.cd.detectChanges();
    }

    public ngOnDestroy() {
        if (this.childComponentRef) {
            this.childComponentRef.destroy();
        }
    }

    public close() {
        if (this.componentRef) {
            this.tooltipService.close(this.componentRef);
        }
    }

    private _loadChildComponent(componentType: Type<any>) {
        const viewContainerRef = this.insertionPoint().viewContainerRef;

        viewContainerRef.clear();
        this.childComponentRef = viewContainerRef.createComponent(componentType);
    }

    private _calculateWidth() {
        let width = this.tooltipConfig.width;

        if (this.tooltipConfig.mediaQueries?.length) {
            const mediaQueries = this.tooltipConfig.mediaQueries;

            mediaQueries.forEach(mediaQuery => {
                const isMatch = window.matchMedia(mediaQuery.query).matches;

                if (isMatch) {
                    width = mediaQuery.width;
                }
            });
        }

        this.width = width;
    }
}
