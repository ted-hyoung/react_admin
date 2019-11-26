// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  BannerAction, GET_BANNERS_MAIN_SUCCESS,
  GET_BANNERS_SUCCESS,
} from '../action/banner.action';

// models
import {
  PageWrapper,
  ResponseBannerList,
  Indexable,
} from 'models';

export interface BannerState extends Indexable {
  banners: PageWrapper<ResponseBannerList>;
  bannersMain:ResponseBannerList[];
}

const initialState: BannerState = {
  banners: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  bannersMain:[]
};

export default createReducer<BannerState, BannerAction>(initialState, {
  [GET_BANNERS_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.banners = action.payload;
    }),
  [GET_BANNERS_MAIN_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.bannersMain = action.payload;
    }),
});
