import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DateTimeFormatterType } from 'src/types/date-time-formatter.types';
import { DateComponent } from '../date/date.component';

@Component({
    selector: 'sp-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DateComponent]
})
export class DateRangeComponent {
  @Input() startDate:Date|null = null;
  @Input() endDate:Date|null = null;
  @Input() format?:DateTimeFormatterType;

  constructor() {}
}
