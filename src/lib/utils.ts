import Cookies from 'universal-cookie';
import decode from 'jwt-decode';
import { fileUrl } from './protocols';
import runes from 'runes';

export const defaultDateFormat = 'YYYY-MM-DDTHH:mm:ss';

export const startDateFormat = 'YYYY-MM-DDT00:00:00';

export const endDateFormat = 'YYYY-MM-DDT23:59:59';

export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export const calcStringByte = (str: string) => {
  if (str) {
    return String(str).length;
  } else {
    return 0;
  }
};

interface EnumType {
  [i: number]: string;
}

interface Token {
  LOGIN_ID: string;
  USER_ROLE: string;
  exp: number;
  iat: number;
  iss: string;
}

export function mapEnums(targetEnum: EnumType) {
  const result: {
    key: string;
    value: string | number;
  }[] = [];
  const enumKeys = Object.keys(targetEnum);
  enumKeys.some((key: any, i) => {
    result.push({
      key: targetEnum[key],
      value: key,
    });
    return i + 1 === enumKeys.length / 2;
  });
  return result;
}

export function sortedString(a: string, b: string) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
}

export function getThumbUrl(fileKey: string, width: number = 120, height: number = 120, option?: 'fit' | 'scale') {
  if (fileKey.indexOf('/static') > -1) {
    return fileKey;
  }

  return fileUrl + '/' + fileKey + `?size=${width}x${height}${option ? '&option=' + option : ''}`;
}
export const getNowYMD = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth() + 1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  const result = y + '-' + m + '-' + d;
  return result;
};

export function replaceText(text: string) {
  return text.split('\r').join('\n');
}

export function splitToLine(text: string, limit: number) {
  const limitLengthPerLine = 27; // 한 줄에 보여지는 글자 수
  const replaceAndSplit = replaceText(text).split('\n');

  const resultList: string[] = [];
  replaceAndSplit.forEach((textRow, i) => {
    if (runes(textRow).length > limitLengthPerLine) {
      const contentsSplitRegex = new RegExp(`(.{1,${limitLengthPerLine}})`, 'g');
      const sliceTextRow = textRow.match(contentsSplitRegex) as string[];
      resultList.push(...sliceTextRow);
    } else {
      resultList.push(textRow);
    }
  });
  return resultList;
}

const ACCESS_TOKEN = 'fromc_admin_access_token';
const REFRESH_TOKEN = 'fromc_admin_refresh_token';

export function getToken() {
  const cookies = new Cookies();
  return cookies.get(ACCESS_TOKEN);
}

export function getRefreshToken() {
  const cookies = new Cookies();
  return cookies.get(REFRESH_TOKEN);
}

export function setToken(token: string, refreshToken: string) {
  const cookies = new Cookies();
  cookies.set(ACCESS_TOKEN, token, { path: '/' });
  cookies.set(REFRESH_TOKEN, refreshToken, { path: '/' });
}

export function logout() {
  const cookies = new Cookies();
  cookies.set(ACCESS_TOKEN, '', { path: '/' });
  cookies.set(REFRESH_TOKEN, '', { path: '/' });
  window.location.href = '/';
}

export function isTokenExpired(token?: string) {
  if (!token) {
    return true;
  }
  const decoded = decode<Token>(token);
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}
