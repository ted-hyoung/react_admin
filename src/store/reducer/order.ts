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

export interface OrderState {
  order: ResponseClientOrder;
  orders: PageWrapper<ResponseOrder>;
  ordersExcel: ResponseOrder[];
  statistics: {
    dailySales: ResponseManagementOrdersStatisticsDailySales;
    dailySalesStatus: boolean;
  };
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
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: OrderState = {
  order: {
    orderId: 0,
    orderNo: '',
    orderItems: [],
    orderMemos: [],
    memo: '',
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
      return state;
    }
    default: {
      return state;
    }
  }
};

export default order;
