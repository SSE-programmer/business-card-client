import { Component, inject, OnInit } from '@angular/core';
import { TelegramHttpService } from '../../../shared/services/http-services/telegram-http/telegram-http.service';
import { catchError, map, Observable, of } from 'rxjs';
import {
    isTelegramMessage,
    isTelegramMessageGroup,
    ITelegramMessage,
    ITelegramMessageGroup,
} from '../../../shared/services/http-services/telegram-http/models/ITelegramMessage';
import { AsyncPipe } from '@angular/common';
import { PostComponent } from './components/post/post.component';

@Component({
    selector: 'bc-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        PostComponent,
    ],
})
export class BlogPageComponent implements OnInit {
    private readonly telegramHttpService = inject(TelegramHttpService);

    public posts$: Observable<ITelegramMessage[]> | null = null;

    public ngOnInit(): void {
        this.posts$ = this.telegramHttpService.getPosts()
            .pipe(
                map(response => response.data || []),
                map(posts => posts.map(post => this._preparePost(post))),
                catchError(() => of([])),
            );
    }

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

            return mainMessage;
        }

        return data;
    }
}
