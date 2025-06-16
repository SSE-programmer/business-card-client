import { IMediaQuery } from '../../models/IMediaQuery';

export class TooltipConfig<D = any> {
    boundariesElement?: HTMLElement;
    stickingElement: HTMLElement | null = null;
    offset?: [number, number] = [0, 0];
    data?: D;
    preventOutsideClick?: boolean = false;
    width?: string;
    mediaQueries?: IMediaQuery[];
    onCloseCallback?: () => any;
    popperOptions?: object;
    isStatic?: boolean = true;
}
