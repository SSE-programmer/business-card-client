import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { IProject } from '../models/project.model';
import { PROJECTS } from '../data/projects.data';
import { MarkdownPipe } from '@shared/pipes/markdown.pipe';
import { TagComponent } from '@components/tag/tag.component';
import { ImageViewerService } from '@components/image-viewer/image-viewer.service';
import { IMedia } from '@services/http-services/telegram-http/models/ITelegramMessage';
import { MediaGridComponent } from '@pages/blog/blog-page/components/media-grid/media-grid.component';
import { IMediaEvent } from '@pages/blog/blog-page/components/media-grid/media-grid.component';
import { IconBackComponent } from '@icons/icon-back/icon-back.component';

@Component({
    selector: 'bc-project-detail-page',
    templateUrl: './project-detail-page.component.html',
    styleUrl: './project-detail-page.component.scss',
    standalone: true,
    imports: [
        MarkdownPipe,
        TagComponent,
        MediaGridComponent,
        IconBackComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPageComponent {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly imageViewerService = inject(ImageViewerService);

    readonly id = input.required<string>();

    protected readonly project = computed<IProject | undefined>(() =>
        PROJECTS.find(p => p.id === this.id())
    );

    protected readonly mediaItems = computed<IMedia[]>(() => {
        const proj = this.project();
        if (!proj?.images?.length) {
            return [];
        }
        return proj.images.map(url => ({ type: 'photo', photoUrl: url }));
    });

    private readonly contentPath$ = toObservable(this.project).pipe(
        switchMap(proj => {
            if (!proj) {
                return of(null);
            }
            return this.http.get(proj.contentPath, { responseType: 'text' }).pipe(
                catchError(() => of(null))
            );
        }),
    );

    protected readonly contentSignal = toSignal(this.contentPath$, { initialValue: null });

    protected formatPeriod(project: IProject): string {
        if (!project.period) {
            return '';
        }

        const from = this.formatDate(project.period.from);
        const to = project.period.to ? this.formatDate(project.period.to) : 'Present';
        return `${from} — ${to}`;
    }

    protected goBack(): void {
        this.router.navigate(['/projects']);
    }

    protected openImageViewer(event: IMediaEvent): void {
        this.imageViewerService.open({
            media: event.media,
            selectedMediaIndex: event.index,
        });
    }

    private formatDate(dateStr: string): string {
        const [year, month] = dateStr.split('-');
        const date = new Date(+year, +(month || 1) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}
