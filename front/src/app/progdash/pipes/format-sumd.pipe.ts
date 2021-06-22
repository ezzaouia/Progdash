import { Pipe, PipeTransform } from '@angular/core';
import { toNumber } from 'lodash';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({ name: 'formatSumd' })
export class FormatSumdPipe implements PipeTransform {
  transform ( value: number, key: string, options?: string ): string {
    return this.keyFormat( value, key );
  }

  keyFormat ( value, key ) {
    let kf = null;
    switch ( key ) {
      case 'dropout':
      case 'time': {
        kf = this.timeFormater( toNumber( value ));
        break;
      }
      default: {
        kf = value;
      }
    }
    return kf;
  }

  timeFormater ( value ) {
    // replace mins in min because the moment add the letter 's' automatic.
    return moment.duration( value, 'minutes' ).format( 'h [h] mm [min]' ).replace("mins", "min");
  }

}
