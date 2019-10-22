import Cookies from 'universal-cookie';
import decode from 'jwt-decode';
import { fileUrl } from './protocols';
import runes from 'runes';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

export const defaultDateFormat = 'YYYY-MM-DDTHH:mm:ss';

export const defaultDateTimeFormat = 'YYYY-MM-DD';

export const startDateFormat = 'YYYY-MM-DDT00:00:00';

export const endDateFormat = 'YYYY-MM-DDT23:59:59';

export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export const getBytes = (str: string) => {
  if (str) {
    return String(str).length;
  } else {
    return 0;
  }
};

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

export function pad(num: number, length: number) {
  const n = num.toString();
  return n.length >= length ? n : new Array(length - n.length + 1).join('0') + num;
}

export const parseParams = (params: any) => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach(key => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray = isParamTypeObject && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

export interface CreateExcelOptions {
  widths?: number[];
  mergeCells?: string[];
}

export function createExcel(data: (string[])[], options?: CreateExcelOptions) {
  const { widths = [], mergeCells = [] } = options || { widths: undefined, mergeCells: undefined };

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = data[0].map((d, i) => {
    return {
      header: d,
      key: String(i),
      width: widths[i] || 20,
      style: {
        alignment: {
          wrapText: true,
        },
      },
    };
  });

  worksheet.addRows(data.slice(1));

  if (mergeCells.length > 0) {
    mergeCells.forEach(mergeCell => {
      worksheet.mergeCells(mergeCell);
    });
  }

  workbook.xlsx.writeBuffer().then(data => {
    const blob = new Blob([data], { type: EXCEL_TYPE });

    FileSaver.saveAs(blob, `fromc_${getNowYMD()}${EXCEL_EXTENSION}`);
  });
}

export async function readExcel(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer);

  return workbook;
}

export function decodeToken(token: string) {
  return decode<Token>(token);
}

export function getAdminProfile() {
  if (getToken()) {
    const decode = decodeToken(getToken());

    if (decode.USER_ROLE === 'ROLE_ADMIN') {
      return true;
    }
  } else {
    return undefined;
  }
}

export function setPagingIndex(totalElements: number, page: number, size: number, index: number) {
  return totalElements - (index + page * size);
}
