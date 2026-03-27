import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EProjectCategory, IProjectCategory } from '../models/project.model';
import { PROJECT_CATEGORIES, PROJECTS } from '../data/projects.data';
import { ProjectCardComponent } from './components/project-card/project-card.component';

const VALID_CATEGORIES = new Set<string>(Object.values(EProjectCategory));

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
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly categories: IProjectCategory[] = PROJECT_CATEGORIES;
    protected readonly activeCategory = signal<EProjectCategory>(this.resolveInitialCategory());

    protected readonly filteredProjects = computed(() =>
        PROJECTS.filter(p => p.category === this.activeCategory())
    );

    protected setCategory(category: EProjectCategory): void {
        this.activeCategory.set(category);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tab: category },
            replaceUrl: true,
        });
    }

    private resolveInitialCategory(): EProjectCategory {
        const tab = this.route.snapshot.queryParamMap.get('tab');
        if (tab && VALID_CATEGORIES.has(tab)) {
            return tab as EProjectCategory;
        }
        return EProjectCategory.Commercial;
    }
}
