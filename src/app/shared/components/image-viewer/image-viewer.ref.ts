import { ComponentRef } from '@angular/core';
import { ImageViewerComponent } from './image-viewer.component';

export class ImageViewerRef {
    private _reference: ComponentRef<ImageViewerComponent> | null = null;

    get reference(): ComponentRef<ImageViewerComponent> | null {
        return this._reference;
    }

    set reference(ref: ComponentRef<ImageViewerComponent>) {
        if (!this._reference) {
            this._reference = ref;
        }
    }

    constructor() {
    }

    getInstance(): ImageViewerComponent | null {
        return this._reference?.instance || null;
    }
}
