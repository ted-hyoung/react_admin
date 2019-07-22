import Cookies from 'universal-cookie';

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

export function isLoggedIn() {
  const cookies = new Cookies();
  return cookies.get('fromc_admin_access_token');
}

export function getToken() {
  const cookies = new Cookies();
  return cookies.get('fromc_admin_access_token');
}

export function getRefreshToken() {
  const cookies = new Cookies();
  return cookies.get('fromc_admin_refresh_token');
}

export function setToken(token: string, refreshToken: string) {
  const cookies = new Cookies();
  cookies.set('fromc_admin_access_token', token);
  cookies.set('fromc_admin_refresh_token', refreshToken);
}

export function logout() {
  const cookies = new Cookies();
  cookies.set('fromc_admin_access_token', '');
  cookies.set('fromc_admin_refresh_token', '');
  window.location.href = '/';
}
