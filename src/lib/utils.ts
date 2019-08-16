import Cookies from 'universal-cookie';
import decode from 'jwt-decode';

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

export const getNowYMD = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth() + 1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  const result = y + '-' + m + '-' + d;
  return result;
};

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
  cookies.set(ACCESS_TOKEN, token);
  cookies.set(REFRESH_TOKEN, refreshToken);
}

export function logout() {
  const cookies = new Cookies();
  cookies.set(ACCESS_TOKEN, '');
  cookies.set(REFRESH_TOKEN, '');
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
