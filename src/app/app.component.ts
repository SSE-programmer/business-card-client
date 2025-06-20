import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipService } from '@components/tooltip/tooltip.service';
import { DynamicModalService } from '@components/dynamic-modal/dynamic-modal.service';

@Component({
    selector: 'bc-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    private readonly tooltipService = inject(TooltipService);
    private readonly dynamicModalService = inject(DynamicModalService);
    private readonly viewContainerRef = inject(ViewContainerRef);

    constructor() {
        this._setViewContainerRefs();
    }

    private _setViewContainerRefs(): void {
        this.tooltipService.setViewContainerRef(this.viewContainerRef);
        this.dynamicModalService.setViewContainerRef(this.viewContainerRef);
    }
}
