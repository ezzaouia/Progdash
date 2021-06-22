import { filter, indexOf, startsWith, get, keyBy } from 'lodash';

import { DashActionsUnion, DashActionTypes, LoadUserInfo } from '../actions';
import { modulesDataAttr } from '../utils/data-prep.utils';

export interface State {
  isGeneratePVLiveLinkSuccess: boolean;
  isGeneratingPVLiveLink: boolean;
  generatedLivePVLink: string;
  isDataLoaded: boolean;
  isProgTableOpened: boolean;
  isProgEvaluationOpened: boolean;
  isLoading: boolean;
  classes: any;
  selectedClass: any;
  selectedTimescale: string;
  selectedRules: string[];
  isStartPrintReport: boolean;
  selectedWidgets: string[];
  areaId: number;
  userId: number;
}

const initialState: State = {
  isGeneratePVLiveLinkSuccess: false,
  isGeneratingPVLiveLink: false,
  generatedLivePVLink: null,
  isDataLoaded: false,
  isProgTableOpened: false,
  isProgEvaluationOpened: false,
  isLoading: false,
  classes: { allIds: [], byId: {} },
  selectedClass: {},
  selectedTimescale: 'lastMonth',
  selectedRules: [],
  isStartPrintReport: false,
  selectedWidgets: [],
  areaId: null,
  userId: null,
};

export function reducers (
  state = initialState,
  action: DashActionsUnion
): State {
  switch ( action.type ) {
    case DashActionTypes.LoadUserInfo: {
      return {
          ...state,
          areaId: ( action as LoadUserInfo ).payload.areaId,
          userId: ( action as LoadUserInfo ).payload.userId,
      };
    }

    case DashActionTypes.NavigateToHome: {
      return {
        ...state,
        selectedClass: {},
        isStartPrintReport: false,
        isGeneratePVLiveLinkSuccess: false,
        isGeneratingPVLiveLink: false,
        generatedLivePVLink: null,
        isDataLoaded: false,
        isProgTableOpened: false,
        isProgEvaluationOpened: false,
        selectedRules: [],
        selectedWidgets: [],
      };
    }

    case DashActionTypes.LoadData: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.LoadDataSuccess: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.LoadDataFailure: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.LoadGroupsData: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.LoadGroupsDataSuccess: {
      return {
        ...state,
        isLoading: false,
        classes: {
          allIds: action.payload,
        },
      };
    }

    case DashActionTypes.LoadGroupsDataFailure: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.LoadGroupData: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.Empty: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.LoadGroupDataSuccess: {
      const { group, data } = action.payload;
      return {
        ...state,
        isLoading: false,
        classes: {
          ...state.classes,
          byId: {
            ...state.classes.byId,
            [group.id]: {
              users: keyBy( get( data, 'users', []), ( o: any ) => o.id ),
              insights: get( data, 'insights', {}),
              evaluations: get( data, 'evaluations', []),
              modules: modulesDataAttr ( get( data, 'modules', [])),
              pulledAt: new Date(),
            },
          },
        },
      };
    }

    case DashActionTypes.LoadGroupDataFailure: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.RunDataPrepComplete: {
      return {
        ...state,
        isDataLoaded: true,
        ...action.payload,
      };
    }

    case DashActionTypes.SelectClass: {
      return {
        ...state,
        isLoading: true,
        selectedClass: action.payload,
      };
    }

    case DashActionTypes.SelectTimescale: {
      return {
        ...state,
        selectedTimescale: action.payload,
      };
    }

    case DashActionTypes.OpenProgTable: {
      return {
        ...state,
        isProgTableOpened: true,
        isProgEvaluationOpened: false,
      };
    }

    case DashActionTypes.OpenProgEvaluation: {
      return {
        ...state,
        isProgEvaluationOpened: true,
        isProgTableOpened: false,
      };
    }

    case DashActionTypes.OpenProgBoard: {
      return {
        ...state,
        isProgTableOpened: false,
        isProgEvaluationOpened: false,
      };
    }

    case DashActionTypes.CheckRule: {
      const { isChecked, ruleId } = action.payload;

      if ( isChecked ) {
        // adding ruleId
        return {
          ...state,
          selectedRules: [ ...state.selectedRules, ruleId ],
        };
      } else {
        // removing rule
        const index = indexOf( state.selectedRules, ruleId );

        if ( index === -1 ) {
          return state;
        } else {
          return {
            ...state,
            selectedRules: [
              ...state.selectedRules.slice( 0, index ),
              ...state.selectedRules.slice( index + 1 ),
            ],
          };
        }
      }
    }

    case DashActionTypes.CancelPVLive: {
      return {
        ...state,
        selectedRules: [],
        generatedLivePVLink: null,
        isGeneratePVLiveLinkSuccess: false,
        isGeneratingPVLiveLink: false,
      };
    }

    case DashActionTypes.LaunchPVLive: {
      return {
        ...state,
        isGeneratePVLiveLinkSuccess: false,
        generatedLivePVLink: null,
      };
    }

    case DashActionTypes.GeneratePVLiveLink: {
      return {
        ...state,
        isGeneratingPVLiveLink: true,
      };
    }

    case DashActionTypes.GeneratePVLiveLinkSuccess: {
      return {
        ...state,
        generatedLivePVLink: action.payload,
        isGeneratePVLiveLinkSuccess: true,
      };
    }

    case DashActionTypes.GeneratePVLiveLinkFailure: {
      return {
        ...state,
        isGeneratePVLiveLinkSuccess: false,
        isGeneratingPVLiveLink: false,
        generatedLivePVLink: null,
      };
    }

    case DashActionTypes.GenericFailure: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DashActionTypes.StartPrintReport: {
      return {
        ...state,
        isStartPrintReport: true,
      };
    }

    case DashActionTypes.PrintReport: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.HotPrintWidget: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.ClosePrintReport: {
      return {
        ...state,
        isStartPrintReport: false,
        selectedWidgets: [],
      };
    }

    case DashActionTypes.CheckWidget: {
      const { isChecked, widgetId } = action.payload;

      if ( isChecked ) {
        // adding widget
        let sw = state.selectedWidgets;
        // if we have table view in the report
        // no rows are allowed
        if ( widgetId === 'table-view' ) {
          sw = filter( state.selectedWidgets, w => !startsWith( w, 'table-row' ));
        }

        return {
          ...state,
          selectedWidgets: [ ...sw, widgetId ],
        };
      } else {
        // removing widget
        const index = indexOf( state.selectedWidgets, widgetId );

        if ( index === -1 ) {
          return state;
        } else {
          return {
            ...state,
            selectedWidgets: [
              ...state.selectedWidgets.slice( 0, index ),
              ...state.selectedWidgets.slice( index + 1 ),
            ],
          };
        }
      }
    }

    case DashActionTypes.PrintReport: {
      return {
        ...state,
        isStartPrintReport: false,
        isLoading: true,
      };
    }

    case DashActionTypes.PrintReportSuccess: {
      return {
        ...state,
        selectedWidgets: [],
        isStartPrintReport: false,
        isLoading: false,
      };
    }

    case DashActionTypes.PrintReportFailure: {
      // TODO
      // need to show a message here? Try again?
      return {
        ...state,
        selectedWidgets: [],
        isStartPrintReport: false,
        isLoading: false,
      };
    }

    case DashActionTypes.ExportTableToCsv: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DashActionTypes.ExportTableToCsvSuccess:
    case DashActionTypes.ExportTableToCsvFailure: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default: {
      return state;
    }
  }
}


export const classes = ( state: State ) => state.classes;
export const selectedClass = ( state: State ) => state.selectedClass;
export const selectedTimescale = ( state: State ) => state.selectedTimescale;
export const isDataLoaded = ( state: State ) => state.isDataLoaded;
export const isLoading = ( state: State ) => state.isLoading;
export const isProgTableOpened = ( state: State ) => state.isProgTableOpened;
export const isProgEvaluationOpened = ( state: State ) => state.isProgEvaluationOpened;
export const isStartPrintReport = ( state: State ) => state.isStartPrintReport;
export const selectedRules = ( state: State ) => state.selectedRules;
export const selectedWidgets = ( state: State ) => state.selectedWidgets;
export const userInfo = ( state: State ) => ({ userId: state.userId, areaId: state.areaId });

export const isGeneratePVLiveLinkSuccess = ( state: State ) => state.isGeneratePVLiveLinkSuccess;
export const isGeneratingPVLiveLink = ( state: State ) => state.isGeneratingPVLiveLink;
export const generatedLivePVLink = ( state: State ) => state.generatedLivePVLink;
