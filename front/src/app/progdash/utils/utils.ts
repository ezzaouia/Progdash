import { timeFormat, timeParse } from 'd3';

export enum Timescale {
  lastWeek = 'lastWeek',
  lastMonth = 'lastWeek',
}

export const dayFormatTime = timeFormat( '%d/%m/\'%y' );
export const weekFormatTime = timeFormat( '%V/%m/\'%y' );
export const monthFormatTime = timeFormat( '%m/\'%y' );
export const dayParseTime = timeParse( '%d/%m/\'%y' );
export const weekParseTime = timeParse( '%V/%m/\'%y' );
export const monthParseTime = timeParse( '%m/\'%y' );
