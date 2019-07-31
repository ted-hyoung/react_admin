// base
import { call, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'lib/protocols';

// action
import * as Action from 'store/action/orderAction';

// store
import { getOrdersAsync, getOrdersExcelAsyc } from 'store/reducer/order';

// lib
import { parseParams } from 'lib/utils';

// types
import { RequestAsyncAction } from 'types/AsyncAction';

function* getOrders(action: RequestAsyncAction) {
  try {
    const { page, size, searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/orders', {
        params: {
          page,
          size,
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    yield put(getOrdersAsync.success(res));
    yield put(getOrdersExcelAsyc.request({ searchCondition }));
  } catch (error) {
    yield put(getOrdersAsync.failure(error));
  }
}

function* getOrdersExcel(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/orders/excel', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    yield put(getOrdersExcelAsyc.success(res));
  } catch (error) {
    yield put(getOrdersExcelAsyc.failure(error));
  }
}

export default function* qnaSaga() {
  yield takeEvery(Action.GET_ORDERS_REQUEST, getOrders);
  yield takeEvery(Action.GET_ORDERS_EXCEL_REQUEST, getOrdersExcel);
}
