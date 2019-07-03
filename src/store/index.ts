// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import qna, { QnaState } from './reducer/qna';

// saga
import qnaSaga from './saga/qnaSaga';

export interface StoreState {
  qna: QnaState;
}

export function* saga() {
  yield all([qnaSaga()]);
}

const reducer = combineReducers<StoreState>({
  qna,
});

export default reducer;
