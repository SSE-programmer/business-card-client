import { Injectable } from '@angular/core';
import { API_PREFIX } from '@config/api';
import { Post } from './models/ITelegramMessage';
import { IWebResponse } from '@models/IWebResponse';
import { BaseApiService } from '@services/http-services/base-api.service';
import { shareReplay } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class TelegramHttpService extends BaseApiService {
    readonly #apiGroupPrefix = '/telegram';

    readonly #posts$ = this.http.get<IWebResponse<Post[]>>(`${API_PREFIX}${this.#apiGroupPrefix}/posts`)
        .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    public getPosts() {
        return this.#posts$;
    }
}
