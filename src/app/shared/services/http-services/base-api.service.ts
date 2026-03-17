import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export abstract class BaseApiService {
    protected readonly http = inject(HttpClient);
}
