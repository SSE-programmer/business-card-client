export class DynamicModalConfig<D = any> {
    data?: D;
    modalName: string = '';
    autoHeight?: boolean;
    width?: string;
    height?: string;
    mediaQueries?: IMediaQuery[];
    onCloseCallback?: ((closeModal: (value: boolean) => any) => any) | null | undefined;
    removeModalBody?: boolean = false;
}

export interface IMediaQuery {
    query: string;
    width?: string;
    height?: string;
}
