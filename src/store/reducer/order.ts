// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/orderAction';
import { createAsyncAction } from 'typesafe-actions';

// types
import { PageWrapper, ResponseOrder, RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction } from 'types';

export interface OrderState {
  orders: PageWrapper<ResponseOrder>;
  ordersExcel: ResponseOrder[];
}

// 주문 목록 조회
export const getOrdersAsync = createAsyncAction(
  Actions.GET_ORDERS_REQUEST,
  Actions.GET_ORDERS_SUCCESS,
  Actions.GET_ORDERS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 주문 목록 > 결제 상태 변경
export const updateOrdersPaymentStatusAsync = createAsyncAction(
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_REQUEST,
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_SUCCESS,
  Actions.UPDATE_ORDERS_PAYMENT_STATUS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 주문 목록 Excel 다운로드
export const getOrdersExcelAsyc = createAsyncAction(
  Actions.GET_ORDERS_EXCEL_REQUEST,
  Actions.GET_ORDERS_EXCEL_SUCCESS,
  Actions.GET_ORDERS_EXCEL_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: OrderState = {
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
};

const order = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
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
    default: {
      return state;
    }
  }
};

export default order;
