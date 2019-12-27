// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  BannerAction, GET_BANNERS_MAIN_SUCCESS,
  GET_BANNERS_SUCCESS, GET_SELEBS_SUCCESS,
} from '../action/banner.action';

// models
import {
  PageWrapper,
  ResponseBannerList,
  Indexable, ResponseAccountCelebForList,
} from 'models';

export interface BannerState extends Indexable {
  banners: PageWrapper<ResponseBannerList>;
  bannersMain:ResponseBannerList[];
  selebs:PageWrapper<ResponseAccountCelebForList>;
}

const initialState: BannerState = {
  banners: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  bannersMain:[],
  selebs:{
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  }
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
  [GET_SELEBS_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.selebs = action.payload;
    }),
});
