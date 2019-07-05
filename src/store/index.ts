// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import qna, { QnaState } from './reducer/qna';
import review, { ReviewState } from './reducer/review';

// saga
import eventSaga from './saga/eventSaga';
import qnaSaga from './saga/qnaSaga';
import reviewSaga from './saga/reviewSaga';

export interface StoreState {
  event: EventState;
  qna: QnaState;
  review: ReviewState;
}

export function* saga() {
  yield all([eventSaga(), qnaSaga(), reviewSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  qna,
  review,
});

export default reducer;
