// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import review, { ReviewState } from './reducer/review';
import event, { EventState } from './reducer/event';
import contact, { ContactState } from './reducer/contact';

// saga
import reviewSaga from './saga/reviewSaga';
import eventSaga from './saga/eventSaga';
import contactSaga from './saga/contactSaga';

export interface StoreState {
  review: ReviewState;
  event: EventState;
  contact: ContactState;
}

export function* saga() {
  yield all([reviewSaga(), eventSaga(), contactSaga()]);
}

const reducer = combineReducers<StoreState>({
  review,
  event,
  contact,
});

export default reducer;
