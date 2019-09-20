// base
import { call, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'lib/protocols';

// action
import * as Action from 'store/action/orderAction';

// store
import {
  getOrdersAsync,
  updateOrdersPaymentStatusAsync,
  getOrdersExcelAsync,
  getStatisticsDailySalesAsync,
} from 'store/reducer/order';

// modules
import qs from 'qs';

// lib
import { parseParams } from 'lib/utils';

// types
import { RequestAsyncAction } from 'types/AsyncAction';
import { message } from 'antd';

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
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(getOrdersAsync.success(res));
  } catch (error) {
    yield put(getOrdersAsync.failure(error));
  }
}

function* updateOrdersPaymentStatus(action: RequestAsyncAction) {
  try {
    const { paymentId, paymentStatus } = action.payload;
    const data = {
      paymentStatus,
    };

    yield call(() => Api.put(`/payments/${paymentId}/status`, data));
    yield message.success('결제상태가 변경되었습니다.');
    yield;
  } catch (error) {
    yield put(updateOrdersPaymentStatusAsync.failure(error));
    yield message.error('결제상태 변경이 실패하였습니다.');
  }
}

function* getOrdersExcel(action: RequestAsyncAction) {
  try {
    const { lastSearchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/orders/excel', {
        params: {
          ...lastSearchCondition,
        },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    res.data.length === 0 && message.error('엑셀 다운로드 할 주문 관리 데이터가 없습니다.');

    yield put(getOrdersExcelAsync.success(res));
  } catch (error) {
    yield put(getOrdersExcelAsync.failure(error));
  }
}

function* getStatisticsDailySales(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/management/orders/statistics', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    yield put(getStatisticsDailySalesAsync.success(res));
  } catch (error) {
    yield put(getStatisticsDailySalesAsync.failure(error));
    yield message.error(error);
  }
}

export default function* qnaSaga() {
  yield takeEvery(Action.GET_ORDERS_REQUEST, getOrders);
  yield takeEvery(Action.UPDATE_ORDERS_PAYMENT_STATUS_REQUEST, updateOrdersPaymentStatus);
  yield takeEvery(Action.GET_ORDERS_EXCEL_REQUEST, getOrdersExcel);
  yield takeEvery(Action.GET_ORDERS_STATISTICS_DAILY_SALES_REQUEST, getStatisticsDailySales);
}
