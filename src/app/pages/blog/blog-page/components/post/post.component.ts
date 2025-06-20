import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { ITelegramMessage } from '@services/http-services/telegram-http/models/ITelegramMessage';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MediaGridComponent } from '../media-grid/media-grid.component';
import { DynamicModalService } from '@components/dynamic-modal/dynamic-modal.service';
import { PostModalComponent } from './components/post-modal/post-modal.component';
import { TagComponent } from '@components/tag/tag.component';
import { IconCommentsComponent } from '@components/icons/icon-comments/icon-comments.component';
import { IconViewsComponent } from '@components/icons/icon-views/icon-views.component';

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
    ],
})
export class PostComponent {
    private readonly dynamicModalService = inject(DynamicModalService);

    public readonly postSignal: InputSignal<ITelegramMessage> = input.required({ alias: 'post' });
    public readonly MAX_TEXT_VISIBLE_LENGTH = 500;
    public readonly MAX_REACTIONS_VISIBLE_LENGTH = 7;

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
