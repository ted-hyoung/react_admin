// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/shippingAction';
import { createAsyncAction } from 'typesafe-actions';

// types
import { ResponseAsyncAction, PageWrapper, RequestAsyncAction, ErrorAsyncAction } from 'types';
import { ResponseShipping } from 'types/Shipping';

// types
export interface ShippingState {
  shipping: PageWrapper<ResponseShipping>;
}

export const getShippingAsync = createAsyncAction(
  Actions.GET_SHIPPING_REQUEST,
  Actions.GET_SHIPPING_SUCCESS,
  Actions.GET_SHIPPING_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

const initialState: ShippingState = {
  shipping: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
};

const shipping = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_SHIPPING_SUCCESS: {
      return produce(state, draft => {
        // const { page, content, last, totalElements } = action.payload;
        draft.shipping = action.payload;
      });
    }
    default:
      return state;
  }
};

export default shipping;
