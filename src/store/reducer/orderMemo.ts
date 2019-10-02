// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/orderMemoAction';
import { createAsyncAction, action } from 'typesafe-actions';

// types
import { ResponseAsyncAction } from 'models';
import { AxiosError } from 'axios';
import { CreateOrderMemo } from 'models/OrderMemo';

export const createOrderMemoAsync = createAsyncAction(
  Actions.CREATE_ORDER_MEMO_REQUEST,
  Actions.CREATE_ORDER_MEMO_SUCCESS,
  Actions.CREATE_ORDER_MEMO_FAILURE,
)<{ orderId: number; createOrderMemo: CreateOrderMemo }, void, AxiosError>();

export interface OrderMemoState {}
 
// reducers
const initialState: OrderMemoState = {};

const orderMemoState = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.CREATE_ORDER_MEMO_SUCCESS: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default orderMemoState;
