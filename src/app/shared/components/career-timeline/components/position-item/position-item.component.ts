import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IPosition } from '../../models/IJobExperience';
import { FocusVisibleDirective } from '../../../../directives/focus-visible/focus-visible.directive';

@Component({
    selector: 'bc-position-item',
    templateUrl: './position-item.component.html',
    styleUrl: './position-item.component.scss',
    imports: [
        FocusVisibleDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionItemComponent {
    public position = input.required<IPosition>();
    public leftMargin = input<number>(0);
    public yearCellWidth = input.required<number>();
    public firstYear = input.required<number>();
    public lastYear = input.required<number>();
    public index = input<number>(0);
    public styles = computed(() => {
        const positionStartYear = this.position().startDate.getFullYear();
        const positionEndYear = this.position().endDate?.getFullYear();
        const positionStartMonth = this.position().startDate.getMonth();
        const positionEndMonth = this.position().endDate?.getMonth() || new Date().getMonth();
        const startYearIndex = positionStartYear - this.firstYear() - 1;
        const endYearIndex = positionEndYear ? positionEndYear - this.firstYear() - 1 : this.lastYear() - this.firstYear() - 1;
        const startYearMargin = startYearIndex * this.yearCellWidth();
        const endYearMargin = endYearIndex * this.yearCellWidth();
        const monthWidth = this.yearCellWidth() / 12;
        const startMonthMargin = positionStartMonth * monthWidth;
        const endMonthMargin = positionEndMonth * monthWidth;
        const leftX = startYearMargin + startMonthMargin + this.leftMargin();
        const rightX = endYearMargin + endMonthMargin + this.leftMargin();

        return ({
            left: `${leftX}px`,
            width: `${rightX - leftX}px`,
            zIndex: 20 + this.index(),
        });
    });

    public onClick = output<Event>();
    public onPointerenter = output<Event>();
    public onPointerleave = output<Event>();
    public onFocus = output<Event>();
    public onFocusVisible = output<Event>();
    public onBlur = output<Event>();
}
