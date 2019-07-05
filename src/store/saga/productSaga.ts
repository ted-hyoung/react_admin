// base
import { call, put, takeEvery } from 'redux-saga/effects';

// lib
import * as Api from 'lib/protocols';

// action
import { RequestAsyncAction } from 'types/AsyncAction';
import * as Action from 'store/action/productAction';

// reducer
import { getEventAsync, createProductAsync, updateShippingFeeInfoAsync } from 'store/reducer/product';

function* getEvent(action: RequestAsyncAction) {
  try {
    const eventId  = action.payload;
    const res = yield call(() => Api.get(`/events/${eventId}`));
    yield put(getEventAsync.success(res));
  } catch (error) {
    yield put(getEventAsync.failure(error));
  }
}

function* createProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.post(`/event/${eventId}/product`, data));
    yield put(createProductAsync.success(res.data));
    yield put(getEventAsync.request(eventId));
  } catch (error) {
    yield put(createProductAsync.failure(error));
  }
}

function* updateShippingFeeInfo(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    yield call(() => Api.put(`/events/${eventId}/shipping-fee`, data));
    yield put(updateShippingFeeInfoAsync.success(data));
  } catch (error) {
    yield put(updateShippingFeeInfoAsync.failure(error));
  }
}


export default function* productSaga() {
  yield takeEvery(Action.GET_EVENT_REQUEST, getEvent);
  yield takeEvery(Action.CREATE_PRODUCTS_REQUEST, createProduct);
  yield takeEvery(Action.UPDATE_SHIPPING_FEE_INFO_REQUEST, updateShippingFeeInfo);
}