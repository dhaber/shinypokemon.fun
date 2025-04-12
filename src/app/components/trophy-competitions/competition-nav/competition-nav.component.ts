import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PreviousYearsComponent } from '../../years/previous-years/previous-years.component';
import { CurrentYearComponent } from '../../years/current-year/current-year.component';

@Component({
    selector: 'sp-competition-nav',
    templateUrl: './competition-nav.component.html',
    styleUrls: ['./competition-nav.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CurrentYearComponent, PreviousYearsComponent]
})
export class CompetitionNavComponent {

}
