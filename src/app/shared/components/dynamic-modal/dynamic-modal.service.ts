import { ApplicationRef, ComponentRef, EmbeddedViewRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { DynamicModalComponent } from './dynamic-modal.component';
import { DynamicModalConfig } from './dynamic-modal.config';
import { DynamicModalInjector } from './dynamic-modal.injector';
import { DynamicModalRef } from './dynamic-modal.ref';

export interface IDynamicModalEntity {
    reference: ComponentRef<DynamicModalComponent>;
    config: DynamicModalConfig;
}

export interface IDynamicModalStore {
    modalCollection: {
        [key: string]: IDynamicModalEntity;
    };
}

@Injectable({
    providedIn: 'root',
})
export class DynamicModalService {
    private readonly appRef = inject(ApplicationRef);
    private readonly injector = inject(Injector);

    public dynamicModalStore: IDynamicModalStore = {
        modalCollection: {},
    };
    public modalsOrder: string[] = [];
    public modalComponentRef: ComponentRef<DynamicModalComponent> | null = null;
    public topModalRef: ComponentRef<DynamicModalComponent> | undefined;

    private _viewContainerRef: ViewContainerRef | null = null;
    private _newModalParams: null | undefined | {
        componentType: Type<any>,
        config: DynamicModalConfig
    };

    public setViewContainerRef(vcr: ViewContainerRef): void {
        this._viewContainerRef = vcr;
    }

    public appendModalComponentToBody(componentType: Type<any>, config: DynamicModalConfig): DynamicModalRef {
        if (!this._viewContainerRef) {
            throw new Error('ViewContainerRef must be defined');
        }

        this._newModalParams = { componentType, config };

        const map = new WeakMap();
        map.set(DynamicModalConfig, config);

        const modalRef = new DynamicModalRef();
        map.set(DynamicModalRef, modalRef);

        const componentRef = this._viewContainerRef.createComponent<DynamicModalComponent>(
            DynamicModalComponent,
            {
                injector: new DynamicModalInjector(this.injector, map),
            },
        );

        modalRef.reference = componentRef;

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.modalComponentRef = componentRef;

        componentRef.instance.childComponentType = componentType;

        this.dynamicModalStore.modalCollection[config.modalName] = {
            config: config,
            reference: componentRef,
        };
        this.modalsOrder.push(config.modalName);
        this.topModalRef = componentRef;

        this._newModalParams = null;

        return modalRef;
    }

    public open(componentType: Type<any>, config: DynamicModalConfig): DynamicModalRef {
        this._checkConfigRequiredParameters(config);

        const modalRef = this.appendModalComponentToBody(componentType, config);

        return modalRef;
    }

    public closeModal(modalName: string, force = false, restore = false): boolean {
        const deletedModalIndex = this.modalsOrder.findIndex(item => item === modalName);

        if (this.modalsOrder.length - deletedModalIndex > 1) { // Возможно удалить только диалог верхнего уровня
            return false;
        }

        if (!force && this._hasOnCloseCallback(modalName)) {
            this._invokeOnCloseCallback(modalName);

            return false;
        }

        this._removeModalComponentFromBody(this.getModalRefByName(modalName));
        delete this.dynamicModalStore.modalCollection[modalName];

        this.modalsOrder.splice(deletedModalIndex, 1);
        this.topModalRef = this.getModalRefByName(this.modalsOrder[this.modalsOrder.length - 1]);

        if (this._newModalParams && restore) {
            this.appendModalComponentToBody(
                this._newModalParams.componentType,
                this._newModalParams.config,
            );
        }

        return true;
    }

    public getModalRefByName(name: string): ComponentRef<DynamicModalComponent> | undefined {
        return this.dynamicModalStore.modalCollection[name]?.reference;
    }

    private _removeModalComponentFromBody(dynamicModalRef: ComponentRef<DynamicModalComponent> | undefined): void {
        if (!dynamicModalRef) {
            return;
        }

        const modalDomElement = dynamicModalRef.location.nativeElement;

        modalDomElement.addEventListener('animationend', () => {
            this.appRef.detachView(dynamicModalRef.hostView);
            dynamicModalRef.destroy();
        }, { once: true });

        modalDomElement.querySelector('.dynamic-modal-wrapper').classList.add('closed');
    }

    private _checkConfigRequiredParameters(config: DynamicModalConfig): void {
        if (!config.modalName) {
            throw new Error('Modal name is required!');
        }
    }

    private _hasOnCloseCallback(modalName: string): boolean {
        const callback = this.dynamicModalStore.modalCollection[modalName].config.onCloseCallback;

        return typeof callback === 'function';
    }

    private _invokeOnCloseCallback(modalName: string): void {
        const onCloseCallback = this.dynamicModalStore.modalCollection[modalName].config.onCloseCallback;

        if (onCloseCallback) {
            onCloseCallback(closeModal => {
                if (!closeModal) {
                    this._newModalParams = null;

                    return;
                }

                this.closeModal(modalName, true, false);
            });
        }
    }
}
