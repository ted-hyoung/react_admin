// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/orderAction';
import { createAsyncAction } from 'typesafe-actions';

// types
import { PageWrapper, ResponseOrder, RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction } from 'types';

export interface OrderState {
  orders: PageWrapper<ResponseOrder>;
}

// 주문 목록 조회
export const getOrdersAsync = createAsyncAction(
  Actions.GET_ORDERS_REQUEST,
  Actions.GET_ORDERS_SUCCESS,
  Actions.GET_ORDERS_FAILURE,
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
};

const order = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_ORDERS_SUCCESS: {
      return produce(state, draft => {
        draft.orders = action.payload.data;
      });
    }
    default: {
      return state;
    }
  }
};

export default order;
