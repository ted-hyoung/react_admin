import { FileObject } from './FileObject';
import { Role } from 'enums/Role';
import { PaymentMethod, PaymentStatus, ShippingStatus, SocialProviderCode } from '../enums';
import { PageWrapper } from './index';

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
  username: string;
  consumerId: string;
  loginId: string;
  socialProvider: SocialProviderCode;
  phone: string;
  marketingInfoAgree : boolean;
}

export interface ResponseDetailAccount {
  consumerId: string;
  created: string;
  loginId: string;
  username: string;
  phone: string;
  email: string;
  socialProvider: SocialProviderCode;
  marketingInfoAgree : boolean;
}

export interface ResponseOrdersForAccount {
  loginId: string;
  username: string;
  totalOrderCompleteAmount:number;
  orders: PageWrapper<ResponseOrdersAccount>;
}

export interface ResponseOrdersAccount {
  orderId: number;
  created: string;
  orderNo: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatuses: PaymentStatus;
  shippingStatuses: ShippingStatus;
}

export interface SearchAccounts {
  age?: string;
  consumerAccessDateEnded?: string;
  consumerAccessDateStarted?: string;
  consumerCreatedEnded?: string;
  consumerCreatedStarted?: string;

  firstOrder?: boolean;
  orderCreateEnded?: string;
  orderCreateStarted?: string;
  orderSearch?: string;
  orderTotalEnded?: number;
  orderTotalStarted?: number;
  username?: string;
  phone?: string;
}
