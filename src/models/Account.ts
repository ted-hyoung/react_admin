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

export interface ResponseAccounts {
  created: string;
  userName: string;
  loginId: string;
  loginMethod: string;
  grade:string;
  phone: string;
  isAdvertise : boolean;
}

export interface SearchAccounts {
  username?: string;
  phone?: string;
  userId?: string;
  address?: string;
  signUpStartDate?: string;
  signUpEndDate?: string;
  startAge?: string;
  endAge?: string;
  totalOrderAmountStart?: string;
  totalOrderAmountEnd?: string;
  totalPaymentAmountStart?: string;
  totalPaymentAmountEnd?: string;
  totalOrderCountStart?: string;
  totalOrderCountEnd?: string;
  totalPaymentCountStart?: string;
  totalPaymentCountEnd?: string;
  orderStartDate?: string;
  orderEndDate?: string;
  firstOrder?: boolean;
  accessEndDate?: string;
  accessStartDate?: string;
}
