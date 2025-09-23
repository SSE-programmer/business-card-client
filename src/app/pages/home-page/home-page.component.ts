import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '@components/card/card.component';
import { CareerTimelineComponent } from '@components/career-timeline/career-timeline.component';
import { CONTACTS_LIST } from './constants/contacts-list.constant';
import { JOB_EXPERIENCE } from './constants/job-experience.constant';
import { OnloadFadeInDirective } from '@directives/onload-fade-in/onload-fade-in.directive';
import { SkillsContainer } from '@pages/home-page/components/skills-container/skills-container';

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
        SkillsContainer,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
    public contactsList = CONTACTS_LIST;
    public jobExperience = JOB_EXPERIENCE;
}
