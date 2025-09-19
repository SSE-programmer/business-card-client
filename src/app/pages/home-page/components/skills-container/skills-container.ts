import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LevelIndicatorComponent } from '@components/level-indicator/level-indicator.component';
import { TagComponent } from '@components/tag/tag.component';
import { SKILLS_LIST } from '@pages/home-page/constants/skills-list.constant';

@Component({
  selector: 'bc-skills-container',
  imports: [
      LevelIndicatorComponent,
      TagComponent
  ],
  templateUrl: './skills-container.html',
  styleUrl: './skills-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsContainer {
    protected readonly skillsList = SKILLS_LIST;
}
