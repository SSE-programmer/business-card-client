import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bc-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
}
