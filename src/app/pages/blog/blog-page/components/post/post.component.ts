import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { IMedia, ITelegramMessage } from '../../../../../shared/services/http-services/telegram-http/models/ITelegramMessage';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MediaGridComponent } from '../media-grid/media-grid.component';

@Component({
    selector: 'bc-post',
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DatePipe,
        MediaGridComponent,
        UpperCasePipe,
    ],
})
export class PostComponent {
    public readonly postSignal: InputSignal<ITelegramMessage> = input.required({ alias: 'post' });
}
