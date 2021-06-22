import { v4 as uuid } from 'uuid';
import { random } from 'lodash';
import * as faker from 'faker';

export interface TableViewModel {
  id: string;
  groupName: string;
  name: string;
  initialEval: number;
  timeSpent: number;
  currentLevel: number;
  totalRules: number;
  timeSpentFormat: string;
}

export interface RuleViewModel {
  id: string;
  name: string;
  score: number;
  nok: number;
  nko: number;
}

export interface QuickViewModel {
  id: string;
  top: string;
  struggle: string;
  absent: string;
}


export enum ZoomTimeLevel {
  day = 0,
  week = 1, // start
  month = 2,
  smooth = 3,
}

export const clazz = [ 'AM1', 'AM2', 'FED1', 'FED2', 'SNIR' ];

export const tableViewData = size => {
  const data: TableViewModel[] = [];
  for ( let i = 0; i < size; ++i ) {
    data.push({
      id: 'Item' + i,
      groupName: clazz[Math.floor( Math.random() * 5 )],
      name: faker.name.findName(),
      initialEval: random( 0, 100 ),
      timeSpent: random( 0, 10 * 60 ),
      currentLevel: random( 0, 210 ),
      totalRules: random( 240, 300 ),
      timeSpentFormat: '',
    });
  }
  return data;
};



