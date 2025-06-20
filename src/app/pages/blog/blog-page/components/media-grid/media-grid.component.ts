import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { IMedia } from '@services/http-services/telegram-http/models/ITelegramMessage';

@Component({
    selector: 'bc-media-grid',
    templateUrl: './media-grid.component.html',
    styleUrl: './media-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaGridComponent {
    protected readonly Math = Math;

    public readonly MAX_VISIBLE_MEDIA_COUNT: number = 6;
    public readonly mediaSignal: InputSignal<IMedia[]> = input.required({ alias: 'media' });
}
