// base
import { createAsyncAction, action } from 'typesafe-actions';
import produce from 'immer';
// action
import * as Actions from 'store/action/productAction';

import {
  ResponseProduct,
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction,
  ResponseShippingFeeInfo,
  ResponseManagementProductStatistics, ProductOptions,
} from 'models';

interface ProductRequestState {
  message: string;
  createProduct?: boolean;
}

// types
export interface ProductState {
  productNotice: object[];
  products: ResponseProduct[];
  shippingFeeInfo: ResponseShippingFeeInfo;
  requestState: ProductRequestState;
  productsExcel: ResponseManagementProductStatistics[];
  statistics: {
    productSales: ResponseManagementProductStatistics[];
    productSalesStatus: boolean;
  }
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

export const statisticsProductSalesAsync = createAsyncAction(
  Actions.STATISTICS_PRODUCTS_REQUEST,
  Actions.STATISTICS_PRODUCTS_SUCCESS,
  Actions.STATISTICS_PRODUCTS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const clearProductSalesStatus = action(Actions.CLEAR_PRODUCT_SALES_STATUS);

export const statisticsProductExcelAsync = createAsyncAction(
  Actions.STATISTICS_PRODUCTS_EXCEL_REQUEST,
  Actions.STATISTICS_PRODUCTS_EXCEL_SUCCESS,
  Actions.STATISTICS_PRODUCTS_EXCEL_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const clearProductExcelStatus = action(Actions.CLEAR_PRODUCT_SALES_EXCEL_STATUS);

export const createProductNoticeAsync = createAsyncAction(
  Actions.CREATE_PRODUCT_NOTICE_REQUEST,
  Actions.CREATE_PRODUCT_NOTICE_SUCCESS,
  Actions.CREATE_PRODUCT_NOTICE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateProductNoticeAsync = createAsyncAction(
  Actions.UPDATE_PRODUCT_NOTICE_REQUEST,
  Actions.UPDATE_PRODUCT_NOTICE_SUCCESS,
  Actions.UPDATE_PRODUCT_NOTICE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const deleteProductNoticeAsync = createAsyncAction(
  Actions.DELETED_PRODUCT_NOTICE_REQUEST,
  Actions.DELETED_PRODUCT_NOTICE_SUCCESS,
  Actions.DELETED_PRODUCT_NOTICE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: ProductState = {
  productNotice:[],
  products: [],
  shippingFeeInfo: {
    shippingFee: 0,
    shippingFreeCondition: 0,
  },
  requestState: {
    message: '',
  },

  productsExcel: [],
  statistics: {
    productSales: [],
    productSalesStatus: false,
  }
};

const product = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.CREATE_PRODUCTS_SUCCESS:
    case Actions.UPDATE_PRODUCTS_SUCCESS:
    case Actions.DELETED_PRODUCTS_SUCCESS: {
      return state;
    }

    case Actions.STATISTICS_PRODUCTS_SUCCESS: {
      return produce(state, draft => {
        draft.statistics.productSalesStatus = true;
        draft.statistics.productSales = action.payload;
      });
    }

    case Actions.STATISTICS_PRODUCTS_EXCEL_SUCCESS: {
      return produce(state, draft => {
        draft.productsExcel = action.payload;
      });
    }

    case Actions.CLEAR_PRODUCT_SALES_STATUS: {
      return produce(state, draft => {
        draft.statistics.productSalesStatus = false;
      });
    }

    case Actions.CLEAR_PRODUCT_SALES_EXCEL_STATUS: {
      return produce(state, draft => {
        draft.productsExcel = [];
      });
    }

    case Actions.CREATE_PRODUCT_NOTICE_SUCCESS: {
      return state;
    }

    case Actions.UPDATE_PRODUCT_NOTICE_SUCCESS: {
      return state;
    }

    default: {
      return state;
    }
  }
};

export default product;
