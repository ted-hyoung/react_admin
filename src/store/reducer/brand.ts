// base
import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';

// action
import * as Actions from 'store/action/brandAction';

// types
import { ErrorAsyncAction, RequestAsyncAction, ResponseAsyncAction, ResponseBrandForEvent } from 'models';

export interface BrandState {
  brand: ResponseBrandForEvent[];
}

export const getBrandsAsync = createAsyncAction(
  Actions.GET_EVENT_BRANDS_REQUEST,
  Actions.GET_EVENT_BRANDS_SUCCESS,
  Actions.GET_EVENT_BRANDS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: BrandState = {
  brand: [],
};

const brand = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_EVENT_BRANDS_SUCCESS: {
      return produce(state, draft => {
        draft.brand = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default brand;
