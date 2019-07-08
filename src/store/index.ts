// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';

// saga
import eventSaga from './saga/eventSaga';
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';

export interface StoreState {
  event: EventState;
  review: ReviewState;
  contact: ContactState;
}

export function* saga() {
  yield all([eventSaga(), reviewSaga(), contactSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  review,
  contact,
});

export default reducer;
