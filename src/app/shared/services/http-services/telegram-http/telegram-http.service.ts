import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '../../../../../config/api';
import { catchError, Observable, throwError } from 'rxjs';
import { ITelegramMessage, ITelegramMessageGroup } from './models/ITelegramMessage';
import { IWebResponse } from '../../../models/IWebResponse';

@Injectable({ providedIn: 'root' })
export class TelegramHttpService {
    private readonly http = inject(HttpClient);

    private readonly _apiGroupPrefix = '/telegram';

    public getPosts(): Observable<IWebResponse<(ITelegramMessage | ITelegramMessageGroup)[]>> {
        return this.http.get<IWebResponse<(ITelegramMessage | ITelegramMessageGroup)[]>>(`${API_PREFIX}${this._apiGroupPrefix}/posts`)
            .pipe(catchError((error) => throwError(() => error)));
    }
}
