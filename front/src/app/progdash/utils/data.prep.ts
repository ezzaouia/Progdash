import { each, get, mapValues, map, keys, values } from 'lodash';
import { nest } from 'd3';

import * as Mappers from './mappers';

import { modulesData } from '../../utils/chart.util';

// prepers
// -------
export const filename = 'assets/data/s26880.v3.csv';

const usersPrep = ( data ) => {
  let g = null;
  return nest()
    .key(( d: any ) => (( g = get( d, 'group_name' )) ? g : 'UNKNOWN' ))
    .key(( d: any ) => get( d, 'user_id' ))
    .rollup( Mappers.usersAttr )
    .object( data );
};

const rulesPrep = data => {
  let g = null;
  return nest()
    .key(( d: any ) => (( g = get( d, 'group_name' )) ? g : 'UNKNOWN' ))
    .key(( d: any ) => get( d, 'rule_id' ))
    .rollup( Mappers.rulesAttr )
    .object( data );
};

const userRulesPrep = data => {
  return nest()
    .key(( d: any ) => get( d, 'user_id' ))
    .key(( d: any ) => get( d, 'rule_id' ))
    .rollup( Mappers.rulesAttr )
    .object( data );
};

const classPrep = ( users, rules ) => {
  return mapValues( users, ( d, key ) => ({
        users: keys( d ),
        insights: insightsPrep ( values( d ), values( rules[key])),
      }));
};

const insightsPrep = ( users, rules ) => {
  return Mappers.insightsAttr( users, rules );
};

const modulesDataPrep = mdata => {
  return Mappers.modulesDataAttr ( mdata );
};

export const dataPrep = payload => {
  const rules = rulesPrep( payload );

  const users = usersPrep( payload );
  const classes = classPrep( users, rules );
  // const insights = insightsPrep( users );

  return {
    usersByClass: { byClassId: users },
    classes: { byId: classes, allIds: keys( users ) },
    rules: { byId: rules, allIds: keys( rules ) },
    modulesData: modulesDataPrep( modulesData ) ,
    // insights,
  };
};
