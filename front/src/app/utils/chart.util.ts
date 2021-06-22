import { timeParse, timeFormat, timeWeek, timeMonth, interpolateRdYlGn } from 'd3';

export const dayFormatTime = timeFormat( '%d/%m/\'%y' );
export const weekFormatTime = timeFormat( '%V/%m/\'%y' );
export const monthFormatTime = timeFormat( '%m/\'%y' );
export const dayParseTime = timeParse( '%d/%m/\'%y' );
export const weekParseTime = timeParse( '%V/%m/\'%y' );
export const monthParseTime = timeParse( '%m/\'%y' );

export enum ChartLayout {
  Unified = 'unified',
  Faceted = 'faceted',
  Segmented = 'segmented',
}

export enum ChartAggregate {
  RunningSum = 'sum',
  Unit = '',
}

// from François
// Collège vient avant Pro ou avant Pont supérieur
// 1. Les Fondamentaux
// 2. Les Fondamentaux Campus
// 3. Pro
// 4. Pont Supérieur
// 5. Supérieur
// 6. Orthotypographie
// 7. Excellence

export const modulesData = [
  {
    key: 'Orthotypographie',
    index: 0, // l'ordre (inverse d'affichage)
    nbrOfRules: 24, // nombre de règles du module
  },
  {
    key: 'Pont supérieur',
    index: 1,
    nbrOfRules: 56,
  },
  {
    key: 'Pro',
    index: 2,
    nbrOfRules: 84,
  },
  {
    key: 'Les Fondamentaux Campus',
    index: 3,
    nbrOfRules: 47,
  },
  {
    key: 'Supérieur',
    index: 2, // j'affiche pas
    nbrOfRules: 140,
    sameAs: [ 'Pont supérieur', 'Pro' ],
  },
];

export const moduleOrder = [
  'Orthotypographie',
  'Pont supérieur',
  'Pro',
  'Les Fondamentaux Campus',
];

// modules to disply
// modules of the sphere with nbr of rules

export const moduleNbrRules = {
  'Les Fondamentaux Campus': 47,
  Pro: 84,
  'Pont supérieur': 56,
  Supérieur: 140,
  Orthotypographie: 24,
};

export const newModuleNbrRules = {
  Orthotypographie: 24 + 56 + 84 + 47,
  'Pont supérieur': 56 + 84 + 47,
  Pro: 84 + 47,
  'Les Fondamentaux Campus': 47,
};

export const newModuleScale = {
  Orthotypographie: 56 + 84 + 47,
  'Pont supérieur': 84 + 47,
  Pro: 47,
  Supérieur: 47,
  'Les Fondamentaux Campus': 0,
};

export enum ChartTimeScale {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export type ChartFactorsUnion = ChartLayout | ChartAggregate;

export const parseTime = timeParse( '%m/%Y %V' );
export const chartFormatTime = timeFormat( '%V/%y' );
export const momentWeekTime = '%MM/%YYYY %ww';

export const ChartFormat = {
  width: 900,
  height: 550,
  margin: 40,
  axis: {
    x: {
      position: 'bottom',
      scale: {
        [ChartTimeScale.Day]: {
          name: 'day',
          format: dayFormatTime,
          parse: dayParseTime,
          xTick: {
            [ChartLayout.Unified]: timeWeek.every( 15 ),
            [ChartLayout.Faceted]: timeWeek.every( 5 ),
            [ChartLayout.Segmented]: timeWeek.every( 12 ),
          },
        },
        [ChartTimeScale.Week]: {
          name: 'week',
          format: weekFormatTime,
          parse: weekParseTime,
          xTick: {
            [ChartLayout.Unified]: timeWeek.every( 5 ),
            [ChartLayout.Faceted]: timeWeek.every( 5 ),
            [ChartLayout.Segmented]: timeWeek.every( 12 ),
          },
        },
        [ChartTimeScale.Month]: {
          name: 'month',
          format: monthFormatTime,
          parse: monthParseTime,
          xTick: {
            [ChartLayout.Unified]: timeMonth.every( 1 ),
            [ChartLayout.Faceted]: timeMonth.every( 1 ),
            [ChartLayout.Segmented]: timeMonth.every( 3 ),
          },
        },
      },
    },
    y: {
      position: 'left',
      scale: {
        yTick: {
          [ChartLayout.Unified]: 6,
          [ChartLayout.Faceted]: 2,
          [ChartLayout.Segmented]: 2,
        },
      },
    },
  },
  yTick: {
    [ChartLayout.Unified]: 6,
    [ChartLayout.Faceted]: 2,
    [ChartLayout.Segmented]: 2,
  },
  [ChartTimeScale.Day]: {
    name: 'day',
    format: dayFormatTime,
    parse: dayParseTime,
    xTick: {
      [ChartLayout.Unified]: timeWeek.every( 3 ),
      [ChartLayout.Faceted]: timeWeek.every( 3 ),
      [ChartLayout.Segmented]: timeWeek.every( 12 ),
    },
  },
  [ChartTimeScale.Week]: {
    name: 'week',
    format: weekFormatTime,
    parse: weekParseTime,
    xTick: {
      [ChartLayout.Unified]: timeWeek.every( 3 ),
      [ChartLayout.Faceted]: timeWeek.every( 3 ),
      [ChartLayout.Segmented]: timeWeek.every( 12 ),
    },
  },
  [ChartTimeScale.Month]: {
    name: 'month',
    format: monthFormatTime,
    parse: monthParseTime,
    xTick: {
      [ChartLayout.Unified]: timeMonth.every( 1 ),
      [ChartLayout.Faceted]: timeMonth.every( 1 ),
      [ChartLayout.Segmented]: timeMonth.every( 3 ),
    },
  },
};

export const sortByDateAndVersion = array => {
  let date1: any;
  let date2: any;
  return array.sort( function ( a: any, b: any ) {
    date1 = new Date( parseTime( a.key ));
    date2 = new Date( parseTime( b.key ));
    return date1 - date2 || b.v - a.v;
  });
};

export const initialEvalCatColors = {
  'Inférieur à A1': '#fbc02d',
  A1: '#0288d1',
  B1: '#689f38',
};

export const moduleCatColors = {
  'Les Fondamentaux Campus': interpolateRdYlGn( 0.3 ),
  'Pro': interpolateRdYlGn( 0.5 ),
  'Pont supérieur': interpolateRdYlGn( 0.7 ),
  'Supérieur': interpolateRdYlGn( 0.8 ),
  'Orthotypographie': interpolateRdYlGn( 1 ),
};

export const horizonColors = [ '#fefedd', '#d2eda1', '#42a65b', '#00492b' ];

export const colors = [
  '#00c6d0',
  '#eb007c',
  '#00c367',
  '#7335ba',
  '#56aa04',
  '#a00095',
  '#b3d167',
  '#fd55cc',
  '#9f9400',
  '#005bb7',
  '#786c00',
  '#c9a5ff',
  '#3d5b0c',
  '#ff568c',
  '#43dbcc',
  '#9a2920',
  '#30d4ff',
  '#8c5400',
  '#0182d1',
  '#ff9567',
  '#01a1ad',
  '#ff94a1',
  '#80d8ac',
  '#8a354f',
  '#b9cf84',
  '#534c81',
  '#ffabee',
  '#8b4f41',
  '#7681b6',
  '#d6a9d9',
];
