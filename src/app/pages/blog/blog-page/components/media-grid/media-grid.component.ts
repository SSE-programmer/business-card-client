import { ChangeDetectionStrategy, Component, input, InputSignal, output } from '@angular/core';
import { IMedia } from '@services/http-services/telegram-http/models/ITelegramMessage';

export interface IMediaEvent<E extends Event = Event> {
    event: E;
    media: IMedia[];
    index: number;
}

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
    public mediaClick = output<IMediaEvent<MouseEvent>>();
    protected readonly output = output;
}
