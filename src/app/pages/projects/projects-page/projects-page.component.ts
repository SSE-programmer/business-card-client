import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { EProjectCategory, IProjectCategory } from '../models/project.model';
import { PROJECT_CATEGORIES, PROJECTS } from '../data/projects.data';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@Component({
    selector: 'bc-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrl: './projects-page.component.scss',
    standalone: true,
    imports: [
        ProjectCardComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent {
    protected readonly categories: IProjectCategory[] = PROJECT_CATEGORIES;
    protected readonly activeCategory = signal<EProjectCategory>(EProjectCategory.Commercial);

    protected readonly filteredProjects = computed(() =>
        PROJECTS.filter(p => p.category === this.activeCategory())
    );

    protected setCategory(category: EProjectCategory): void {
        this.activeCategory.set(category);
    }
}
