// base
import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';

// action
import * as Actions from 'store/action/brandAction';

// types
import {
  ErrorAsyncAction,
  RequestAsyncAction,
  ResponseAsyncAction,
  ResponseBrandForEvent,
  ResponseManagementBrandStatistics,
} from 'types';

export interface BrandState {
  brand: ResponseBrandForEvent[];
  brandSalesStatistics : ResponseManagementBrandStatistics[];
}

export const getBrandsAsync = createAsyncAction(
  Actions.GET_EVENT_BRANDS_REQUEST,
  Actions.GET_EVENT_BRANDS_SUCCESS,
  Actions.GET_EVENT_BRANDS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 브랜드 매출 통계
export const getStatisticsBrancSalesAsync = createAsyncAction(
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_REQUEST,
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_SUCCESS,
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: BrandState = {
  brand: [],
  brandSalesStatistics:[]
};

const brand = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_EVENT_BRANDS_SUCCESS: {
      return produce(state, draft => {
        draft.brand = action.payload;
      });
    }
    case Actions.GET_BRAND_STATISTICS_BRAND_SALES_SUCCESS: {
      return produce(state, draft => {
        const brandStatistics: ResponseManagementBrandStatistics[] = [];
        brandStatistics.push({
          brandName : action.payload.data.brandName,
          totalSalesAmount : action.payload.data.totalSalesAmount,
          totalOrderCompleteAmount : action.payload.data.totalOrderCompleteAmount,
          totalOrderCompleteCount : action.payload.data.totalOrderCompleteCount,
          totalOrderCancelAmount : action.payload.data.totalOrderCancelAmount,
          totalOrderCancelCount : action.payload.data.totalOrderCancelCount,
          totalSalesAmountAvg : action.payload.data.totalSalesAmountAvg,
          totalOrderCompleteAmountAvg : action.payload.data.totalOrderCompleteAmountAvg,
          totalOrderCompleteCountAvg : action.payload.data.totalOrderCompleteCountAvg,
          totalOrderCancelAmountAvg : action.payload.data.totalOrderCancelAmountAvg,
          totalOrderCancelCountAvg : action.payload.data.totalOrderCancelCountAvg
        });
        // draft.statistics.brandSalesStatistics.o = ordersTable;
        // draft.statistics.dailySales.ordersCharts = action.payload.data.ordersCharts;
        // draft.statistics.dailySales.orders = action.payload.data.orders;
        // draft.statistics.dailySalesStatus = true;
      });
    }
    default: {
      return state;
    }
  }
};

export default brand;
