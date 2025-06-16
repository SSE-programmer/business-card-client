import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bc-projects-page-component',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent {
}
