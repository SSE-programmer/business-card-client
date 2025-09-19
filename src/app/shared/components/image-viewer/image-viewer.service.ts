import { ApplicationRef, ComponentRef, EmbeddedViewRef, inject, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewerConfig } from './image-viewer.config';
import { ImageViewerInjector } from './image-viewer.injector';
import { ImageViewerRef } from './image-viewer.ref';

export interface IImageViewerEntity {
    reference: ComponentRef<ImageViewerComponent>;
    config: ImageViewerConfig;
}

export interface IImageViewerStore {
    viewersCollection: {
        [key: string]: IImageViewerEntity;
    };
}

@Injectable({
    providedIn: 'root',
})
export class ImageViewerService {
    private readonly appRef = inject(ApplicationRef);
    private readonly injector = inject(Injector);

    public imageViewerStore: IImageViewerStore = {
        viewersCollection: {},
    };
    public viewerComponentRef: ComponentRef<ImageViewerComponent> | undefined;

    private _viewContainerRef: ViewContainerRef | null = null;

    public setViewContainerRef(vcr: ViewContainerRef): void {
        this._viewContainerRef = vcr;
    }

    public appendModalComponentToBody(config: ImageViewerConfig): ImageViewerRef {
        if (!this._viewContainerRef) {
            throw new Error('ViewContainerRef must be defined');
        }

        if (this.viewerComponentRef) {
            this._removeModalComponentFromBody(this.viewerComponentRef);
        }

        const map = new WeakMap();
        map.set(ImageViewerConfig, config);

        const viewerRef = new ImageViewerRef();
        map.set(ImageViewerRef, viewerRef);

        const componentRef = this._viewContainerRef.createComponent<ImageViewerComponent>(
            ImageViewerComponent,
            {
                injector: new ImageViewerInjector(this.injector, map),
            },
        );

        viewerRef.reference = componentRef;

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.viewerComponentRef = componentRef;

        return viewerRef;
    }

    public open(config: ImageViewerConfig): ImageViewerRef {
        return this.appendModalComponentToBody(config);
    }

    public closeModal(): boolean {
        if (this._hasOnCloseCallback()) {
            this._invokeOnCloseCallback();

            return false;
        }

        this._removeModalComponentFromBody(this.viewerComponentRef);

        this.viewerComponentRef = undefined;

        return true;
    }

    private _removeModalComponentFromBody(imageViewerRef: ComponentRef<ImageViewerComponent> | undefined): void {
        if (!imageViewerRef) {
            return;
        }

        const modalDomElement = imageViewerRef.location.nativeElement;

        modalDomElement.addEventListener('animationend', () => {
            this.appRef.detachView(imageViewerRef.hostView);
            imageViewerRef.destroy();
        }, { once: true });

        modalDomElement.querySelector('.image-viewer-wrapper').classList.add('closed');
    }

    private _hasOnCloseCallback(): boolean {
        const callback = this.viewerComponentRef?.instance.config.onCloseCallback;

        return typeof callback === 'function';
    }

    private _invokeOnCloseCallback(): void {
        const onCloseCallback = this.viewerComponentRef?.instance.config.onCloseCallback;

        if (onCloseCallback) {
            onCloseCallback(closeModal => {
                if (!closeModal) {
                    return;
                }

                this.closeModal();
            });
        }
    }
}
