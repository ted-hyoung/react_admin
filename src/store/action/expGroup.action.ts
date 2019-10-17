// base
import { AxiosError } from 'axios';
import { action, createAsyncAction, ActionType, createStandardAction } from 'typesafe-actions';

// models
import {
  CreateExperienceGroup,
  ResponseExperienceGroups,
  PageWrapper,
  ResponseExperienceGroup,
  UpdateExperienceGroup,
  UpdateExperienceGroupConsumerUpload,
} from 'models';

// action types

// 체험단 그룹 생성
export const CREATE_EXP_GROUP_REQUEST = 'exp/CREATE_EXP_GROUP_REQUEST';
export const CREATE_EXP_GROUP_SUCCESS = 'exp/CREATE_EXP_GROUP_SUCCESS';
export const CREATE_EXP_GROUP_FAILURE = 'exp/CREATE_EXP_GROUP_FAILURE';

// 체험단 그룹 가져오기
export const GET_EXP_GROUPS_REQUEST = 'exp/GET_EXP_GROUPS_REQUEST';
export const GET_EXP_GROUPS_SUCCESS = 'exp/GET_EXP_GROUPS_SUCCESS';
export const GET_EXP_GROUPS_FAILURE = 'exp/GET_EXP_GROUPS_FAILURE';

// 체험단 그룹 상세 가져오기
export const GET_EXP_GROUPS_BY_ID_REQUEST = 'exp/GET_EXP_GROUPS_BY_ID_REQUEST';
export const GET_EXP_GROUPS_BY_ID_SUCCESS = 'exp/GET_EXP_GROUPS_BY_ID_SUCCESS';
export const GET_EXP_GROUPS_BY_ID_FAILURE = 'exp/GET_EXP_GROUPS_BY_ID_FAILURE';

// 체험단 그룹 상세 수정
export const UPDATE_EXP_GROUPS_BY_ID_REQUEST = 'exp/UPDATE_EXP_GROUPS_BY_ID_REQUEST';
export const UPDATE_EXP_GROUPS_BY_ID_SUCCESS = 'exp/UPDATE_EXP_GROUPS_BY_ID_SUCCESS';
export const UPDATE_EXP_GROUPS_BY_ID_FAILURE = 'exp/UPDATE_EXP_GROUPS_BY_ID_FAILURE';

export const UPDATE_EXP_GROUP_CONSUMERS_REQUEST = 'exp/UPDATE_EXP_GROUP_CONSUMERS_REQUEST';
export const UPDATE_EXP_GROUP_CONSUMERS_SUCCESS = 'exp/UPDATE_EXP_GROUP_CONSUMERS_SUCCESS';
export const UPDATE_EXP_GROUP_CONSUMERS_FAILURE = 'exp/UPDATE_EXP_GROUP_CONSUMERS_FAILURE';

// 체험단 그룹 상세 초기화
export const CLEAR_EXP_GROUP_DETAIL = 'exp/CLEAR_EXP_GROUP_DETAIL';

// actions
export const createExpGroupAsync = createAsyncAction(
  CREATE_EXP_GROUP_REQUEST,
  CREATE_EXP_GROUP_SUCCESS,
  CREATE_EXP_GROUP_FAILURE,
)<CreateExperienceGroup, void, AxiosError>();

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

export const clearExpGroupDetail = createStandardAction(CLEAR_EXP_GROUP_DETAIL)();

const actions = {
  createExpGroupAsync,
  getExpGroupsAsync,
  getExpGroupsByIdAsync,
  updateExpGroupsByIdAsync,
  updateExpGroupConsumersAsync,
  clearExpGroupDetail,
};

export type ExpGroupAction = ActionType<typeof actions>;
