import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    Renderer2,
    signal,
    viewChild,
} from '@angular/core';
import { debounceTime, fromEvent, Subscription, tap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageViewerService } from './image-viewer.service';
import { ImageViewerConfig } from './image-viewer.config';
import { TagComponent } from '@components/tag/tag.component';
import { CdkTrapFocus } from '@angular/cdk/a11y';

const SELECTED_INDEX_VISIBILITY_TIME = 2000;
const MOUSE_MOVE_THROTTLE_TIME = 16;
const MIN_PIXELS_PER_SECONDS_FOR_SWITCH = 40;
const MIN_COORDINATE_DELTA_FOR_SWITCH = 50;

@Component({
    selector: 'bc-image-viewer',
    standalone: true,
    imports: [
        TagComponent,
        CdkTrapFocus
    ],
    templateUrl: './image-viewer.component.html',
    styleUrl: './image-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent implements OnInit, OnDestroy {
    protected readonly Math = Math;

    public readonly config = inject(ImageViewerConfig);
    private readonly imageViewerService = inject(ImageViewerService);
    private readonly elementRef = inject(ElementRef);
    private readonly renderer2 = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<any> | null = null;
    public selectedMediaIndex = this.config.selectedMediaIndex;
    protected moveDeltaX = signal(0);
    protected moveXSpeed = signal(0);
    protected moveDeltaY = signal(0);

    private _resizeObserver: ResizeObserver | null = null;
    private _selectedIndexAnimationTimeoutId: number | null = null;
    private _startMoveX = 0;
    private _startMoveTime = 0;
    private _startMoveY = 0;
    private _isDragging = false;
    private _subscriptions = new Subscription();

    public selectedIndex = viewChild.required('selectedIndex', { read: ElementRef });

    @HostListener('document:keydown', ['$event'])
    public onKeydownHandler(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.closeViewer();
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

    public closeViewer(): void {
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

        this._subscriptions.unsubscribe();
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

        this._subscriptions.add(
            touchStart$.subscribe(e => this._startDrag(e.touches[0].pageX, e.touches[0].pageY)),
        );

        this._subscriptions.add(
            mouseDown$
                .pipe(tap((e) => {
                    e.preventDefault();
                    this._startDrag(e.pageX, e.pageY);
                }))
                .subscribe(),
        );

        const move$ = touchMove$.pipe(
            throttleTime(MOUSE_MOVE_THROTTLE_TIME),
            tap((e) => this._drag(e.touches[0].pageX, e.touches[0].pageY)),
        );

        this._subscriptions.add(
            move$.subscribe(),
        );

        this._subscriptions.add(
            mouseMove$.pipe(
                throttleTime(MOUSE_MOVE_THROTTLE_TIME),
                tap(e => {
                    if (this._isDragging) {
                        e.preventDefault();
                        this._drag(e.pageX, e.pageY);
                    }
                }),
            ).subscribe(),
        );

        const end$ = touchEnd$.subscribe(() => this._endDrag());
        const mouseEnd$ = mouseUp$.subscribe(() => this._endDrag());
        const mouseLeaveSub$ = mouseLeave$.subscribe(() => this._endDrag());

        this._subscriptions.add(end$);
        this._subscriptions.add(mouseEnd$);
        this._subscriptions.add(mouseLeaveSub$);
    }

    private _startDrag(pageX: number, pageY: number): void {
        this._isDragging = true;
        this._startMoveTime = new Date().getTime();
        this._startMoveX = pageX - this.elementRef.nativeElement.offsetLeft;
        this._startMoveY = pageY;
    }

    private _drag(pageX: number, pageY: number): void {
        if (!this._isDragging) {
            return;
        }

        this.moveDeltaX.set(pageX - this._startMoveX);
        this.moveDeltaY.set(pageY - this._startMoveY);
    }

    private _endDrag() {
        this._isDragging = false;

        const moveDeltaX = this.moveDeltaX();
        const moveXTime = new Date().getTime() - this._startMoveTime;
        const moveXSpeed = moveDeltaX * 1000 / moveXTime;

        const minDeltaForSwitch = Math.min(MIN_COORDINATE_DELTA_FOR_SWITCH, this.elementRef.nativeElement.offsetWidth / 3);
        const minDeltaSpeedForSwitch = MIN_PIXELS_PER_SECONDS_FOR_SWITCH;

        if (Math.abs(moveDeltaX) > minDeltaForSwitch || moveXSpeed >= minDeltaSpeedForSwitch) {
            this.switchMedia(moveDeltaX > 0 ? 'left' : 'right');
        }

        const moveDeltaY = this.moveDeltaY();

        if (Math.abs(moveDeltaY) > Math.min(MIN_COORDINATE_DELTA_FOR_SWITCH, this.elementRef.nativeElement.offsetHeight / 3)) {
            this.closeViewer();
        }

        this.moveDeltaX.set(0);
        this.moveDeltaY.set(0);
    }
}
