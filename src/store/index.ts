// base
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// reducer
import product, { ProductState } from './reducer/product';

// saga
import productSaga from './saga/productSaga';

export interface StoreState {
  product: ProductState;
}

export function* saga() {
  yield all([productSaga()])
}

const reducer = combineReducers<StoreState>({
  product
});

export default reducer;
