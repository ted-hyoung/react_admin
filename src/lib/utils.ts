import { Key } from 'react';

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
