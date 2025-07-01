import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ITelegramMessage } from '@services/http-services/telegram-http/models/ITelegramMessage';
import { DynamicModalService } from '@components/dynamic-modal/dynamic-modal.service';
import { DynamicModalConfig } from '@components/dynamic-modal/dynamic-modal.config';
import { IMediaEvent, MediaGridComponent } from '../../../media-grid/media-grid.component';
import { TagComponent } from '@components/tag/tag.component';
import { IconCommentsComponent } from '@components/icons/icon-comments/icon-comments.component';
import { IconViewsComponent } from '@components/icons/icon-views/icon-views.component';
import { ImageViewerService } from '@components/image-viewer/image-viewer.service';

export interface IPositionModalData {
    post: ITelegramMessage;
}

@Component({
    selector: 'bc-post-modal',
    templateUrl: './post-modal.component.html',
    styleUrl: './post-modal.component.scss',
    imports: [
        DatePipe,
        MediaGridComponent,
        UpperCasePipe,
        TagComponent,
        IconCommentsComponent,
        IconViewsComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostModalComponent {
    private readonly dynamicModalService = inject(DynamicModalService);
    private readonly dynamicModalConfig = inject(DynamicModalConfig<IPositionModalData>);
    private readonly imageViewerService = inject(ImageViewerService);

    public readonly MAX_REACTIONS_VISIBLE_LENGTH = 7;
    public postSignal = signal<ITelegramMessage>(this.dynamicModalConfig.data.post);

    public closeModal(): void {
        this.dynamicModalService.closeModal(this.dynamicModalConfig.modalName);
    }

    public openImageViewer($event: IMediaEvent<MouseEvent>) {
        this.imageViewerService.open({
            media: $event.media,
            selectedMediaIndex: $event.index,
        });
    }
}
