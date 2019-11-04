// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/orderAction';
import { createAsyncAction, action } from 'typesafe-actions';

// types
import {
  PageWrapper,
  ResponseOrder,
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction,
  ResponseManagementOrdersStatisticsDailySales,
  ResponseManagementOrdersDailySalesTable,
  ResponseClientOrder,
  UpdateOrderShippingDestination,
} from 'models';
import { AxiosError } from 'axios';
import { PaymentStatus } from '../../enums';

export interface OrderState {
  order: ResponseClientOrder;
  orders: PageWrapper<ResponseOrder>;
  ordersExcel: ResponseOrder[];
  statistics: {
    dailySales: ResponseManagementOrdersStatisticsDailySales;
    dailySalesStatus: boolean;
  };
  refundAccountState: boolean;
}

// 주문 목록 조회
export const getOrdersAsync = createAsyncAction(
  Actions.GET_ORDERS_REQUEST,
  Actions.GET_ORDERS_SUCCESS,
  Actions.GET_ORDERS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 주문 목록 Excel 다운로드
export const getOrdersExcelAsync = createAsyncAction(
  Actions.GET_ORDERS_EXCEL_REQUEST,
  Actions.GET_ORDERS_EXCEL_SUCCESS,
  Actions.GET_ORDERS_EXCEL_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 일일 매출 통계
export const getStatisticsDailySalesAsync = createAsyncAction(
  Actions.GET_ORDERS_STATISTICS_DAILY_SALES_REQUEST,
  Actions.GET_ORDERS_STATISTICS_DAILY_SALES_SUCCESS,
  Actions.GET_ORDERS_STATISTICS_DAILY_SALES_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 주문 상세 조회
export const getOrderByIdAsync = createAsyncAction(
  Actions.GET_ORDER_BY_ID_REQUEST,
  Actions.GET_ORDER_BY_ID_SUCCESS,
  Actions.GET_ORDER_BY_ID_FAILURE,
)<{ id: number }, void, AxiosError>();

// 주문 목록 > 결제 상태 변경
export const updateOrdersPaymentStatusAsync = createAsyncAction(
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_REQUEST,
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_SUCCESS,
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 해당 주문 건 배송지 정보 변경
export const updateShippingDestinationByIdAsync = createAsyncAction(
  Actions.UPDATE_SHIPPING_DESTINATION_BY_ID_REQUEST,
  Actions.UPDATE_SHIPPING_DESTINATION_BY_ID_SUCCESS,
  Actions.UPDATE_SHIPPING_DESTINATION_BY_ID_FAILURE,
)<{ orderId: number; updateOrderShippingDestination: UpdateOrderShippingDestination }, void, AxiosError>();

export const clearDailySalesStatus = action(Actions.CLEAR_DAILY_SALES_STATUS);
export const clearOrderExcel = action(Actions.CLEAR_ORDER_EXCEL);
export const clearOrder = action(Actions.CLEAR_ORDER);

// 가상 계좌 주문 건 취소
export const cancelPaymentVirtualAccountAsync = createAsyncAction(
  Actions.CANCEL_PAYMENT_VIRTUAL_ACCOUNT_REQUEST,
  Actions.CANCEL_PAYMENT_VIRTUAL_ACCOUNT_SUCCESS,
  Actions.CANCEL_PAYMENT_VIRTUAL_ACCOUNT_FAILURE,
)<RequestAsyncAction, {id:number}, ErrorAsyncAction>();

// 결제 주문 건 취소 (카드, 실시간 계좌이체)
export const cancelPaymentAsync = createAsyncAction(
  Actions.CANCEL_PAYMENT_REQUEST,
  Actions.CANCEL_PAYMENT_SUCCESS,
  Actions.CANCEL_PAYMENT_FAILURE,
)<RequestAsyncAction, {id:number}, ErrorAsyncAction>();

export const checkRefundAccountAsync = createAsyncAction(
  Actions.CHECK_REFUND_ACCOUNT_REQUEST,
  Actions.CHECK_REFUND_ACCOUNT_SUCCESS,
  Actions.CHECK_REFUND_ACCOUNT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const resetRefundAccountStateReducer = () => action(Actions.RESET_REFUND_ACCOUNT_STATE_REDUCER);

export const cancelVirtualAccountWaitingAsync = createAsyncAction(
  Actions.CANCEL_VIRTUAL_ACCOUNT_WAITING_REQUEST,
  Actions.CANCEL_VIRTUAL_ACCOUNT_WAITING_SUCCESS,
  Actions.CANCEL_VIRTUAL_ACCOUNT_WAITING_FAILURE,
)<RequestAsyncAction, {orderNo:number}, ErrorAsyncAction>();


// reducers
const initialState: OrderState = {
  order: {
    orderId: 0,
    orderNo: '',
    orderItems: [],
    orderMemos: [],
    memo: '',
    created: '',
  },
  orders: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  ordersExcel: [],
  statistics: {
    dailySales: {
      ordersTable: [
        {
          totalSalesAmount: 0,
          totalSalesCount: 0,
          totalOrderCompleteAmount: 0,
          totalOrderCompleteCount: 0,
          totalOrderCancelAmount: 0,
          totalOrderCancelCount: 0,
        },
      ],
      ordersCharts: [],
      orders: [],
    },
    dailySalesStatus: false,
  },
  refundAccountState: false,
};

const order = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_ORDER_BY_ID_SUCCESS: {
      return produce(state, draft => {
        draft.order = action.payload;
      });
    }
    case Actions.GET_ORDERS_SUCCESS: {
      return produce(state, draft => {
        draft.orders = action.payload.data;
      });
    }
    case Actions.GET_ORDERS_EXCEL_SUCCESS: {
      return produce(state, draft => {
        draft.ordersExcel = action.payload.data;
      });
    }
    case Actions.GET_ORDERS_STATISTICS_DAILY_SALES_SUCCESS: {
      return produce(state, draft => {
        const ordersTable: ResponseManagementOrdersDailySalesTable[] = [];
        ordersTable.push({
          totalSalesAmount: action.payload.data.totalSalesAmount,
          totalSalesCount: action.payload.data.totalSalesCount,
          totalOrderCompleteAmount: action.payload.data.totalOrderCompleteAmount,
          totalOrderCompleteCount: action.payload.data.totalOrderCompleteCount,
          totalOrderCancelAmount: action.payload.data.totalOrderCancelAmount,
          totalOrderCancelCount: action.payload.data.totalOrderCancelCount,
        });
        draft.statistics.dailySales.ordersTable = ordersTable;
        draft.statistics.dailySales.ordersCharts = action.payload.data.ordersCharts;
        draft.statistics.dailySales.orders = action.payload.data.orders;
        draft.statistics.dailySalesStatus = true;
      });
    }
    case Actions.UPDATE_SHIPPING_DESTINATION_BY_ID_SUCCESS: {
      return state;
    }
    case Actions.CLEAR_DAILY_SALES_STATUS: {
      return produce(state, draft => {
        draft.statistics.dailySalesStatus = false;
      });
    }
    case Actions.CLEAR_ORDER_EXCEL: {
      return produce(state, draft => {
        draft.ordersExcel = [];
      });
    }
    case Actions.CLEAR_ORDER: {
      return produce(state, draft => {
        draft.order = initialState.order;
      });
    }
    case Actions.CANCEL_PAYMENT_VIRTUAL_ACCOUNT_SUCCESS:{
      return produce(state, draft => {
        const item = draft.orders.content.find(item => item.orderNo === action.payload);

        if (item) {
          item.payment.paymentStatus = PaymentStatus[PaymentStatus.REFUND_COMPLETE];
        }
      });
    }
    case Actions.CANCEL_PAYMENT_SUCCESS:{
      return produce(state, draft => {
        const item = draft.orders.content.find(item => item.orderNo === action.payload);

        if (item) {
          item.payment.paymentStatus = PaymentStatus[PaymentStatus.REFUND_COMPLETE];
        }
      });
    }
    case Actions.CANCEL_VIRTUAL_ACCOUNT_WAITING_SUCCESS:{
      return produce(state, draft => {
        const item = draft.orders.content.find(item => item.orderNo === action.payload);

        if (item) {
          item.payment.paymentStatus = PaymentStatus[PaymentStatus.CANCEL];
        }
      });
    }

    case Actions.CHECK_REFUND_ACCOUNT_SUCCESS: {
      return produce(state, draft => {
        draft.refundAccountState = action.payload;
      });
    }

    case Actions.RESET_REFUND_ACCOUNT_STATE_REDUCER: {
      return produce(state, draft => {
        draft.refundAccountState = false;
      });
    }
    default: {
      return state;
    }
  }
};

export default order;
