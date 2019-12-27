
// banner List 조회
import { ActionType, createAsyncAction } from 'typesafe-actions';
import {
  CreateBanner,
  GetListRequestPayload,
  PageWrapper,
  RequestAsyncAction, ResponseAccountCelebForList,
  ResponseBannerList,
  SearchBannerList, SelectedBanner,
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

export const UPDATE_BANNERS_MAIN_REQUEST = 'banner/UPDATE_BANNERS_MAIN_REQUEST';
export const UPDATE_BANNERS_MAIN_SUCCESS = 'banner/UPDATE_BANNERS_MAIN_SUCCESS';
export const UPDATE_BANNERS_MAIN_FAILURE = 'banner/UPDATE_BANNERS_MAIN_FAILURE';

export const UPDATE_BANNERS_MAIN_SEQUENCE_REQUEST = 'banner/UPDATE_BANNERS_MAIN_SEQUENCE_REQUEST';
export const UPDATE_BANNERS_MAIN_SEQUENCE_SUCCESS = 'banner/UPDATE_BANNERS_MAIN_SEQUENCE_SUCCESS';
export const UPDATE_BANNERS_MAIN_SEQUENCE_FAILURE = 'banner/UPDATE_BANNERS_MAIN_SEQUENCE_FAILURE';

export const DELETE_BANNERS_REQUEST = 'banner/DELETE_BANNERS_REQUEST';
export const DELETE_BANNERS_SUCCESS = 'banner/DELETE_BANNERS_SUCCESS';
export const DELETE_BANNERS_FAILURE = 'banner/DELETE_BANNERS_FAILURE';

export const createBannerAsync = createAsyncAction(
  CREATE_BANNER_REQUEST,
  CREATE_BANNER_SUCCESS,
  CREATE_BANNER_FAILURE,
)<CreateBanner, void, AxiosError>();

export const updateBannersMainAsync = createAsyncAction(
  UPDATE_BANNERS_MAIN_REQUEST,
  UPDATE_BANNERS_MAIN_SUCCESS,
  UPDATE_BANNERS_MAIN_FAILURE,
)<{exposeMain: boolean, bannerIds: number[] | string[]}, void, AxiosError>();

export const updateBannersMainSequenceAsync = createAsyncAction(
  UPDATE_BANNERS_MAIN_SEQUENCE_REQUEST,
  UPDATE_BANNERS_MAIN_SEQUENCE_SUCCESS,
  UPDATE_BANNERS_MAIN_SEQUENCE_FAILURE,
)<{bannerIds: number[]}, void, AxiosError>();

export const deleteBannersAsync = createAsyncAction(
  DELETE_BANNERS_REQUEST,
  DELETE_BANNERS_SUCCESS,
  DELETE_BANNERS_FAILURE,
)<SelectedBanner, void, AxiosError>();

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
  updateBannersMainAsync,
  deleteBannersAsync,
  updateBannersMainSequenceAsync,
};

export type BannerAction = ActionType<typeof actions>;