// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import qna, { QnaState } from './reducer/qna';
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';
import celebReview, { CelebReviewState } from './reducer/celebReview';
import product, { ProductState } from './reducer/product';

// saga
import eventSaga from './saga/eventSaga';
import qnaSaga from './saga/qnaSaga';
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';
import celebReviewSaga from './saga/celebReviewSaga';
import productSaga from './saga/productSaga';

export interface StoreState {
  event: EventState;
  qna: QnaState;
  review: ReviewState;
  contact: ContactState;
  product: ProductState;
  celebReview: CelebReviewState;
}

export function* saga() {
  yield all([eventSaga(), qnaSaga(), reviewSaga(), contactSaga(), productSaga(), , celebReviewSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  qna,
  review,
  contact,
  celebReview,
  product,
});

export default reducer;
