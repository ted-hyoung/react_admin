
// banner List 조회
import { ActionType, createAsyncAction } from 'typesafe-actions';
import {
  GetListRequestPayload,
  PageWrapper,
  RequestAsyncAction,
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

export const getBannersAsync = createAsyncAction(
  GET_BANNERS_REQUEST,
  GET_BANNERS_SUCCESS,
  GET_BANNERS_FAILURE,
)<GetListRequestPayload<SearchBannerList>, PageWrapper<ResponseBannerList>, AxiosError>();


export const getBannersMainAsync = createAsyncAction(
  GET_BANNERS_MAIN_REQUEST,
  GET_BANNERS_MAIN_SUCCESS,
  GET_BANNERS_MAIN_FAILURE,
)<RequestAsyncAction , ResponseBannerList[], AxiosError>();

const actions = {
  getBannersAsync,
  getBannersMainAsync,
};

export type BannerAction = ActionType<typeof actions>;