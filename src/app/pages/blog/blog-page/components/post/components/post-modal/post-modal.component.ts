import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ITelegramMessage } from '../../../../../../../shared/services/http-services/telegram-http/models/ITelegramMessage';
import { DynamicModalService } from '../../../../../../../shared/components/dynamic-modal/dynamic-modal.service';
import { DynamicModalConfig } from '../../../../../../../shared/components/dynamic-modal/dynamic-modal.config';
import { MediaGridComponent } from '../../../media-grid/media-grid.component';
import { TagComponent } from '../../../../../../../shared/components/tag/tag.component';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostModalComponent {
    private readonly dynamicModalService = inject(DynamicModalService);
    private readonly dynamicModalConfig = inject(DynamicModalConfig<IPositionModalData>);

    public postSignal = signal<ITelegramMessage>(this.dynamicModalConfig.data.post);

    public closeModal(): void {
        this.dynamicModalService.closeModal(this.dynamicModalConfig.modalName);
    }
}
