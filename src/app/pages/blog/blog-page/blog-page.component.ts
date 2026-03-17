import { ChangeDetectionStrategy, Component, inject, signal, Signal } from '@angular/core';
import { TelegramHttpService } from '@services/http-services/telegram-http/telegram-http.service';
import {
    isTelegramMessage,
    isTelegramMessageGroup,
    ITelegramMessage,
    ITelegramMessageGroup,
    Post,
} from '@services/http-services/telegram-http/models/ITelegramMessage';
import { PostComponent } from './components/post/post.component';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { getDataFromWebResponseOperator } from '@shared/utils/http/getDataFromWebResponse';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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

    readonly #isPostsLoadingSignal = signal(true);
    readonly #posts$: Observable<ITelegramMessage[]> = this.telegramHttpService.getPosts().pipe(
        getDataFromWebResponseOperator(),
        map((posts) => posts.map((post) => this._preparePost(post))),
        catchError(() => of([])),
        finalize(() => this.#isPostsLoadingSignal.set(false)),
    );
    protected readonly isPostsLoadingSignal = this.#isPostsLoadingSignal.asReadonly();
    protected readonly postsSignal = toSignal(this.#posts$, { initialValue: [] });

    public postsTrackBy(post: Post): Post | number | string {
        if (isTelegramMessage(post)) {
            return post.id;
        }

        if (isTelegramMessageGroup(post)) {
            return post.groupedId;
        }

        return post;
    }

    private _preparePost(data: Post): ITelegramMessage {
        const dataClone = structuredClone(data);
        let result: ITelegramMessage;

        if (isTelegramMessageGroup(dataClone)) {
            let mainMessage: ITelegramMessage | undefined = dataClone.messages.find(message => message.mainMessage);

            if (!mainMessage) {
                mainMessage = dataClone.messages[0];
            }

            if (!Array.isArray(mainMessage.media)) {
                mainMessage.media = [];
            }

            dataClone.messages.forEach(message => {
                if (message === mainMessage) {
                    return;
                }

                if (message.media?.length) {
                    mainMessage.media?.push(...message.media);
                }
            });

            result = mainMessage;
        } else {
            result = dataClone;
        }

        result.reactions = (result.reactions || []).filter(reaction => reaction.reaction.className === 'ReactionEmoji');

        return result;
    }
}
