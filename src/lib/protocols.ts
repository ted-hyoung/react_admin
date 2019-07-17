// base
import axios, { AxiosPromise, AxiosResponse } from 'axios';

// defines
type AxiosFunction = (
  url: string,
  data?: {},
  cb?: (res: AxiosResponse) => AxiosResponse,
  withCredentials?: boolean,
) => AxiosPromise;

const getAPIVersion = () => {
  // return "v1/";
  return '';
};

const extractErrorMsg = (error: any) => {
  if (!error.response) {
    return '서버에 접속할 수 없습니다';
  } else {
    return error.response.data.message || error.response.data.errors[0].message || '에러 발생';
  }
};

const getHost = () => process.env.REACT_APP_REST_API_URL + getAPIVersion();

const getFileHost = () => process.env.REACT_APP_FILE_API_URL;

// config
const host = getHost();
const fileHost = getFileHost();

// todo: 임시 auth header
const authHeader = {
  Accept: 'application/json',
  Authorization:
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJMT0dJTl9JRCI6ImZyb21jIiwiaXNzIjoiaHR0cHM6Ly93d3cuZnJvbWMuY29tIiwiZXhwIjoxNTYzOTQ1NDA3LCJVU0VSX1JPTEUiOiJST0xFX0FETUlOIiwiaWF0IjoxNTYzMzQwNjA3fQ.fwWOFN5pzctig7HLyoox9tvtFEva0SXwsdl2vUNkPz4',
};

/**
 *
 * @param url api url
 * @param data api data and config
 * @param cb callback function
 */
export const get: AxiosFunction = (url, data, cb) => {
  let options = data ? data : {};

  options = {
    ...options,
    headers: authHeader,
  };

  return axios
    .get(host + url, options)
    .then(res => (cb ? cb(res) : res))
    .catch(error => {
      throw extractErrorMsg(error);
    });
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 * @param withCredentials withCredentials
 */
export const post: AxiosFunction = (url, data, cb, withCredentials = false) => {
  return axios
    .post(host + url, data ? data : {}, {
      headers: authHeader,
      withCredentials,
    })
    .then(res => (cb ? cb(res) : res))
    .catch(error => {
      throw extractErrorMsg(error);
    });
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const put: AxiosFunction = (url, data, cb) => {
  return axios
    .put(host + url, data ? data : {}, {
      headers: authHeader,
    })
    .then(res => (cb ? cb(res) : res))
    .catch(error => {
      throw extractErrorMsg(error);
    });
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const patch: AxiosFunction = (url, data, cb) => {
  return axios
    .patch(host + url, data ? data : {}, {
      headers: authHeader,
    })
    .then(res => (cb ? cb(res) : res))
    .catch(error => {
      throw extractErrorMsg(error);
    });
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const del: AxiosFunction = (url, data, cb) => {
  return axios
    .delete(host + url, {
      headers: authHeader,
    })
    .then(res => (cb ? cb(res) : res))
    .catch(error => {
      throw extractErrorMsg(error);
    });
};
