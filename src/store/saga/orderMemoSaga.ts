// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Api from 'lib/protocols';

// action
import * as Actions from 'store/action/orderMemoAction';

// store
import { createOrderMemoAsync } from 'store/reducer/orderMemo';

// modules
import qs from 'qs';

// lib
import { parseParams } from 'lib/utils';

// types
import { RequestAsyncAction } from 'models/AsyncAction';
import { message } from 'antd';
import { getOrderByIdAsync } from 'store/reducer/order';

function* createOrderMemo(action: RequestAsyncAction) {
  const { orderId, createOrderMemo } = action.payload;

  try {
    const res = yield call(() => Api.post(`/orders/${orderId}/memo`, createOrderMemo));

    yield put(createOrderMemoAsync.success(res.data));
    yield put(getOrderByIdAsync.request({ id: orderId }));
  } catch (error) {
    yield put(createOrderMemoAsync.failure(error));
  }
}

export default function* orderMemoSaga() {
  yield takeLatest(Actions.CREATE_ORDER_MEMO_REQUEST, createOrderMemo);
}
