import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconNotFoundComponent } from '@icons/icon-not-found/icon-not-found.component';

@Component({
    selector: 'bc-not-found-page-component',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IconNotFoundComponent
    ]
})
export class NotFoundPageComponent {}
