import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'bc-article-detail',
    templateUrl: './article-detail-page.component.html',
    styleUrls: ['./article-detail-page.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailPageComponent {
}
