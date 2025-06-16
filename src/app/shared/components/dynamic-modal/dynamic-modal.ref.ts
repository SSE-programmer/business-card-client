import { ComponentRef } from '@angular/core';
import { DynamicModalComponent } from './dynamic-modal.component';

export class DynamicModalRef {
    private _reference: ComponentRef<DynamicModalComponent> | null = null;

    get reference(): ComponentRef<DynamicModalComponent> | null {
        return this._reference;
    }

    set reference(ref: ComponentRef<DynamicModalComponent>) {
        if (!this._reference) {
            this._reference = ref;
        }
    }

    constructor() {
    }

    getInstance(): DynamicModalComponent | null {
        return this._reference?.instance || null;
    }
}
