// base
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { getToken, getRefreshToken, logout, setToken } from './utils';
import { LoginAccount } from 'types';
import { message } from 'antd';

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

const getAuthHeader = () => ({
  Accept: 'application/json',
  Authorization: 'Bearer ' + getToken(),
});

// config
const host = getHost();
const fileHost = getFileHost();
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    config.headers = getAuthHeader();
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    return new Promise((resolve, reject) => {
      axios
        .get(host + '/accounts/authorize', {
          params: {
            grant_type: 'refresh_token',
            access_token: getToken(),
            refresh_token: getRefreshToken(),
          },
        })
        .then(res => {
          err.config.__isRetryRequest = true;
          err.config.headers.Authorization = 'Bearer ' + res.data.access_token;
          resolve(
            axios(err.config).catch(err2 => {
              throw extractErrorMsg(err2);
            }),
          );
        })
        .catch(refreshTokenErr => {
          logout();
        });
    });
  },
);

/**
 *
 * @param url api url
 * @param data api data and config
 * @param cb callback function
 */
export const get: AxiosFunction = (url, data, cb) => {
  return axiosInstance.get(host + url, data).then(res => (cb ? cb(res) : res));
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 * @param withCredentials withCredentials
 */
export const post: AxiosFunction = (url, data, cb, withCredentials = false) => {
  return axiosInstance.post(host + url, data).then(res => (cb ? cb(res) : res));
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const put: AxiosFunction = (url, data, cb) => {
  return axiosInstance.put(host + url, data).then(res => (cb ? cb(res) : res));
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const patch: AxiosFunction = (url, data, cb) => {
  return axiosInstance.patch(host + url, data).then(res => (cb ? cb(res) : res));
};

/**
 *
 * @param url api url
 * @param data api data
 * @param cb callback function
 */
export const del: AxiosFunction = (url, data, cb) => {
  return axiosInstance.delete(host + url).then(res => (cb ? cb(res) : res));
};

/**
 *
 * @param account login account : loginId, password
 */
export function login(account: LoginAccount) {
  return axios
    .post(host + '/accounts/login', account)
    .then(res => {
      setToken(res.data.access_token, res.data.refresh_token);
      window.location.reload();
    })
    .catch(error => {
      message.error('로그인에 실패했습니다. 다시 시도해주세요');
    });
}
