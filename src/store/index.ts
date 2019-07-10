// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import event, { EventState } from './reducer/event';
import review, { ReviewState } from './reducer/review';
import product, { ProductState } from './reducer/product';

// saga
import eventSaga from './saga/eventSaga';
import reviewSaga from './saga/reviewSaga';
import productSaga from './saga/productSaga';

export interface StoreState {
  event: EventState;
  review: ReviewState;
  product: ProductState;
}

export function* saga() {
  yield all([eventSaga(), reviewSaga(), productSaga()]);
}

const reducer = combineReducers<StoreState>({
  event,
  review,
  product
});

export default reducer;
