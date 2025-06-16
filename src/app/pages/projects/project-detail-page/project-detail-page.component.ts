import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bc-project-detail',
    templateUrl: './project-detail-page.component.html',
    styleUrls: ['./project-detail-page.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPageComponent {
}
