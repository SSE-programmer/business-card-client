import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '@components/card/card.component';
import { CareerTimelineComponent } from '@components/career-timeline/career-timeline.component';
import { CONTACTS_LIST } from './constants/contacts-list.constant';
import { JOB_EXPERIENCE } from './constants/job-experience.constant';
import { SKILLS_LIST } from './constants/skills-list.constant';
import { OnloadFadeInDirective } from '@directives/onload-fade-in/onload-fade-in.directive';
import { LevelIndicatorComponent } from '@components/level-indicator/level-indicator.component';
import { TagComponent } from '@components/tag/tag.component';

@Component({
    selector: 'bc-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        NgOptimizedImage,
        CardComponent,
        NgComponentOutlet,
        CareerTimelineComponent,
        OnloadFadeInDirective,
        LevelIndicatorComponent,
        TagComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
    @HostBinding('class.bc-page') bcPage = true;

    public contactsList = CONTACTS_LIST;
    public jobExperience = JOB_EXPERIENCE;
    public skillsList = SKILLS_LIST;
}
