// base
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';

// types
import { RequestAsyncAction } from 'types/AsyncAction';

// lib
import * as Api from 'lib/protocols';
import { parseParams } from 'lib/utils';

// modules
import { Modal, message } from 'antd';

// store
import * as Action from 'store/action/shippingAction';
import {
  getShippingAsync,
  updateShippingAsync,
  updateShippingStatusAsync,
  getShippingExcelAsync,
} from 'store/reducer/shipping';

function* getShipping(action: RequestAsyncAction) {
  try {
    const { page, size, searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/shipping', {
        params: {
          page,
          size,
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );

    yield put(getShippingAsync.success(res.data));
    yield put(getShippingExcelAsync.request({ searchCondition }));
  } catch (error) {
    yield put(getShippingAsync.failure(error));
  }
}

function* getShippingExcel(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/shipping/excel', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );

    yield put(getShippingExcelAsync.success(res.data));
  } catch (error) {
    yield put(getShippingExcelAsync.failure(error));
  }
}

function* updateShipping(action: RequestAsyncAction) {
  try {
    const { shippingId, invoice } = action.payload;
    const data = {
      invoice,
    };

    yield call(() => Api.put(`/shipping/${shippingId}`, data));
    yield put(updateShippingAsync.success(action.payload));
  } catch (error) {
    yield put(updateShippingAsync.failure(error));
    Modal.error({ title: error });
  }
}

function* updateShippingStatus(action: RequestAsyncAction) {
  try {
    const { shippingId, shippingStatus } = action.payload;
    const data = {
      shippingStatus,
    };

    yield call(() => Api.put(`/shipping/${shippingId}/status`, data));
    yield message.success('배송상태가 변경되었습니다.');
  } catch (error) {
    yield put(updateShippingStatusAsync.failure(error));
    yield message.success('배송상태 변경이 실패하였습니다.');
  }
}

export default function* qnaSaga() {
  yield takeEvery(Action.GET_SHIPPING_REQUEST, getShipping);
  yield takeEvery(Action.UPDATE_SHIPPING_REQUEST, updateShipping);
  yield takeEvery(Action.UPDATE_SHIPPING_STATUS_REQUEST, updateShippingStatus);
  yield takeEvery(Action.GET_SHIPPING_EXCEL_REQUEST, getShippingExcel);
}
