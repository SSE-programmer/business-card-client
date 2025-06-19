import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IPosition } from '../../models/IJobExperience';
import { TooltipConfig } from '../../../tooltip/tooltip.config';
import { DatePipe } from '@angular/common';
import { TagComponent } from '../../../tag/tag.component';

export interface IPositionTooltipData {
    position: IPosition;
}

@Component({
    selector: 'bc-position-tooltip',
    templateUrl: './position-tooltip.component.html',
    styleUrl: './position-tooltip.component.scss',
    imports: [
        DatePipe,
        TagComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionTooltipComponent {
    private readonly tooltipConfig = inject(TooltipConfig<IPosition>);

    public position = signal<IPosition>(this.tooltipConfig.data.position);
}
