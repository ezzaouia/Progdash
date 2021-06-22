import { chain, toNumber } from 'lodash';

export interface IUserStatsModel {
  name;
  groupName;
  initialLevel;
  currentLevel;
  timeSpent;
  lastLearningDate;
  connectionsNbr;
}

export class UserStatsModel {
  item;

  constructor ( item ) {
    this.item = item;
  }

  get initialEval () {
    return chain( this.item ).map( 'initial_weight' ).map( toNumber ).sum().value();
  }

}

export const modelColumns: string[] = [
  'name',
  'groupName',
  'initialEvalCat',
  'currentLevel',
  'timeSpent',
  // 'slopeLevel',
  // 'modules',
  // 'timeScores',
  // 'initialEval',
  // 'timeAndScore',
];

// export const ELEMENT_DATA: IUserStatsModel[] = [
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 10,
//     initialLevel: 9,
//     currentLevel: 30,
//     slopeLevel: 30 - 9,
//     timeSpent: 100,
//     timeScores: [],
//     modules: [
//       { key: 'module1', value: 100 },
//       { key: 'module2', value: 100 },
//       { key: 'module3', value: 50 },
//     ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 30,
//     initialLevel: 50,
//     currentLevel: 90,
//     slopeLevel: 40,
//     timeSpent: 200,
//     timeScores: [],
//     modules: [
//       { key: 'module1', value: 100 },
//       { key: 'module2', value: 100 },
//     ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 0,
//     initialLevel: 0,
//     currentLevel: 0,
//     slopeLevel: 0,
//     timeSpent: 0,
//     timeScores: [],
//     modules: [
//       { key: 'module2', value: 0 },
//       { key: 'module3', value: 0 },
//       { key: 'module4', value: 0 },
//     ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 40,
//     initialLevel: 50,
//     currentLevel: 100,
//     slopeLevel: 50,
//     timeSpent: 300,
//     timeScores: [],
//     modules: [ { key: 'module2', value: 70 } ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 20,
//     initialLevel: 30,
//     currentLevel: 100,
//     slopeLevel: 70,
//     timeSpent: 350,
//     timeScores: [],
//     modules: [ { key: 'module4', value: 0 } ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 20,
//     initialLevel: 30,
//     currentLevel: 100,
//     slopeLevel: 70,
//     timeSpent: 350,
//     timeScores: [],
//     modules: [
//       { key: 'module1', value: 100 },
//       { key: 'module2', value: 100 },
//       { key: 'module3', value: 100 },
//       { key: 'module4', value: 0 },
//     ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 0,
//     initialLevel: 0,
//     currentLevel: 0,
//     slopeLevel: 0,
//     timeSpent: 0,
//     timeScores: [],
//     modules: [
//       { key: 'module1', value: 100 },
//       { key: 'module2', value: 100 },
//       { key: 'module3', value: 100 },
//       { key: 'module4', value: 0 },
//     ],
//   },
//   {
//     name: 'name',
//     userId: 'name',
//     initialEval: 10,
//     initialLevel: 3,
//     currentLevel: 3,
//     slopeLevel: 0,
//     timeSpent: 30,
//     timeScores: [],
//     modules: [
//       { key: 'module1', value: 100 },
//       { key: 'module2', value: 100 },
//       { key: 'module3', value: 100 },
//     ],
//   },
// ];
