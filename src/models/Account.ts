import { FileObject } from './FileObject';
import { Role } from 'enums/Role';

export interface LoginAccount {
  loginId: string;
  password: string;
}

export interface ResponseAccount {
  loginId: string;
}

export interface ResponseOrderAccount {
  username: string;
}

export interface ResponseTokens {
  access_token: string;
  refresh_token: string;
}

export interface ResponseClientAccount {
  username: string;
  avatar: FileObject;
}

export interface ResponseAccountForOrderMemo {
  loginId: string;
  role: Role;
}

export interface ResponseAccountCelebForList {
  loginId: string;
  username: string;
  accountId: string;
}
