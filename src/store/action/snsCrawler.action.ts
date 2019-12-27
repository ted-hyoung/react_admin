// base
import { AxiosError } from 'axios';
import { ActionType, createAsyncAction } from 'typesafe-actions';

// models
import {
  ResponseSnsCrawlerGroups,
} from 'models';



// SNS Crawler 조회
export const GET_SNS_CRAWLER_REQUEST = 'snsCrawler/GET_SNS_CRAWLER_REQUEST';
export const GET_SNS_CRAWLER_SUCCESS = 'snsCrawler/GET_SNS_CRAWLER_SUCCESS';
export const GET_SNS_CRAWLER_FAILURE = 'snsCrawler/GET_SNS_CRAWLER_FAILURE';

export const getSnsCrawlerAsync = createAsyncAction(
  GET_SNS_CRAWLER_REQUEST,
  GET_SNS_CRAWLER_SUCCESS,
  GET_SNS_CRAWLER_FAILURE,
)<{ snsUrl: string }, ResponseSnsCrawlerGroups, AxiosError>();

const actions = {
  getSnsCrawlerAsync,
};

export type SnsCrawlerAction = ActionType<typeof actions>;
