import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProject } from '../../../models/project.model';
import { TagComponent } from '@components/tag/tag.component';
import { ImageCacheService } from '@services/image-cache.service';
import { take } from 'rxjs';

@Component({
    selector: 'bc-project-card',
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.scss',
    standalone: true,
    imports: [
        RouterLink,
        TagComponent,
    ],
    host: {
        'animate.enter': 'enter-animation'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
    private readonly imageCacheService = inject(ImageCacheService);

    public readonly project = input.required<IProject>();

    private readonly _previewImageLoaded = signal(false);
    protected readonly previewImageLoaded = this._previewImageLoaded.asReadonly();

    private readonly _previewImageUrl = signal<string | null>(null);
    protected readonly previewImageUrl = this._previewImageUrl.asReadonly();

    public ngOnInit(): void {
        const previewImage = this.project().previewImage;

        if (previewImage) {
            this.imageCacheService.cacheImage(previewImage)
                .pipe(take(1))
                .subscribe((url) => {
                    this._previewImageUrl.set(url);
                });
        }
    }

    protected setPreviewImageLoadedStatus(status: boolean) {
        this._previewImageLoaded.set(status);
    }

    protected formatPeriod(project: IProject): string {
        if (!project.period) {
            return '';
        }

        const from = this._formatDate(project.period.from);
        const to = project.period.to ? this._formatDate(project.period.to) : 'Present';
        return `${from} — ${to}`;
    }

    private _formatDate(dateStr: string): string {
        const [year, month] = dateStr.split('-');
        const date = new Date(+year, +(month || 1) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}
