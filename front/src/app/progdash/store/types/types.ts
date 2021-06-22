interface Module {
  id: string;
  name: string;
  countRules: Number;
}

interface RuleName {
  id: string;
  name: string;
  difficultyLevel: Number;
}

interface Extent {
  min: Number;
  max: Number;
}

export interface RuleData {
  focused: { count: Number, extent: Extent, topNValue?: Number, topN: Array<RuleName> };
  acquired: { count: Number, extent: Extent, topNValue?: Number, topN: Array<RuleName> };
  known: { count: Number, extent: Extent, topNValue?: Number, topN: Array<RuleName> };
}

interface Insight {
  time: { sum: Number; sumd: Number };
  score: { sum: Number; sumd: Number };
  activeUsers: { sum: Number; sumd: Number };
  inactiveUsers: { sum: Number; sumd: Number };
  topNRules: RuleData;
  connections: {};
  topNUsers: {};
}

export interface InsightData {
  lastWeek: Insight;
  lastMonth: Insight;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  className: string;
  time: { sum: Number; format?: string };
  score: { sum: Number; count: Number; format?: string };
  initialEval: { sum: Number; count?: Number; };
  initialLevel: { sum: Number; count?: Number; };
  lastConnection: string;
  connectionsNbr: Number;
  progData: any[];
  topNRules: RuleData;
  // modules: Array<{ sum: Number ; module: Module }>;
  insight: InsightData;
}

export interface ClassData {
  users: Array<string>;
  insights: InsightData;
}

export interface StoreField<T> {
  byId: { [ key: string ]: T };
  allIds: Array<string>;
  tmpAllIds: Array<any>;
}
