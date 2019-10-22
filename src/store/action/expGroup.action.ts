// base
import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';

// models
import {
  CreateExperienceGroup,
  ResponseExperienceGroups,
  PageWrapper,
  ResponseExperienceGroup,
  UpdateExperienceGroup,
  UpdateExperienceGroupConsumerUpload,
  SearchExperienceGroupForEvent,
  ResponseSearchExperienceGroupForEventNoConsumer,
  CreateExperienceGroupEvent,
  DeleteExperienceGroupEvent,
} from 'models';

// action types
export const CREATE_EXP_GROUP_REQUEST = 'exp/CREATE_EXP_GROUP_REQUEST';
export const CREATE_EXP_GROUP_SUCCESS = 'exp/CREATE_EXP_GROUP_SUCCESS';
export const CREATE_EXP_GROUP_FAILURE = 'exp/CREATE_EXP_GROUP_FAILURE';

// 체험단 그룹 등록 by 공구
export const CREATE_EXP_GROUP_BY_EVENT_REQUEST = 'exp/CREATE_EXP_GROUP_BY_EVENT_REQUEST';
export const CREATE_EXP_GROUP_BY_EVENT_SUCCESS = 'exp/CREATE_EXP_GROUP_BY_EVENT_SUCCESS';
export const CREATE_EXP_GROUP_BY_EVENT_FAILURE = 'exp/CREATE_EXP_GROUP_BY_EVENT_FAILURE';

// 체험단 그룹 가져오기
export const GET_EXP_GROUPS_REQUEST = 'exp/GET_EXP_GROUPS_REQUEST';
export const GET_EXP_GROUPS_SUCCESS = 'exp/GET_EXP_GROUPS_SUCCESS';
export const GET_EXP_GROUPS_FAILURE = 'exp/GET_EXP_GROUPS_FAILURE';

// 체험단 그룹 상세 가져오기
export const GET_EXP_GROUPS_BY_ID_REQUEST = 'exp/GET_EXP_GROUPS_BY_ID_REQUEST';
export const GET_EXP_GROUPS_BY_ID_SUCCESS = 'exp/GET_EXP_GROUPS_BY_ID_SUCCESS';
export const GET_EXP_GROUPS_BY_ID_FAILURE = 'exp/GET_EXP_GROUPS_BY_ID_FAILURE';

// 체험단 그룹 가져오기 by 공구
export const GET_EXP_GROUPS_BY_EVENT_REQUEST = 'exp/GET_EXP_GROUPS_BY_EVENT_REQUEST';
export const GET_EXP_GROUPS_BY_EVENT_SUCCESS = 'exp/GET_EXP_GROUPS_BY_EVENT_SUCCESS';
export const GET_EXP_GROUPS_BY_EVENT_FAILURE = 'exp/GET_EXP_GROUPS_BY_EVENT_FAILURE';

// 체험단 그룹 상세 수정
export const UPDATE_EXP_GROUPS_BY_ID_REQUEST = 'exp/UPDATE_EXP_GROUPS_BY_ID_REQUEST';
export const UPDATE_EXP_GROUPS_BY_ID_SUCCESS = 'exp/UPDATE_EXP_GROUPS_BY_ID_SUCCESS';
export const UPDATE_EXP_GROUPS_BY_ID_FAILURE = 'exp/UPDATE_EXP_GROUPS_BY_ID_FAILURE';

// 체험단 그룹 참여자 등록
export const UPDATE_EXP_GROUP_CONSUMERS_REQUEST = 'exp/UPDATE_EXP_GROUP_CONSUMERS_REQUEST';
export const UPDATE_EXP_GROUP_CONSUMERS_SUCCESS = 'exp/UPDATE_EXP_GROUP_CONSUMERS_SUCCESS';
export const UPDATE_EXP_GROUP_CONSUMERS_FAILURE = 'exp/UPDATE_EXP_GROUP_CONSUMERS_FAILURE';

// 체험단 그룹 목록 가져오기 (공구 등록 전용)
export const GET_EXP_GROUPS_FOR_EVENT_REQUEST = 'exp/GET_EXP_GROUPS_FOR_EVENT_REQUEST';
export const GET_EXP_GROUPS_FOR_EVENT_SUCCESS = 'exp/GET_EXP_GROUPS_FOR_EVENT_SUCCESS';
export const GET_EXP_GROUPS_FOR_EVENT_FAILURE = 'exp/GET_EXP_GROUPS_FOR_EVENT_FAILURE';

export const DELETE_EXP_GROUP_BY_ID_REQUEST = 'exp/DELETE_EXP_GROUP_BY_ID_REQUEST';
export const DELETE_EXP_GROUP_BY_ID_SUCCESS = 'exp/DELETE_EXP_GROUP_BY_ID_SUCCESS';
export const DELETE_EXP_GROUP_BY_ID_FAILURE = 'exp/DELETE_EXP_GROUP_BY_ID_FAILURE';

// 체험단 그룹 상세 초기화
export const CLEAR_STORE_EXP_GROUP = 'exp/CLEAR_STORE_EXP_GROUP';

export const CLEAR_STORE_SEARCH_EXP_GROUP = 'exp/CLEAR_STORE_SEARCH_EXP_GROUP';

// actions
export const createExpGroupAsync = createAsyncAction(
  CREATE_EXP_GROUP_REQUEST,
  CREATE_EXP_GROUP_SUCCESS,
  CREATE_EXP_GROUP_FAILURE,
)<CreateExperienceGroup, void, AxiosError>();

export const createExpGroupByEventAsync = createAsyncAction(
  CREATE_EXP_GROUP_BY_EVENT_REQUEST,
  CREATE_EXP_GROUP_BY_EVENT_SUCCESS,
  CREATE_EXP_GROUP_BY_EVENT_FAILURE,
)<{ id: number; data: CreateExperienceGroupEvent }, void, AxiosError>();

export const getExpGroupsAsync = createAsyncAction(
  GET_EXP_GROUPS_REQUEST,
  GET_EXP_GROUPS_SUCCESS,
  GET_EXP_GROUPS_FAILURE,
)<{ page: number; size: number }, PageWrapper<ResponseExperienceGroups>, AxiosError>();

export const getExpGroupsByIdAsync = createAsyncAction(
  GET_EXP_GROUPS_BY_ID_REQUEST,
  GET_EXP_GROUPS_BY_ID_SUCCESS,
  GET_EXP_GROUPS_BY_ID_FAILURE,
)<{ id: number }, ResponseExperienceGroup, AxiosError>();

export const getExpGroupsByEventAsync = createAsyncAction(
  GET_EXP_GROUPS_BY_EVENT_REQUEST,
  GET_EXP_GROUPS_BY_EVENT_SUCCESS,
  GET_EXP_GROUPS_BY_EVENT_FAILURE,
)<
  { id: number; page: number; size: number },
  PageWrapper<ResponseSearchExperienceGroupForEventNoConsumer>,
  AxiosError
>();

export const updateExpGroupsByIdAsync = createAsyncAction(
  UPDATE_EXP_GROUPS_BY_ID_REQUEST,
  UPDATE_EXP_GROUPS_BY_ID_SUCCESS,
  UPDATE_EXP_GROUPS_BY_ID_FAILURE,
)<{ id: number; data: UpdateExperienceGroup }, void, AxiosError>();

export const updateExpGroupConsumersAsync = createAsyncAction(
  UPDATE_EXP_GROUP_CONSUMERS_REQUEST,
  UPDATE_EXP_GROUP_CONSUMERS_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMERS_FAILURE,
)<{ id: number; data: UpdateExperienceGroupConsumerUpload }, void, AxiosError>();

export const getExpGroupsForEventAsync = createAsyncAction(
  GET_EXP_GROUPS_FOR_EVENT_REQUEST,
  GET_EXP_GROUPS_FOR_EVENT_SUCCESS,
  GET_EXP_GROUPS_FOR_EVENT_FAILURE,
)<
  { eventId: number; page: number; size: number; params?: SearchExperienceGroupForEvent },
  PageWrapper<ResponseSearchExperienceGroupForEventNoConsumer>,
  AxiosError
>();

// 체험단 그룹 삭제하기 by id
export const deleteExpGroupByEventAsync = createAsyncAction(
  DELETE_EXP_GROUP_BY_ID_REQUEST,
  DELETE_EXP_GROUP_BY_ID_SUCCESS,
  DELETE_EXP_GROUP_BY_ID_FAILURE,
)<{ eventId: number; data: DeleteExperienceGroupEvent }, void, AxiosError>();

export const clearStoreExpGroup = createStandardAction(CLEAR_STORE_EXP_GROUP)();

export const clearStoreSearchExpGroup = createStandardAction(CLEAR_STORE_SEARCH_EXP_GROUP)();

const actions = {
  createExpGroupAsync,
  createExpGroupByEventAsync,
  getExpGroupsAsync,
  getExpGroupsByIdAsync,
  getExpGroupsByEventAsync,
  updateExpGroupsByIdAsync,
  updateExpGroupConsumersAsync,
  getExpGroupsForEventAsync,
  clearStoreExpGroup,
  clearStoreSearchExpGroup,
};

export type ExpGroupAction = ActionType<typeof actions>;
