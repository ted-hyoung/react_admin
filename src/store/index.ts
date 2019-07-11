// base
import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { all } from 'redux-saga/effects';
import { History } from 'history';

// reducer
import event, { EventState } from './reducer/event';
import review, { ReviewState } from './reducer/review';
import product, { ProductState } from './reducer/product';

// saga
import eventSaga from './saga/eventSaga';
import reviewSaga from './saga/reviewSaga';
import productSaga from './saga/productSaga';

export interface StoreState {
  router: RouterState;
  event: EventState;
  review: ReviewState;
  product: ProductState;
}

export function* saga() {
  yield all([eventSaga(), reviewSaga(), productSaga()]);
}

const reducer = (history: History) =>
  combineReducers<StoreState>({
    router: connectRouter(history),
    event,
    review,
    product,
  });

export default reducer;
