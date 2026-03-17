import { map, OperatorFunction, pipe } from 'rxjs';
import { IWebResponse } from '@models/IWebResponse';

export function getDataFromWebResponse<T>(response: IWebResponse<T>) {
    const { success, data, error } = response;

    if (success && data) {
        return data;
    }

    if (!success) {
        throw new Error(error);
    }

    throw new Error('Failed to get data from web response');
}

export function getDataFromWebResponseOperator<T>(): OperatorFunction<IWebResponse<T>, T> {
    return pipe(map(getDataFromWebResponse));
}
