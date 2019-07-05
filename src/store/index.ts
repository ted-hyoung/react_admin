// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import qna, { QnaState } from './reducer/qna';

// saga
import eventSaga from './saga/eventSaga';
import qnaSaga from './saga/qnaSaga';

export interface StoreState {
  event: EventState;
  qna: QnaState;
}

export function* saga() {
  yield all([eventSaga(), qnaSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  qna,
});

export default reducer;
