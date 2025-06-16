import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { ITelegramMessage } from '../../../../../shared/services/http-services/telegram-http/models/ITelegramMessage';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MediaGridComponent } from '../media-grid/media-grid.component';
import { DynamicModalService } from '../../../../../shared/components/dynamic-modal/dynamic-modal.service';
import {
    PositionModalComponent,
} from '../../../../../shared/components/career-timeline/components/position-modal/position-modal.component';
import { PostModalComponent } from './components/post-modal/post-modal.component';
import { TagComponent } from '../../../../../shared/components/tag/tag.component';

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
    ],
})
export class PostComponent {
    private readonly dynamicModalService = inject(DynamicModalService);

    public readonly postSignal: InputSignal<ITelegramMessage> = input.required({ alias: 'post' });
    public readonly MAX_TEXT_VISIBLE_LENGTH = 500;

    public openPostModal() {
        this.dynamicModalService.open(PostModalComponent, {
            modalName: 'Job Position',
            data: {
                post: this.postSignal(),
            },
            width: '100%',
        });
    }
}
