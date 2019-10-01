// base
import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { all } from 'redux-saga/effects';
import { History } from 'history';

// reducer
import event, { EventState } from './reducer/event';
import qna, { QnaState } from './reducer/qna';
import review, { ReviewState } from './reducer/review';
import contact, { ContactState } from './reducer/contact';
import celebReview, { CelebReviewState } from './reducer/celebReview';
import product, { ProductState } from './reducer/product';
import order, { OrderState } from './reducer/order';
import orderMemoState, { OrderMemoState } from './reducer/orderMemo';
import shipping, { ShippingState } from './reducer/shipping';
import brand, { BrandState } from './reducer/brand';

// saga
import eventSaga from './saga/eventSaga';
import qnaSaga from './saga/qnaSaga';
import reviewSaga from './saga/reviewSaga';
import contactSaga from './saga/contactSaga';
import celebReviewSaga from './saga/celebReviewSaga';
import productSaga from './saga/productSaga';
import orderSaga from './saga/orderSaga';
import orderMemoSaga from './saga/orderMemoSaga';
import shippingSaga from './saga/shippingSaga';
import brandSaga from './saga/brandSaga';

export interface StoreState {
  router: RouterState;
  event: EventState;
  qna: QnaState;
  review: ReviewState;
  contact: ContactState;
  product: ProductState;
  celebReview: CelebReviewState;
  order: OrderState;
  orderMemoState: OrderMemoState;
  shipping: ShippingState;
  brand: BrandState;
}

export function* saga() {
  yield all([
    eventSaga(),
    qnaSaga(),
    reviewSaga(),
    contactSaga(),
    productSaga(),
    celebReviewSaga(),
    orderSaga(),
    orderMemoSaga(),
    shippingSaga(),
    brandSaga(),
  ]);
}

const reducer = (history: History) =>
  combineReducers<StoreState>({
    router: connectRouter(history),
    event,
    qna,
    review,
    contact,
    product,
    celebReview,
    order,
    orderMemoState,
    shipping,
    brand,
  });

export default reducer;
