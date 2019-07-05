// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import review, { ReviewState } from './reducer/review';

// saga
import eventSaga from './saga/eventSaga';
import reviewSaga from './saga/reviewSaga';

export interface StoreState {
  event: EventState;
  review: ReviewState;
}

export function* saga() {
  yield all([eventSaga(), reviewSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  review,
});

export default reducer;
