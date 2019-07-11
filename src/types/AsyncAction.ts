import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface RequestAsyncAction extends AxiosRequestConfig {
  type?: string;
  payload?: any;
  [prop: string]: any;
}

export interface ResponseAsyncAction extends AxiosResponse {
  type?: string;
  payload?: any;
}

export interface ErrorAsyncAction extends AxiosError {
  type?: string;
  payload?: any;
}
