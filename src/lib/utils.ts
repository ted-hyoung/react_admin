import { fileUrl } from './protocols';

export const calcStringByte = (str: string) => {
  if (str) {
    return String(str).length;
  } else {
    return 0;
  }
};
export const dateFormat = 'YYYY-MM-DD HH:mm:ss';

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
