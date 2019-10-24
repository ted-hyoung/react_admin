// base
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { getToken, getRefreshToken, logout, setToken, isTokenExpired } from './utils';
import { LoginAccount } from 'models';
import { message } from 'antd';

// defines
type AxiosFunction = (url: string, data?: {}, cb?: (res: AxiosResponse) => AxiosResponse) => AxiosPromise;

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

export const getPaymentCancelHost = () => {
  return process.env.REACT_APP_PC_PAY_CANCEL_API_URL;
};

const getHost = () => process.env.REACT_APP_REST_API_URL + getAPIVersion();
const getFileHost = () => process.env.REACT_APP_FILE_API_URL + '/buckets/' + process.env.REACT_APP_S3_BUCKET + '/';
const getFileUrl = () => process.env.REACT_APP_FILE_URL + '';

// config
export const host = getHost();
export const fileHost = getFileHost();
export const fileUrl = getFileUrl();
export const payCancelHost = getPaymentCancelHost();

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async res => {
  let token = getToken();

  if (isTokenExpired(token)) {
    const res = await requestRefreshToken(token, getRefreshToken());
    token = res.data.access_token;
  }

  res.headers = {
    Accept: 'application/json',
    Authorization: 'Bearer ' + token,
  };

  return res;
});

axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    throw extractErrorMsg(err);
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

 */
export const post: AxiosFunction = (url, data, cb) => {
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
  return axiosInstance.delete(host + url, data).then(res => (cb ? cb(res) : res));
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
      return res;
    })
    .catch(error => {
      message.error('로그인에 실패했습니다. 다시 시도해주세요');
      throw error;
    });
}

export function requestRefreshToken(token: string, refreshToken: string) {
  return axios
    .get(host + '/accounts/authorize', {
      params: {
        grant_type: 'refresh_token',
        access_token: token,
        refresh_token: refreshToken,
      },
    })
    .then(res => {
      setToken(res.data.access_token, res.data.refresh_token);

      return res;
    })
    .catch(err => {
      logout();

      return err;
    });
}

export const uploadImage = (file: File | File[], cb?: (res: AxiosResponse) => void) => {
  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach(f => {
      formData.append('files', f);
    });
  } else {
    formData.append('file', file);
  }

  return axios
    .post(fileHost + (Array.isArray(file) ? 'images' : 'image'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      if (cb) {
        cb(res);
      }

      return res;
    })
    .catch(error => {
      throw extractErrorMsg(error);
    });
};

export const deleteImage = (fileKey: string, cb?: (res: AxiosResponse) => void) => {
  return axios
    .delete(fileHost + 'files/' + fileKey)
    .then(res => {
      if (cb) {
        cb(res);
      }

      return res;
    })
    .catch(error => {
      throw extractErrorMsg(error);
    });
};
