import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { environment } from '../../../environments/environment';
import { RouterStateUrl } from '../../utils/router.util';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer,
};

// console.log all actions
export function logger ( reducer: ActionReducer<State> ): ActionReducer<State> {
  return ( state: State, action: any ): any => {
    const result = reducer( state, action );
    console.groupCollapsed( action.type );
    console.log( 'prev state', state );
    console.log( 'action', action );
    console.log( 'next state', result );
    console.groupEnd();

    return result;
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of
 * meta-reducers that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = true
  ? [ logger, storeFreeze ]
  : [];
