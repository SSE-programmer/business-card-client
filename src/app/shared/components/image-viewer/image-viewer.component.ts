import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit, Renderer2,
    viewChild,
} from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Subscription, tap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageViewerService } from './image-viewer.service';
import { ImageViewerConfig } from './image-viewer.config';
import { TagComponent } from '@components/tag/tag.component';
import { AsyncPipe } from '@angular/common';

const SELECTED_INDEX_VISIBILITY_TIME = 2000;
const MOUSE_MOVE_TROTTLE_TIME = 16;

@Component({
    selector: 'bc-image-viewer',
    standalone: true,
    imports: [
        TagComponent,
        AsyncPipe,
    ],
    templateUrl: './image-viewer.component.html',
    styleUrl: './image-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent implements OnInit, OnDestroy {
    protected readonly Math = Math;

    public readonly config = inject(ImageViewerConfig);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly imageViewerService = inject(ImageViewerService);
    private readonly elementRef = inject(ElementRef);
    private readonly renderer2 = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<any> | null = null;
    public selectedMediaIndex = this.config.selectedMediaIndex;
    private _moveDeltaX$ = new BehaviorSubject(0);
    public moveDeltaX$ = this._moveDeltaX$.asObservable();

    private _resizeObserver: ResizeObserver | null = null;
    private _selectedIndexAnimationTimeoutId: number | null = null;
    private startMoveX = 0;
    private isDragging = false;
    private subscriptions = new Subscription();

    public selectedIndex = viewChild.required('selectedIndex', { read: ElementRef });

    @HostListener('document:keydown', ['$event'])
    public onKeydownHandler(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                this.switchMedia('left');
                break;
            case 'ArrowRight':
                this.switchMedia('right');
                break;
        }
    }

    public ngOnInit(): void {
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(500),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this._setupEventListeners();
    }

    public closeModal(): void {
        this.imageViewerService.closeModal();
    }

    public ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        this._resizeObserver?.disconnect();
        this._resizeObserver = null;

        if (this._selectedIndexAnimationTimeoutId) {
            clearTimeout(this._selectedIndexAnimationTimeoutId);
        }

        this.subscriptions.unsubscribe();
    }

    protected switchMedia(direction: 'left' | 'right') {
        if (direction === 'left') {
            this.selectedMediaIndex = Math.max(0, this.selectedMediaIndex - 1);
        }

        if (direction === 'right') {
            this.selectedMediaIndex = Math.min(this.config.media.length - 1, this.selectedMediaIndex + 1);
        }

        const selectedIndexEl = this.selectedIndex().nativeElement;

        this.renderer2.addClass(selectedIndexEl, 'visible');

        if (this._selectedIndexAnimationTimeoutId) {
            clearTimeout(this._selectedIndexAnimationTimeoutId);
        }

        this._selectedIndexAnimationTimeoutId = setTimeout(() => {
            this.renderer2.removeClass(selectedIndexEl, 'visible');
            this._selectedIndexAnimationTimeoutId = null;
        }, SELECTED_INDEX_VISIBILITY_TIME);
    }

    private _setupEventListeners() {
        const element = this.elementRef.nativeElement;

        const touchStart$ = fromEvent<TouchEvent>(element, 'touchstart');
        const mouseDown$ = fromEvent<MouseEvent>(element, 'mousedown');

        const touchMove$ = fromEvent<TouchEvent>(element, 'touchmove');
        const mouseMove$ = fromEvent<MouseEvent>(element, 'mousemove');

        const touchEnd$ = fromEvent<TouchEvent>(element, 'touchend');
        const mouseUp$ = fromEvent<MouseEvent>(element, 'mouseup');
        const mouseLeave$ = fromEvent<MouseEvent>(element, 'mouseleave');

        this.subscriptions.add(
            touchStart$.subscribe(e => this.startDrag(e.touches[0].pageX)),
        );

        this.subscriptions.add(
            mouseDown$
                .pipe(tap((e) => {
                    e.preventDefault();
                    this.startDrag(e.pageX);
                }))
                .subscribe(),
        );

        const move$ = touchMove$.pipe(
            throttleTime(MOUSE_MOVE_TROTTLE_TIME),
            tap((e) => this.drag(e.touches[0].pageX)),
        );

        this.subscriptions.add(
            move$.subscribe(),
        );

        this.subscriptions.add(
            mouseMove$.pipe(
                throttleTime(MOUSE_MOVE_TROTTLE_TIME),
                tap(e => {
                    if (this.isDragging) {
                        e.preventDefault();
                        this.drag(e.pageX);
                    }
                }),
            ).subscribe(),
        );

        const end$ = touchEnd$.subscribe(() => this.endDrag());
        const mouseEnd$ = mouseUp$.subscribe(() => this.endDrag());
        const mouseLeaveSub$ = mouseLeave$.subscribe(() => this.endDrag());

        this.subscriptions.add(end$);
        this.subscriptions.add(mouseEnd$);
        this.subscriptions.add(mouseLeaveSub$);
    }

    private startDrag(pageX: number) {
        this.isDragging = true;
        this.startMoveX = pageX - this.elementRef.nativeElement.offsetLeft;
    }

    private drag(pageX: number) {
        if (!this.isDragging) {
            return;
        }

        this._moveDeltaX$.next(pageX - this.startMoveX);
    }

    private endDrag() {
        this.isDragging = false;

        const moveDeltaX = this._moveDeltaX$.value;

        if (Math.abs(moveDeltaX) > this.elementRef.nativeElement.offsetWidth / 2) {
            this.switchMedia(moveDeltaX > 0 ? 'left' : 'right');
        }

        this._moveDeltaX$.next(0);
    }
}
