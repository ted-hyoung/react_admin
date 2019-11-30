
// banner List 조회
import { ActionType, createAsyncAction } from 'typesafe-actions';
import {
  CreateBanner,
  GetListRequestPayload,
  PageWrapper,
  RequestAsyncAction, ResponseAccountCelebForList,
  ResponseBannerList,
  SearchBannerList,
} from '../../models';
import { AxiosError } from 'axios';


export const GET_BANNERS_REQUEST = 'banner/GET_BANNERS_REQUEST';
export const GET_BANNERS_SUCCESS = 'banner/GET_BANNERS_SUCCESS';
export const GET_BANNERS_FAILURE = 'banner/GET_BANNERS_FAILURE';

export const GET_BANNERS_MAIN_REQUEST = 'banner/GET_BANNERS_MAIN_REQUEST';
export const GET_BANNERS_MAIN_SUCCESS = 'banner/GET_BANNERS_MAIN_SUCCESS';
export const GET_BANNERS_MAIN_FAILURE = 'banner/GET_BANNERS_MAIN_FAILURE';


export const GET_SELEBS_REQUEST = 'banner/GET_SELEBS_REQUEST';
export const GET_SELEBS_SUCCESS = 'banner/GET_SELEBS_SUCCESS';
export const GET_SELEBS_FAILURE = 'banner/GET_SELEBS_FAILURE';

// 공구 신규 등록
export const CREATE_BANNER_REQUEST = 'banner/CREATE_BANNER_REQUEST';
export const CREATE_BANNER_SUCCESS = 'banner/CREATE_BANNER_SUCCESS';
export const CREATE_BANNER_FAILURE = 'banner/CREATE_BANNER_FAILURE';

export const createBannerAsync = createAsyncAction(
  CREATE_BANNER_REQUEST,
  CREATE_BANNER_SUCCESS,
  CREATE_BANNER_FAILURE,
)<CreateBanner, void, AxiosError>();

export const getBannersAsync = createAsyncAction(
  GET_BANNERS_REQUEST,
  GET_BANNERS_SUCCESS,
  GET_BANNERS_FAILURE,
)<GetListRequestPayload<SearchBannerList>, PageWrapper<ResponseBannerList>, AxiosError>();

export const getCelebsAsync = createAsyncAction(
  GET_SELEBS_REQUEST,
  GET_SELEBS_SUCCESS,
  GET_SELEBS_FAILURE,
)<RequestAsyncAction , PageWrapper<ResponseAccountCelebForList>, AxiosError>();

export const getBannersMainAsync = createAsyncAction(
  GET_BANNERS_MAIN_REQUEST,
  GET_BANNERS_MAIN_SUCCESS,
  GET_BANNERS_MAIN_FAILURE,
)<RequestAsyncAction , ResponseBannerList[], AxiosError>();

const actions = {
  getBannersAsync,
  getBannersMainAsync,
  getCelebsAsync,
  createBannerAsync,
};

export type BannerAction = ActionType<typeof actions>;