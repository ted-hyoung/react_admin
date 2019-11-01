// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Api from 'lib/protocols';

// action
import * as Action from 'store/action/orderAction';

// store
import {
  getOrdersAsync,
  updateOrdersPaymentStatusAsync,
  getOrdersExcelAsync,
  getStatisticsDailySalesAsync,
  getOrderByIdAsync,
  updateShippingDestinationByIdAsync,
  cancelPaymentVirtualAccountAsync, cancelPaymentAsync, checkRefundAccountAsync, cancelVirtualAccountWaitingAsync,
} from 'store/reducer/order';

// modules
import qs from 'qs';

// lib
import { parseParams } from 'lib/utils';

// types
import { RequestAsyncAction } from 'models/AsyncAction';
import { message } from 'antd';
import { getBrandsAsync } from '../reducer/brand';

function* getOrderById(action: RequestAsyncAction) {
  try {
    const { id } = action.payload;

    const res = yield call(() => Api.get(`/orders/${id}`));
    yield put(getOrderByIdAsync.success(res.data));
  } catch (error) {
    yield put(getOrderByIdAsync.failure(error));
  }
}

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

    if (res.data.length === 0) {
      message.error('엑셀 다운로드 할 주문 관리 데이터가 없습니다.');

      return;
    }

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

function* updateShippingDestinationById(action: RequestAsyncAction) {
  const { orderId, updateOrderShippingDestination } = action.payload;

  try {
    const res = yield call(() => Api.put(`/orders/${orderId}/shipping-destination`, updateOrderShippingDestination));

    yield put(updateShippingDestinationByIdAsync.success(res.data));
    yield put(getOrderByIdAsync.request({ id: orderId }));
  } catch (error) {
    yield put(updateShippingDestinationByIdAsync.failure(error));
  }
}

// ### 관리자 주문 환불 처리 (가상계좌) -> 관리자 단에서 취소하는 Case (결제 완료)
function* cancelPaymentVirtualAccount(action: RequestAsyncAction) {
  const { orderNo, data  } = action.payload;
  try {
    const res = yield call(() => Api.put(`/orders/${orderNo}/cancel/virtual-account`,data));
    yield put(cancelPaymentVirtualAccountAsync.success(orderNo));
  } catch (error) {
    yield put(cancelPaymentVirtualAccountAsync.failure(error));
  }
}
// ### 관리자 주문 취소 처리 (카드, 계좌이체) -> 관리자 단에서 취소하는 Case (결제 완료)
function* cancelPayment(action: RequestAsyncAction) {
  const { orderNo, totalAmount  } = action.payload;
  try {
    const res = yield call(() => Api.put(`/orders/${orderNo}/cancel`,{totalAmount}));
    yield put(cancelPaymentAsync.success(orderNo));
  } catch (error) {
    yield put(cancelPaymentAsync.failure(error));
  }
}

// 가상 계좌 결제 환불시 환불 계좌 정보 확인
function* getCheckRefundAccount(action: RequestAsyncAction) {
  try {
    const { data } = action.payload;
    const res = yield call(() =>
      Api.get('/payments/refund/account/validate', {
        params: {
          ...data,
        },
      }),
    );
    yield put(checkRefundAccountAsync.success(res.data));
  } catch (error) {
    yield put(checkRefundAccountAsync.failure(error));
    yield message.error(error);
  }
}

function* cancelVirtualAccountWaiting(action: RequestAsyncAction) {
  try {
    const { orderNo, totalAmount } = action.payload;
    const res = yield call(() => Api.put(`/orders/${orderNo}/cancel/virtual-account/waiting`,{totalAmount}));
    yield put(cancelVirtualAccountWaitingAsync.success(orderNo));
  } catch (error) {
    yield put(cancelVirtualAccountWaitingAsync.failure(error));
    yield message.error(error);
  }
}

export default function* orderSaga() {
  yield takeEvery(Action.GET_ORDER_BY_ID_REQUEST, getOrderById);
  yield takeEvery(Action.GET_ORDERS_REQUEST, getOrders);
  yield takeEvery(Action.GET_ORDERS_EXCEL_REQUEST, getOrdersExcel);
  yield takeEvery(Action.GET_ORDERS_STATISTICS_DAILY_SALES_REQUEST, getStatisticsDailySales);
  yield takeLatest(Action.UPDATE_ORDERS_PAYMENT_STATUS_REQUEST, updateOrdersPaymentStatus);
  yield takeLatest(Action.UPDATE_SHIPPING_DESTINATION_BY_ID_REQUEST, updateShippingDestinationById);
  yield takeLatest(Action.CANCEL_PAYMENT_VIRTUAL_ACCOUNT_REQUEST, cancelPaymentVirtualAccount);
  yield takeLatest(Action.CANCEL_PAYMENT_REQUEST, cancelPayment);
  yield takeLatest(Action.CHECK_REFUND_ACCOUNT_REQUEST, getCheckRefundAccount);
  yield takeLatest(Action.CANCEL_VIRTUAL_ACCOUNT_WAITING_REQUEST, cancelVirtualAccountWaiting);

}
