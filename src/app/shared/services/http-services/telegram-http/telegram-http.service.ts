import { Injectable } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { API_PREFIX } from '../../../../../config/api';
import { ITelegramMessage, ITelegramMessageGroup } from './models/ITelegramMessage';
import { IWebResponse } from '../../../models/IWebResponse';

@Injectable({ providedIn: 'root' })
export class TelegramHttpService {
    private readonly _apiGroupPrefix = '/telegram';

    public getPostsResource(): HttpResourceRef<(ITelegramMessage | ITelegramMessageGroup)[]> {
        return httpResource<(ITelegramMessage | ITelegramMessageGroup)[]>(
            () => ({ url: `${API_PREFIX}${this._apiGroupPrefix}/posts` }),
            {
                defaultValue: [],
                parse: (value) => (value as IWebResponse<(ITelegramMessage | ITelegramMessageGroup)[]>).data || [],
            }
        );
    }
}
