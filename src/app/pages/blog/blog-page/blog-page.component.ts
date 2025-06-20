import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, Signal } from '@angular/core';
import { TelegramHttpService } from '@services/http-services/telegram-http/telegram-http.service';
import {
    isTelegramMessage,
    isTelegramMessageGroup,
    ITelegramMessage,
    ITelegramMessageGroup,
} from '@services/http-services/telegram-http/models/ITelegramMessage';
import { PostComponent } from './components/post/post.component';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'bc-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.scss'],
    standalone: true,
    imports: [
        PostComponent,
        LoadingSpinnerComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {
    private readonly telegramHttpService = inject(TelegramHttpService);

    private _postsResource = this.telegramHttpService.getPostsResource();

    public postsSignal: Signal<ITelegramMessage[]> = computed(() => {
        if (this._postsResource.error()) {
            return [];
        }

        return this._postsResource.value().map(post => this._preparePost(post));
    });
    public postsLoadingSignal: Signal<boolean> = this._postsResource.isLoading;

    public postsTrackBy(post: ITelegramMessage | ITelegramMessageGroup): ITelegramMessage | ITelegramMessageGroup | number | string {
        if (isTelegramMessage(post)) {
            return post.id;
        }

        if (isTelegramMessageGroup(post)) {
            return post.groupedId;
        }

        return post;
    }

    private _preparePost(data: ITelegramMessage | ITelegramMessageGroup): ITelegramMessage {
        let result: ITelegramMessage;

        if (isTelegramMessageGroup(data)) {
            let mainMessage: ITelegramMessage | undefined = data.messages.find(message => message.mainMessage);

            if (!mainMessage) {
                mainMessage = data.messages[0];
            }

            if (!Array.isArray(mainMessage.media)) {
                mainMessage.media = [];
            }

            data.messages.forEach(message => {
                if (message === mainMessage) {
                    return;
                }

                if (message.media?.length) {
                    mainMessage.media?.push(...message.media);
                }
            });

            result = mainMessage;
        } else {
            result = data;
        }

        result.reactions = (result.reactions || []).filter(reaction => reaction.reaction.className === 'ReactionEmoji');

        return result;
    }
}
