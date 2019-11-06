import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';


// models
import { PageWrapper, RequestAsyncAction, ResponseAccounts } from '../../models';

// account  정보 조회
export const GET_ACCOUNTS_REQUEST = 'account/GET_ACCOUNTS_REQUEST';
export const GET_ACCOUNTS_SUCCESS = 'account/GET_ACCOUNTS_SUCCESS';
export const GET_ACCOUNTS_FAILURE = 'account/GET_ACCOUNTS_FAILURE';

// actions
export const getAccountsAsync = createAsyncAction(
  GET_ACCOUNTS_REQUEST,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAILURE,
)<RequestAsyncAction, PageWrapper<ResponseAccounts>, AxiosError>();


const actions = {
  getAccountsAsync
};

export type AccountAction = ActionType<typeof actions>;