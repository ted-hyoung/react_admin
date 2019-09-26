// base
import produce from 'immer';
import { action, createAsyncAction } from 'typesafe-actions';

// action
import * as Actions from 'store/action/brandAction';

// types
import {
  ErrorAsyncAction,
  RequestAsyncAction,
  ResponseAsyncAction,
  ResponseBrandForEvent,
  ResponseManagementBrandStatistics, ResponseManagementOrdersDailySalesTable,
} from 'types';
import { useMemo } from 'react';

export interface BrandState {
  brand: ResponseBrandForEvent[];
  statistics : ResponseManagementBrandStatistics[];
}

export const getBrandsAsync = createAsyncAction(
  Actions.GET_EVENT_BRANDS_REQUEST,
  Actions.GET_EVENT_BRANDS_SUCCESS,
  Actions.GET_EVENT_BRANDS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 브랜드 매출 통계
export const getStatisticsBrandSalesAsync = createAsyncAction(
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_REQUEST,
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_SUCCESS,
  Actions.GET_BRAND_STATISTICS_BRAND_SALES_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const clearBrandSalesStatus = action(Actions.CLEAR_BRAND_SALES_STATUS);

// reducers
const initialState: BrandState = {
  brand: [],
  statistics:[]
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
        draft.statistics = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default brand;
