// base
import { AxiosError } from 'axios';
import { action, createAsyncAction, ActionType, createStandardAction } from 'typesafe-actions';

// models
import { PageWrapper } from 'models';
import {
  SearchExperienceGroupConsumer,
  ResponseSearchExperienceGroupConsumers,
  UpdateExperienceGroupConsumersPrize,
  UpdateExperienceGroupConsumerExpose,
  ResponseExperienceGroupConsumers,
  UpdateExperienceGroupConsumer,
} from 'models/ExpGroupConsumer';

// action types
export const GET_EXP_GROUP_CONSUMERS_BY_ID_REQUEST = 'expConsumer/GET_EXP_GROUP_CONSUMERS_BY_ID_REQUEST';
export const GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS = 'expConsumer/GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS';
export const GET_EXP_GROUP_CONSUMERS_BY_ID_FAILURE = 'expConsumer/GET_EXP_GROUP_CONSUMERS_BY_ID_FAILURE';

export const UPDATE_EXP_GROUP_CONSUMERS_PRIZE_REQUEST = 'expConsumer/UPDATE_EXP_GROUP_CONSUMERS_PRIZE_REQUEST';
export const UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS = 'expConsumer/UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS';
export const UPDATE_EXP_GROUP_CONSUMERS_PRIZE_FAILURE = 'expConsumer/UPDATE_EXP_GROUP_CONSUMERS_PRIZE_FAILURE';

export const UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_REQUEST =
  'expConsumer/UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_REQUEST';
export const UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_SUCCESS =
  'expConsumer/UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_SUCCESS';
export const UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_FAILURE =
  'expConsumer/UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_FAILURE';

export const UPDATE_EXP_GROUP_CONSUMER_BY_ID_REQUEST = 'expConsumer/UPDATE_EXP_GROUP_CONSUMER_BY_ID_REQUEST';
export const UPDATE_EXP_GROUP_CONSUMER_BY_ID_SUCCESS = 'expConsumer/UPDATE_EXP_GROUP_CONSUMER_BY_ID_SUCCESS';
export const UPDATE_EXP_GROUP_CONSUMER_BY_ID_FAILURE = 'expConsumer/UPDATE_EXP_GROUP_CONSUMER_BY_ID_FAILURE';

export const GET_EXP_GROUP_CONSUMER_BY_ID_REQUEST = 'expConsumer/GET_EXP_GROUP_CONSUMER_REQUEST';
export const GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS = 'expConsumer/GET_EXP_GROUP_CONSUMER_SUCCESS';
export const GET_EXP_GROUP_CONSUMER_BY_ID_FAILURE = 'expConsumer/GET_EXP_GROUP_CONSUMER_FAILURE';

export const GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_REQUEST = 'expConsumer/GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_REQUEST';
export const GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_SUCCESS = 'expConsumer/GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_SUCCESS';
export const GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_FAILURE = 'expConsumer/GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_FAILURE';

// 체험단 그룹 참여자 조회
export const getExpGroupConsumersByIdAsync = createAsyncAction(
  GET_EXP_GROUP_CONSUMERS_BY_ID_REQUEST,
  GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS,
  GET_EXP_GROUP_CONSUMERS_BY_ID_FAILURE,
)<
  { id: number; page: number; size: number; params?: SearchExperienceGroupConsumer },
  PageWrapper<ResponseSearchExperienceGroupConsumers>,
  AxiosError
>();

// 체험단 그룹 참여자 당첨 여부 변경
export const updateExpGroupConsumersPrizeAsync = createAsyncAction(
  UPDATE_EXP_GROUP_CONSUMERS_PRIZE_REQUEST,
  UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMERS_PRIZE_FAILURE,
)<{ data: UpdateExperienceGroupConsumersPrize }, UpdateExperienceGroupConsumersPrize, AxiosError>();

// 체험단 그룹 참여자 공개 여부 변경
export const updateExpGroupConsumerExposeByIdAsync = createAsyncAction(
  UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_REQUEST,
  UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_FAILURE,
)<{ id: number; data: UpdateExperienceGroupConsumerExpose }, void, AxiosError>();

// 후기 이벤트 참여자 상세 보기
export const getExpGroupConsumerByIdAsync = createAsyncAction(
  GET_EXP_GROUP_CONSUMER_BY_ID_REQUEST,
  GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS,
  GET_EXP_GROUP_CONSUMER_BY_ID_FAILURE,
)<{ id: number }, ResponseExperienceGroupConsumers, AxiosError>();

// 후기 이벤트 참여자 상세 수정
export const updateExpGroupConsumerByIdAsync = createAsyncAction(
  UPDATE_EXP_GROUP_CONSUMER_BY_ID_REQUEST,
  UPDATE_EXP_GROUP_CONSUMER_BY_ID_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMER_BY_ID_FAILURE,
)<{ id: number; data: UpdateExperienceGroupConsumer }, void, AxiosError>();

export const getExpGroupConsumersExcelByIdAsync = createAsyncAction(
  GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_REQUEST,
  GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_SUCCESS,
  GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_FAILURE,
)<{ id: number; params?: SearchExperienceGroupConsumer }, ResponseSearchExperienceGroupConsumers[], AxiosError>();

// actions
const actions = {
  getExpGroupConsumersByIdAsync,
  updateExpGroupConsumersPrizeAsync,
  updateExpGroupConsumerExposeByIdAsync,
  getExpGroupConsumerByIdAsync,
  updateExpGroupConsumerByIdAsync,
  getExpGroupConsumersExcelByIdAsync,
};

export type ExpGroupConsumerAction = ActionType<typeof actions>;
