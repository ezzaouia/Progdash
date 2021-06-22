import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mathAbs' })
export class MathAbsPipe implements PipeTransform {
  transform ( value: number ): string {
    return '' + Math.abs( value );
  }
}
