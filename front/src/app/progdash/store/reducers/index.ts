import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as rootStore from '../../../store/reducers';
import * as fromDash from './dash.reducers';

export interface State {
  dash: fromDash.State;
}

export const reducers: ActionReducerMap<State> = {
  dash: fromDash.reducers,
};

const _state = createFeatureSelector<State>( 'progdash' );
const _shared = createSelector( _state, ( state: State ) => state.dash );

export const classes = createSelector( _shared, fromDash.classes );
export const selectedClass = createSelector( _shared, fromDash.selectedClass );
export const selectedTimescale = createSelector( _shared, fromDash.selectedTimescale );
export const isDataLoaded = createSelector( _shared, fromDash.isDataLoaded );
export const isLoading = createSelector( _shared, fromDash.isLoading );
export const isProgTableOpened = createSelector( _shared, fromDash.isProgTableOpened );
export const isProgEvaluationOpened = createSelector( _shared, fromDash.isProgEvaluationOpened );
export const isStartPrintReport = createSelector( _shared, fromDash.isStartPrintReport );
export const selectedRules = createSelector( _shared, fromDash.selectedRules );
export const selectedWidgets = createSelector( _shared, fromDash.selectedWidgets );
export const userInfo = createSelector( _shared, fromDash.userInfo );

export const isGeneratingPVLiveLink = createSelector( _shared, fromDash.isGeneratingPVLiveLink );
// tslint:disable-next-line:max-line-length
export const isGeneratePVLiveLinkSuccess = createSelector( _shared, fromDash.isGeneratePVLiveLinkSuccess );
export const generatedLivePVLink = createSelector( _shared, fromDash.generatedLivePVLink );

