// base
import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';

// action
import * as Actions from 'store/action/productAction';

import {
  ResponseProduct,
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction,
  ResponseShippingFeeInfo,
} from 'types';

interface ProductRequestState {
  message: string;
  createProduct?: boolean;
}

// types
export interface ProductState {
  products: ResponseProduct[];
  shippingFeeInfo: ResponseShippingFeeInfo;
  requestState: ProductRequestState;
}

export const createProductAsync = createAsyncAction(
  Actions.CREATE_PRODUCTS_REQUEST,
  Actions.CREATE_PRODUCTS_SUCCESS,
  Actions.CREATE_PRODUCTS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateProductAsync = createAsyncAction(
  Actions.UPDATE_PRODUCTS_REQUEST,
  Actions.UPDATE_PRODUCTS_SUCCESS,
  Actions.UPDATE_PRODUCTS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateShippingFeeInfoAsync = createAsyncAction(
  Actions.UPDATE_SHIPPING_FEE_INFO_REQUEST,
  Actions.UPDATE_SHIPPING_FEE_INFO_SUCCESS,
  Actions.UPDATE_SHIPPING_FEE_INFO_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const deleteProductsAsync = createAsyncAction(
  Actions.DELETED_PRODUCTS_REQUEST,
  Actions.DELETED_PRODUCTS_SUCCESS,
  Actions.DELETED_PRODUCTS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const soldOutProductsAsync = createAsyncAction(
  Actions.SOLD_OUT_PRODUCTS_REQUEST,
  Actions.SOLD_OUT_PRODUCTS_SUCCESS,
  Actions.SOLD_OUT_PRODUCTS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: ProductState = {
  products: [],
  shippingFeeInfo: {
    shippingFee: 0,
    shippingFreeCondition: 0,
  },
  requestState: {
    message: '',
  },
};

const product = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.CREATE_PRODUCTS_SUCCESS:
    case Actions.UPDATE_PRODUCTS_SUCCESS:
    case Actions.DELETED_PRODUCTS_SUCCESS: {
      return state;
    }

    case Actions.UPDATE_SHIPPING_FEE_INFO_SUCCESS: {
      return produce(state, draft => {
        draft.shippingFeeInfo = action.payload.shippingFeeInfo;
      });
    }
    default: {
      return state;
    }
  }
};

export default product;
