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
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageViewerService } from './image-viewer.service';
import { ImageViewerConfig } from './image-viewer.config';
import { TagComponent } from '@components/tag/tag.component';

const SELECTED_INDEX_VISIBILITY_TIME = 2000;

@Component({
    selector: 'bc-image-viewer',
    standalone: true,
    imports: [
        TagComponent,
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
    private readonly renderer2 = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<any> | null = null;
    public selectedMediaIndex = this.config.selectedMediaIndex;

    private _resizeObserver: ResizeObserver | null = null;
    private _selectedIndexAnimationTimeoutId: number | null = null;

    public imageViewer = viewChild.required('imageViewer');
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
    }

    private switchMedia(direction: 'left' | 'right') {
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
}
