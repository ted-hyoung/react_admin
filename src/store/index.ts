// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import qna, { QnaState } from './reducer/qna';
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';
import product, { ProductState } from './reducer/product';
import order, { OrderState } from './reducer/order';

// saga
import eventSaga from './saga/eventSaga';
import qnaSaga from './saga/qnaSaga';
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';
import productSaga from './saga/productSaga';
import orderSaga from './saga/orderSaga';

export interface StoreState {
  event: EventState;
  qna: QnaState;
  review: ReviewState;
  contact: ContactState;
  product: ProductState;
  order: OrderState;
}

export function* saga() {
  yield all([eventSaga(), qnaSaga(), reviewSaga(), contactSaga(), productSaga(), orderSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  qna,
  review,
  contact,
  product,
  order,
});

export default reducer;
