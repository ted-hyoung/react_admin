// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';

// saga
import eventSaga from './saga/eventSaga';

export interface StoreState {
  event: EventState;
}

export function* saga() {
  yield all([eventSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
});

export default reducer;
