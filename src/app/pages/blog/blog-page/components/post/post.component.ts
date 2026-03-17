import { ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, input, InputSignal, OnDestroy, signal, viewChild } from '@angular/core';
import { ITelegramMessage } from '@services/http-services/telegram-http/models/ITelegramMessage';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { IMediaEvent, MediaGridComponent } from '../media-grid/media-grid.component';
import { DynamicModalService } from '@components/dynamic-modal/dynamic-modal.service';
import { PostModalComponent } from './components/post-modal/post-modal.component';
import { TagComponent } from '@components/tag/tag.component';
import { IconCommentsComponent } from '@icons/icon-comments/icon-comments.component';
import { IconViewsComponent } from '@icons/icon-views/icon-views.component';
import { ImageViewerService } from '@components/image-viewer/image-viewer.service';
import { TelegramFormatPipe } from '@shared/pipes/telegram-format.pipe';
import { isOverflowHeight } from '@shared/utils/isOverflowHeight';

@Component({
    selector: 'bc-post',
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DatePipe,
        MediaGridComponent,
        UpperCasePipe,
        TagComponent,
        IconCommentsComponent,
        IconViewsComponent,
        TelegramFormatPipe,
    ],
})
export class PostComponent implements OnDestroy {
    private readonly dynamicModalService = inject(DynamicModalService);
    private readonly imageViewerService = inject(ImageViewerService);

    public readonly postSignal: InputSignal<ITelegramMessage> = input.required({ alias: 'post' });

    protected readonly postTextContainer = viewChild('postTextContainer', {read: ElementRef});

    private readonly _postTextContainerIsOverflowed = signal(false);
    protected readonly postTextContainerIsOverflowed = this._postTextContainerIsOverflowed.asReadonly();

    public readonly MAX_REACTIONS_VISIBLE_LENGTH = 7;

    private readonly _resizeObserver = new ResizeObserver(() => {
        const element = this.postTextContainer();

        if (element) {
            this._postTextContainerIsOverflowed.set(isOverflowHeight(element.nativeElement));
        }
    });

    private readonly _postTextElementChange = effect(() => {
        const element = this.postTextContainer();

        if (element) {
            this._resizeObserver.observe(element.nativeElement);
        }
    });

    public openPostModal() {
        this.dynamicModalService.open(PostModalComponent, {
            modalName: 'Job Position',
            data: {
                post: this.postSignal(),
            },
            width: '1200px',
            mediaQueries: [
                {
                    query: '(max-width: 720px)',
                    width: '100%',
                },
            ],
        });
    }

    public openImageViewer($event: IMediaEvent<Event>) {
        this.imageViewerService.open({
            media: $event.media,
            selectedMediaIndex: $event.index,
        });
    }

    public ngOnDestroy(): void {
        this._resizeObserver.disconnect();
    }
}
