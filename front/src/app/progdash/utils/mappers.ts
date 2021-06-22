import { nest, timeFormat, timeParse, scaleOrdinal, schemeCategory10 } from 'd3';
import {
  chain,
  toNumber,
  sortBy,
  random,
  sampleSize,
  mapValues,
  get,
  map,
  each,
  flatMap,
  filter,
  has,
  size,
  pickBy,
  find,
  differenceBy,
  orderBy,
  keys,
  maxBy,
  keyBy,
} from 'lodash';
import {
  map as mapf,
  flatten as flattenf,
  flow,
  find as findf,
  get as getf,
  first as firstf,
  last as lastf,
  sum as sumf,
  divide as dividef,
  round as roundf,
  mapValues as mapValuesf,
  sortBy as sortByf,
  take as takef,
  size as sizef,
  uniq as uniqf,
  values as valuesf,
  pickBy as pickByf,
  groupBy as groupByf,
} from 'lodash/fp';
import * as moment from 'moment';
import 'moment-duration-format';
moment.locale( 'fr' );

export const dayFormatTime = timeFormat( '%d/%m/\'%y' );
export const weekFormatTime = timeFormat( '%V/%m/\'%y' );
export const monthFormatTime = timeFormat( '%m/\'%y' );
export const dayParseTime = timeParse( '%d/%m/\'%y' );
export const weekParseTime = timeParse( '%V/%m/\'%y' );
export const monthParseTime = timeParse( '%m/\'%y' );


export const cast = d => ({
  ...d,
  max_weight: +d.max_weight,
  initial_weight: +d.initial_weight,
  learning_time_spent: +d.learning_time_spent,
  day: dayFormatTime( new Date( d.learning_date )),
  week: weekFormatTime( new Date( d.learning_date )),
  month: monthFormatTime( new Date( d.learning_date )),
});

export const prsDte = d => new Date( d.value.date );

export const sortByDate: any = a => sortBy( a, prsDte );

const getInitialEvalCat = initialEval => {
  let cat = 'N.A';
  if ( initialEval >= 0 && initialEval <= 20 ) {
    cat = 'Inférieur à A1';
  } else if ( initialEval > 20 && initialEval <= 80 ) {
    cat = 'A1';
  } else {
    cat = 'B1';
  }
  return cat;
};

// tslint:disable-next-line:no-eval
function sortByDateAscending ( timeKey, a, b ) {
  return (
    eval( `${timeKey}ParseTime(${a.date})` ) -
    eval( `${timeKey}ParseTime(${b.date})` )
  );
}

export const sumNbr = ( item, key ) =>
  chain( item )
    .map( key )
    .map( toNumber )
    .sum();

const timeMapper = item =>
  flow(
    mapf( 'learning_time_spent' ),
    sumf,
    roundf
  )( item );

const scoreMapper = item =>
  flow(
    mapf( 'max_weight' ),
    sumf,
    roundf
  )( item );

export const frst = ( item, key ): any =>
  chain( item )
    .first()
    .get( key );

export const attr: any = item => ({
  score: sumNbr( item, 'max_weight' ).value(),
  time: sumNbr( item, 'learning_time_spent' )
    .divide( 60 )
    .value(),
  nok: sumNbr( item, 'nbr_ok' ).value(),
  nko: sumNbr( item, 'nbr_ko' ).value(),
  groupName: frst( item, 'group_name' )
    .upperCase()
    .trim( ' ' )
    .value(),
  moduleName: frst( item, 'module_name' ).value(),
  date: new Date( frst( item, 'session_start_date' ).value()),
});

const progDataMapper = item => {
  let nestByModuleKey, runningSum;
  const timeKeys = { day: {}, week: {}, month: {} };

  const _map = ( key, d ): any => ({
    time: timeMapper( d ),
    score: scoreMapper( d ),
    date: frst( d, key ).value(),
    moduleName: frst( d, 'module_name' ).value(),
  });

  const _rnngsum = ( values ): any => {
    let sumscore = 0,
      sumtime = 0;
    each( values, arrayData => {
      ( sumscore = 0 ), ( sumtime = 0 );
      arrayData.values = map( arrayData.values, o => {
        sumscore += o.value.score;
        sumtime += o.value.time;
        return { ...o.value, sumscore, sumtime };
      });
    });
    return values;
  };

  const _nest = ( d, key ) => {
    return nest()
      .key(( dd: any ) => get( dd, 'module_name' ))
      .key(( dd: any ) => get( dd, key ))
      .sortKeys( sortByDateAscending.bind( null, key ))
      .rollup( _map.bind( null, key ))
      .entries( d );
  };

  return mapValues( timeKeys, ( _, key ) => {
    nestByModuleKey = _nest( item, key );

    runningSum = _rnngsum( nestByModuleKey );
    runningSum = flatMap( runningSum, 'values' );

    return runningSum;
  });
};

export const usersAttr = ( item ): any => {
  const time = timeMapper( item );
  const score = scoreMapper( item );
  const firstName = 'Random Name '/*flow(
    firstf,
    getf( 'first_name' )
    )( item )*/;
  const lastName = 'Random Name ' /*flow(
    firstf,
    getf( 'last_name' )
    )( item )*/;
  const fullName = lastName + ' ' + firstName;
  const lastConnection = moment( frst( item, 'learning_date' ).value()).fromNow();
  const initialEvalSum = flow(
    mapf( 'initial_weight' ),
    sumf,
    roundf
  )( item );
  const initialEvalCat = getInitialEvalCat( initialEvalSum );
  const moduleName = flow(
    mapf( 'module_name' ),
    lastf
  )( item );
  return {
    id: flow(
      firstf,
      getf( 'user_id' )
    )( item ),
    firstName,
    lastName,
    fullName,
    className: flow(
      firstf,
      getf( 'group_name' )
    )( item ),
    time: {
      sum: time,
      format: moment.duration( time, 'seconds' ).format( 'h[h]mm[min]' ),
    },
    score: {
      sum: score,
      count: 200,
      format: `${score}/260`,
    },
    initialEval: {
      sum: initialEvalSum,
      cat: initialEvalCat,
    },
    initialLevel: {
      sum: flow(
        mapf( 'initial_weight' ),
        sumf,
        roundf
      )( item ),
    },
    lastConnection,
    moduleName,
    connectionsNbr: flow(
      mapf( 'day' ),
      uniqf,
      sizef
    )( item ),
    progData: progDataMapper( item ),
    topNRules: {
      focused: {
        topN: map( sampleSize( item, 5 ), r => ({
          ruleId: get( r, 'rule_id' ),
          ruleName: get( r, 'rule_name' ),
        })),
      },
      acquired: {
        topN: map( sampleSize( item, 5 ), r => ({
          ruleId: get( r, 'rule_id' ),
          ruleName: get( r, 'rule_name' ),
        })),
      },
      known: {
        topN: map( sampleSize( item, 5 ), r => ({
          ruleId: get( r, 'rule_id' ),
          ruleName: get( r, 'rule_name' ),
        })),
      },
    },
    // Array.from({ length: 20 },  ( v, k ) => ({ x: k, y: random( 0, 99 ) })),
    insights: {
      lastWeek: {
        time: {
          sum: random( 600, 1800 ),
          sumd: random( 300, 1200 ),
          sign: delta[random( 0, 1 )],
        },
        score: {
          sum: random( 0, 5 ),
          sumd: random( 0, 3 ),
          sign: delta[random( 0, 1 )],
        },
        help: {
          sum: random( 0, 5 ),
          sumd: random( 0, 3 ),
          sign: delta[random( 0, 1 )],
        },
        dropout: {
          sum: random( 0, 5 ),
          sumd: random( 0, 3 ),
          sign: delta[random( 0, 1 )],
        },
      },
      lastMonth: {
        time: {
          sum: random( 1800, 1800 * 3 ),
          sumd: random( 1800, 1200 * 1.5 ),
          sign: delta[random( 0, 1 )],
        },
        score: {
          sum: random( 0, 20 ),
          sumd: random( 5, 14 ),
          sign: delta[random( 0, 1 )],
        },
        help: {
          sum: random( 0, 20 ),
          sumd: random( 5, 14 ),
          sign: delta[random( 0, 1 )],
        },
        dropout: {
          sum: random( 0, 20 ),
          sumd: random( 5, 14 ),
          sign: delta[random( 0, 1 )],
        },
      },
    },
  };
};

export const rulesAttr = ( item ): any => {
  return {
    ruleId: flow(
      firstf,
      getf( 'rule_id' )
    )( item ),
    ruleName: flow(
      firstf,
      getf( 'rule_name' )
    )( item ),
  };
};

const delta = [ 'plus', 'minus' ];

export const insightsAttr = ( users, rules ) => {
  return {
    lastWeek: {
      time: {
        sum: random( 1800, 3000 ),
        sumd: random( 900, 1200 ),
        sign: delta[random( 0, 1 )],
      },
      score: {
        sum: random( 5, 10 ),
        sumd: random( 2, 5 ),
        sign: delta[random( 0, 1 )],
      },
      activeUsers: {
        sum: random( 5, 10 ),
        sumd: random( 2, 5 ),
        sign: delta[random( 0, 1 )],
      },
      inactiveUsers: {
        sum: random( 5, 10 ),
        sumd: random( 2, 5 ),
        sign: delta[random( 0, 1 )],
      },
      connections: {
        values: Array.from({ length: 7 }, ( v, k ) => ({
          x: k,
          y: random( 0, 99 ),
          date: moment().add( k + 1, 'days' ),
        })),
      },
      topNUsers: {
        score: {
          topN: flow(
            sortByf( 'insight.lastWeek.score.sum' ),
            takef( 5 )
          )( users ),
        },
        time: {
          topN: flow(
            sortByf( 'insight.lastWeek.score.sum' ),
            takef( 5 )
          )( users ),
        },
        help: {
          topN: flow(
            sortByf( 'insight.lastWeek.score.sum' ),
            takef( 5 )
          )( users ),
        },
        dropout: {
          topN: flow(
            sortByf( 'insight.lastWeek.score.sum' ),
            takef( 5 )
          )( users ),
        },
      },
      topNRules: {
        focused: {
          topN: sampleSize( rules, 5 ),
        },
        acquired: {
          topN: sampleSize( rules, 5 ),
        },
        known: {
          topN: sampleSize( rules, 5 ),
        },
      },
      scaleLabel: '',
    },
    lastMonth: {
      time: {
        sum: random( 3000, 2 * 3000 ),
        sumd: random( 1800, 3000 ),
        sign: delta[random( 0, 1 )],
      },
      score: {
        sum: random( 2 * 5, 2 * 10 ),
        sumd: random( 2 * 2, 2 * 5 ),
        sign: delta[random( 0, 1 )],
      },
      activeUsers: {
        sum: random( 2 * 5, 2 * 10 ),
        sumd: random( 2 * 2, 2 * 5 ),
        sign: delta[random( 0, 1 )],
      },
      inactiveUsers: {
        sum: random( 2 * 5, 2 * 10 ),
        sumd: random( 2 * 2, 2 * 5 ),
        sign: delta[random( 0, 1 )],
      },
      connections: {
        values: Array.from({ length: 30 }, ( v, k ) => ({
          x: k,
          y: random( 0, 99 ),
          date: moment().add( k + 1, 'days' ),
        })),
      },
      topNUsers: {
        score: {
          topN: flow(
            sortByf( 'insight.lastMonth.score.sum' ),
            takef( 5 )
          )( users ),
        },
        time: {
          topN: flow(
            sortByf( 'insight.lastMonth.score.sum' ),
            takef( 5 )
          )( users ),
        },
        help: {
          topN: flow(
            sortByf( 'insight.lastMonth.score.sum' ),
            takef( 5 )
          )( users ),
        },
        dropout: {
          topN: flow(
            sortByf( 'insight.lastMonth.score.sum' ),
            takef( 5 )
          )( users ),
        },
      },
      topNRules: {
        focused: {
          topN: sampleSize( rules, 5 ),
        },
        acquired: {
          topN: sampleSize( rules, 5 ),
        },
        known: {
          topN: sampleSize( rules, 5 ),
        },
      },
    },
  };
};

export const modulesDataAttrV2 = modulesData => {
  // equivalent modules will not be displayed in same line
  const routeWithMaxNbrOfModule = chain( modulesData )
    .groupBy( 'routeId' )
    .mapValues( size )
    .value();

  const maxId = maxBy( keys( routeWithMaxNbrOfModule ), k => routeWithMaxNbrOfModule[k]);

  const route1 = filter( modulesData, d => d.routeId === +maxId );
  const route2 = filter( modulesData, d => d.routeId !== +maxId );
  const all = [ ...route1, ...differenceBy( route2, route1, 'key' ) ];

  const sorted = orderBy( all, [ 'index' ], [ 'desc' ]);
  const displayed = orderBy( route1, [ 'index' ], [ 'desc' ]);

  const forLabel = [];
  const forLine = [];
  let rf, sf, rSumOfTopRules, sSumOfTopRules;

  each( displayed, ( v, __ ) => {
    rf = filter( displayed, ( e, ___ ) => e.index <= v.index );
    rSumOfTopRules = chain( rf )
      .map( 'nbrOfRules' )
      .sum()
      .value();
    forLabel.push({ ...v, rSumOfTopRules });
  });

  each( sorted, ( v, __ ) => {
    sf = filter( displayed, ( e, ___ ) => e.index < v.index );
    sSumOfTopRules = chain( sf )
      .map( 'nbrOfRules' )
      .sum()
      .value();
    forLine.push({ ...v, sSumOfTopRules });
  });

  const colorScheme = scaleOrdinal( schemeCategory10 ).domain( map( forLine, 'key' ));
  const forColor = mapValues( keyBy( forLine, 'key' ), ( _, key ) => colorScheme( key ));
  const displayedNbrOfRules = chain( displayed ).map( 'nbrOfRules' ).sum().value();

  return {
    all,
    forLabel,
    forLine,
    forColor,
    displayedNbrOfRules, // only displyed modules
  };
};

export const modulesDataAttr = modulesData => {
  // equivalent modules will not be displayed in same line
  const sorted = sortBy( modulesData, [ 'index' ]);
  const displayed: {
    key: string;
    index: number;
    nbrOfRules: number;
  }[] = filter( sorted, ( v, _ ) => !has( v, 'sameAs' ));

  const forLabel = [], forLine = [];
  let rf, sf;
  each( displayed, ( v, _ ) => {
    rf = filter( displayed, ( e, __ ) => e.index >= v.index );
    forLabel.push({
      ...v,
      rSumOfTopRules: flow(
        mapf( 'nbrOfRules' ),
        sumf
      )( rf ),
    });
  });

  each( sorted, ( v, _ ) => {
    sf = filter( displayed, ( e, __ ) => e.index > v.index );
    forLine.push({
      ...v,
      sSumOfTopRules: flow(
        mapf( 'nbrOfRules' ),
        sumf
      )( sf ),
    });
  });

  return {
    all: sorted,
    forLabel,
    forLine,
    displayedNbrOfRules: flow(
      mapf( 'nbrOfRules' ),
      sumf
    )( displayed ), // only displyed modules
  };
};
