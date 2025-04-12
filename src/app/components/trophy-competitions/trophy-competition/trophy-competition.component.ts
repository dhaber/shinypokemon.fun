import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Competition } from 'models/competition.model';
import { DateRangeComponent } from '../../_shared/date-range/date-range.component';

@Component({
  selector: 'sp-trophy-competition',
  templateUrl: './trophy-competition.component.html',
  styleUrls: ['./trophy-competition.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, DateRangeComponent],
})
export class TrophyCompetitionComponent {
  trophyCompetition = input.required<Competition>();
}
