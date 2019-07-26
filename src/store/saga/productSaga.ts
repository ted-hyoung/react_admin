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
  updateProductAsync,
  deleteProductsAsync,
  soldOutProductsAsync,
} from 'store/reducer/product';
import { getEventByIdAsync } from 'store/reducer/event';
import { message } from 'antd';

function* createProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.post(`/events/${eventId}/product`, data));
    yield put(createProductAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('제품 정보를 등록하였습니다.');
  } catch (error) {
    yield put(createProductAsync.failure(error));
    message.error('제품 정보 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* updateProduct(action: RequestAsyncAction) {
  try {
    const { eventId, productId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/${productId}`, data));
    yield put(updateProductAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('제품 정보를 수정했습니다.');
  } catch (error) {
    yield put(updateProductAsync.failure(error));
    message.error('제품 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* deleteProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.del(`/events/${eventId}/products`, {data}));
    yield put(deleteProductsAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('해당 제품을 삭제했습니다.');
  } catch (error) {
    yield put(deleteProductsAsync.failure(error));
    message.error('해당 제품 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* soldOutProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/sold-out`, data));
    yield put(soldOutProductsAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('해당 제품을 품절처리 또는 품절해제를처리하였습니다.');
  } catch (error) {
    yield put(soldOutProductsAsync.failure(error));
    message.error('해당 제품을 품절처리 또는 품절해제를 실패하였습니다.');
  }
}

export default function* productSaga() {
  yield takeEvery(Action.CREATE_PRODUCTS_REQUEST, createProduct);
  yield takeEvery(Action.UPDATE_PRODUCTS_REQUEST, updateProduct);
  yield takeEvery(Action.DELETED_PRODUCTS_REQUEST, deleteProduct);
  yield takeEvery(Action.SOLD_OUT_PRODUCTS_REQUEST, soldOutProduct);
}
