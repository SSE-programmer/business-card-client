import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'bc-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    imports: [
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
    header = input<string>();
    contentTemplate = contentChild<TemplateRef<any>>('contentTemplate');
}
