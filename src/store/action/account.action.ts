import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';


// models
import {
  ErrorAsyncAction,
  PageWrapper,
  RequestAsyncAction,
  ResponseAccounts,
  ResponseDetailAccount,
  ResponseOrdersForAccount,
} from '../../models';
import * as Actions from './orderAction';

// accounts  정보 조회 [리스트, 다건]
export const GET_ACCOUNTS_REQUEST = 'account/GET_ACCOUNTS_REQUEST';
export const GET_ACCOUNTS_SUCCESS = 'account/GET_ACCOUNTS_SUCCESS';
export const GET_ACCOUNTS_FAILURE = 'account/GET_ACCOUNTS_FAILURE';

// account 정보 조회 [상세, 단건]
export const GET_ACCOUNT_DETAIL_REQUEST = 'account/GET_ACCOUNT_DETAIL_REQUEST';
export const GET_ACCOUNT_DETAIL_SUCCESS = 'account/GET_ACCOUNT_DETAIL_SUCCESS';
export const GET_ACCOUNT_DETAIL_FAILURE = 'account/GET_ACCOUNT_DETAIL_FAILURE';

export const GET_ACCOUNT_ORDERS_REQUEST = 'account/GET_ACCOUNT_ORDERS_REQUEST';
export const GET_ACCOUNT_ORDERS_SUCCESS = 'account/GET_ACCOUNT_ORDERS_SUCCESS';
export const GET_ACCOUNT_ORDERS_FAILURE = 'account/GET_ACCOUNT_ORDERS_FAILURE';

export const UPDATE_ACCOUNT_REQUEST = 'account/UPDATE_ACCOUNT_REQUEST';
export const UPDATE_ACCOUNT_SUCCESS = 'account/UPDATE_ACCOUNT_SUCCESS';
export const UPDATE_ACCOUNT_FAILURE = 'account/UPDATE_ACCOUNT_FAILURE';

// actions
export const getAccountsAsync = createAsyncAction(
  GET_ACCOUNTS_REQUEST,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAILURE,
)<RequestAsyncAction, PageWrapper<ResponseAccounts>, AxiosError>();

export const getAccountDetailAsync = createAsyncAction(
  GET_ACCOUNT_DETAIL_REQUEST,
  GET_ACCOUNT_DETAIL_SUCCESS,
  GET_ACCOUNT_DETAIL_FAILURE,
)<RequestAsyncAction, ResponseDetailAccount, AxiosError>();

export const getAccountOrdersAsync = createAsyncAction(
  GET_ACCOUNT_ORDERS_REQUEST,
  GET_ACCOUNT_ORDERS_SUCCESS,
  GET_ACCOUNT_ORDERS_FAILURE,
)<RequestAsyncAction, ResponseOrdersForAccount, ErrorAsyncAction>();

export const updateAccountAsync = createAsyncAction(
  UPDATE_ACCOUNT_REQUEST,
  UPDATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAILURE,
)<RequestAsyncAction, {marketingInfoAgree: boolean, phone: string, consumerId: number}, ErrorAsyncAction>();

const actions = {
  getAccountsAsync,
  getAccountDetailAsync,
  getAccountOrdersAsync,
  updateAccountAsync,
};

export type AccountAction = ActionType<typeof actions>;