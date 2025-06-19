import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
    selector: 'bc-level-indicator',
    templateUrl: './level-indicator.component.html',
    styleUrl: './level-indicator.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelIndicatorComponent {
    public maxLevel = input(3);
    public level = input(0);

    protected levels = computed(() => Array.from(Array(this.maxLevel()).keys()));
}
