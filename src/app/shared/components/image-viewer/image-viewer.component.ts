import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageViewerService } from './image-viewer.service';
import { ImageViewerConfig } from './image-viewer.config';

@Component({
    selector: 'bc-image-viewer',
    standalone: true,
    imports: [],
    templateUrl: './image-viewer.component.html',
    styleUrl: './image-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly config = inject(ImageViewerConfig);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly imageViewerService = inject(ImageViewerService);
    private readonly destroyRef = inject(DestroyRef);

    public componentRef: ComponentRef<any> | null = null;

    private _resizeObserver: ResizeObserver | null = null;

    @ViewChild('imageViewer')
    imageViewer!: ElementRef;


    @HostListener('document:keydown.escape')
    public onKeydownHandler() {
        this.closeModal();
    }

    public ngOnInit(): void {
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(500),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    public ngAfterViewInit(): void {
        requestAnimationFrame(() => {
            this.imageViewer.nativeElement.classList.add('transition');
        });

        this.cd.detectChanges();
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
}
