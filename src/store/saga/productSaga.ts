// base
import { call, put, takeEvery } from 'redux-saga/effects';
import { replace } from 'connected-react-router';

// lib
import * as Api from 'lib/protocols';

// action
import { RequestAsyncAction } from 'types/AsyncAction';
import * as Action from 'store/action/productAction';

// reducer
import {
  createProductAsync,
  updateShippingFeeInfoAsync,
  updateProductAsync,
  deleteProductsAsync,
  soldOutProductsAsync,
} from 'store/reducer/product';

function* createProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.post(`/events/${eventId}/product`, data));
    yield put(createProductAsync.success(res.data));
    yield put(replace('/events/detail/' + eventId));
  } catch (error) {
    yield put(createProductAsync.failure(error));
  }
}

function* updateProduct(action: RequestAsyncAction) {
  try {
    const { eventId, productId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/${productId}`, data));
    yield put(updateProductAsync.success(res.data));
    yield put(replace('/events/detail/' + eventId));
  } catch (error) {
    yield put(updateProductAsync.failure(error));
  }
}

function* deleteProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/disabled`, data));
    yield put(deleteProductsAsync.success(res.data));
    yield put(replace('/events/detail/' + eventId));
  } catch (error) {
    yield put(deleteProductsAsync.failure(error));
  }
}

function* soldOutProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/sold-out`, data));
    yield put(soldOutProductsAsync.success(res.data));
    yield put(replace('/events/detail/' + eventId));
  } catch (error) {
    yield put(soldOutProductsAsync.failure(error));
  }
}

function* updateShippingFeeInfo(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    yield call(() => Api.put(`/events/${eventId}/shipping-fee`, data));
    yield put(updateShippingFeeInfoAsync.success(data));
    yield put(replace('/events/detail/' + eventId));
  } catch (error) {
    yield put(updateShippingFeeInfoAsync.failure(error));
  }
}

export default function* productSaga() {
  yield takeEvery(Action.CREATE_PRODUCTS_REQUEST, createProduct);
  yield takeEvery(Action.UPDATE_PRODUCTS_REQUEST, updateProduct);
  yield takeEvery(Action.UPDATE_SHIPPING_FEE_INFO_REQUEST, updateShippingFeeInfo);
  yield takeEvery(Action.DELETED_PRODUCTS_REQUEST, deleteProduct);
  yield takeEvery(Action.SOLD_OUT_PRODUCTS_REQUEST, soldOutProduct);
}
