import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

/*
 * Usage:
 *   value | formatTimeSpent:pattern
 * Example:
 *   {{ number | formatTimeSpent:'h[h]mm[m]' }}
 *   formats to:
*/
@Pipe({ name: 'formatTime' })
export class FormatTimePipe implements PipeTransform {
  transform ( value: number, format?: string ): string {
    return moment
            .duration( value, 'minutes' )
            .format( format || 'h[h]mm[min]' );
  }
}
