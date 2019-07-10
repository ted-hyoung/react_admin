// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';
import celebReview, { CelebReviewState } from './reducer/celebReview';

// saga
import eventSaga from './saga/eventSaga';
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';
import celebReviewSaga from './saga/celebReviewSaga';

export interface StoreState {
  event: EventState;
  review: ReviewState;
  contact: ContactState;
  celebReview: CelebReviewState;
}

export function* saga() {
  yield all([eventSaga(), reviewSaga(), contactSaga(), celebReviewSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  review,
  contact,
  celebReview,
});

export default reducer;
