// base
import { action, createAsyncAction } from 'typesafe-actions';
import produce from 'immer';
// action
import * as Actions from 'store/action/productAction';

import {
  ResponseProduct,
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction,
  ResponseShippingFeeInfo,
  ResponseManagementProductStatistics, ResponseManagementOrdersStatisticsDailySales, ProductOptions,
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
    // case Actions.STATISTICS_PRODUCTS_SUCCESS: {
    //   return produce(state, draft => {
    //     draft.statistics = action.payload;
    //   });
    // }
    case Actions.STATISTICS_PRODUCTS_SUCCESS: {
      return produce(state, draft => {

       // console.log(action.payload);

        const sampleData = [

          {
            productId: 5,
            name : "비클보습",
            productName: "수분크림 1세트",
            enableOption: false,
            totalSalesAmount: 82000,
            discountSalesPrice: 80500,
            totalSalesQuantity: 2,
            options: []
          },
          {
            productId: 4,
            name : "비클보습",
            productName: "수분크림 2세트",
            enableOption: true,
            totalSalesAmount: 21000,
            discountSalesPrice: 500,
            totalSalesQuantity: 4,
            options: [
              {
                optionName: "수딩젤",
                totalSalesAmount: 21000,
                salesPrice: 20500,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              },
              {
                optionName: "앰플(b. + 토너)",
                totalSalesAmount: 42000,
                salesPrice: 20500,
                totalSalesQuantity: 4,
                salesRatio: 66.67
              },
              {
                optionName: "마스크 팩",
                totalSalesAmount: 21000,
                salesPrice: 20500,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              },
              {
                optionName: "세안제",
                totalSalesAmount: 42000,
                salesPrice: 20500,
                totalSalesQuantity: 4,
                salesRatio: 66.67
              }
            ]
          },
          {
            productId: 3,
            name : "비클보습",
            productName: "수분크림 3세트",
            enableOption: true,
            totalSalesAmount: 0,
            discountSalesPrice: 500,
            totalSalesQuantity: 4,
            options: [
              {
                optionName: "앰플(b. + 토너)",
                totalSalesAmount: 41001,
                salesPrice: 20501,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              },
              {
                optionName: "세안제",
              totalSalesAmount: 82002,
              salesPrice: 20502,
              totalSalesQuantity: 4,
              salesRatio: 66.67
            }
            ]
          },
          {
            productId: 2,
            name : "비클보습",
            productName: "T-ac 수딩젤",
            enableOption: true,
            totalSalesAmount: 0,
            discountSalesPrice: 500,
            totalSalesQuantity: 4,
            options: [
              {
                optionName: "앰플(b. + 토너)",
              totalSalesAmount: 82000,
              salesPrice: 20500,
              totalSalesQuantity: 4,
              salesRatio: 66.67
            },
              {
                optionName: "마스크 팩",
                totalSalesAmount: 41000,
                salesPrice: 20500,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              }
            ]
          },
          {
            productId: 1,
            name : "비클보습",
            productName: "T-ac 수딩젤 2세트",
            enableOption: true,
            totalSalesAmount: 1500,
            discountSalesPrice: 500,
            totalSalesQuantity: 3,
            options: [ {
              optionName: "앰플(b. + 토너)",
              totalSalesAmount: 82000,
              salesPrice: 20500,
              totalSalesQuantity: 4,
              salesRatio: 66.67
            },
              {
                optionName: "마스크 팩",
                totalSalesAmount: 41000,
                salesPrice: 20500,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              },
              {
                optionName: "세안제",
                totalSalesAmount: 21000,
                salesPrice: 20500,
                totalSalesQuantity: 2,
                salesRatio: 33.33
              }]
          }
        ];

        draft.statistics.productSales = sampleData;
        draft.statistics.productSalesStatus = true;
        // draft.statistics = action.payload;
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

    default: {
      return state;
    }
  }
};

export default product;
