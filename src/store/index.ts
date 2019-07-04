// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';

// saga
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';

export interface StoreState {
  review: ReviewState;
  contact: ContactState;
}

export function* saga() {
  yield all([reviewSaga(), contactSaga()]);
}

const reducer = combineReducers<StoreState>({
  review,
  contact,
});

export default reducer;
