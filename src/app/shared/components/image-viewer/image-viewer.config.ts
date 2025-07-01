import { IMedia } from '@services/http-services/telegram-http/models/ITelegramMessage';

export class ImageViewerConfig {
    media: IMedia[] = [];
    selectedMediaIndex = 0;
    onCloseCallback?: ((closeModal: (value: boolean) => any) => any) | null | undefined;
}
