export interface IWebResponse<T> {
    success: boolean;
    data?: T;
    cached?: boolean;
    error?: string;
}
