import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProject } from '../../../models/project.model';
import { TagComponent } from '@components/tag/tag.component';

@Component({
    selector: 'bc-project-card',
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.scss',
    standalone: true,
    imports: [
        RouterLink,
        TagComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
    readonly project = input.required<IProject>();

    @HostBinding('animate.enter')
    get enterAnimation() {
        return 'enter-animation';
    }

    protected formatPeriod(project: IProject): string {
        if (!project.period) {
            return '';
        }

        const from = this.formatDate(project.period.from);
        const to = project.period.to ? this.formatDate(project.period.to) : 'Present';
        return `${from} — ${to}`;
    }

    private formatDate(dateStr: string): string {
        const [year, month] = dateStr.split('-');
        const date = new Date(+year, +(month || 1) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}
