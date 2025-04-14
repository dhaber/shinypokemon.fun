import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TrophyCompetitionPageViewModel,
  trophyCompetitionPageViewModel,
} from 'store/view-models/trophy-competition-page.view-model';
import { TrophyCompetitionComponent } from '../trophy-competition/trophy-competition.component';

@Component({
  selector: 'sp-trophy-competition-page-infographic',
  templateUrl: './trophy-competition-page-infographic.component.html',
  styleUrls: ['./trophy-competition-page-infographic.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TrophyCompetitionComponent, RouterLink],
})
export class TrophyCompetitionPageInfographicComponent {
  private readonly store: Store = inject(Store);

  vm: Signal<TrophyCompetitionPageViewModel> = this.store.selectSignal(
    trophyCompetitionPageViewModel
  );
}
