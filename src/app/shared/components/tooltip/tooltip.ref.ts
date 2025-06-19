import { ComponentRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

export class TooltipRef {
    private _reference: ComponentRef<TooltipComponent> | null = null;

    get reference(): ComponentRef<TooltipComponent> | null {
        return this._reference;
    }

    set reference(ref: ComponentRef<TooltipComponent>) {
        if (!this._reference) {
            this._reference = ref;
        }
    }

    public getInstance(): TooltipComponent | null {
        return this._reference?.instance || null;
    }
}
