import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bc-color-selector',
    templateUrl: './color-selector.component.html',
    styleUrls: ['./color-selector.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorSelectorComponent {
}
