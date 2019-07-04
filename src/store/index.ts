// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import review, { ReviewState } from './reducer/review';

// saga
import reviewSaga from './saga/reviewSaga';
export interface StoreState {
  review: ReviewState;
}

export function* saga() {
  yield all([reviewSaga()]);
}

const reducer = combineReducers<StoreState>({
  review,
});

export default reducer;
