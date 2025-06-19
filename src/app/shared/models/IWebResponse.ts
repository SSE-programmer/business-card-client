export interface IWebResponse<T> {
    success: boolean;
    data?: T;
    cached?: boolean;
    error?: string;
}

export function isWebResponse<D = unknown>(value: unknown): value is IWebResponse<D> {
    return Boolean(typeof value === 'object' && value && 'success' in value);
}
