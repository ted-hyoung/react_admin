import { ShippingStatus } from 'enums';
import { ResponseOrderForShipping } from './Order';

export interface ResponseShipping {
  shippingId: number;
  shippingCompany: string;
  invoice: string;
  shippingStatus: ShippingStatus;
  shippingFee: number;
  order: ResponseOrderForShipping;
}

export interface ResponseShippingDestination {
  recipientAddress: string;
  recipientAddressDetail: string;
  recipientPhone: string;
  recipientZipCode: string;
  recipient: string;
}

export interface ResponseShippingForOrders {
  shippingCompany: string;
  shippingStatus: ShippingStatus;
}

export interface SearchShipping {
  startDate?: string;
  endDate?: string;
  orderId?: number;
  username?: string;
  recipient?: string;
  recipientPhone?: string;
  shippingStatuses?: ShippingStatus[];
}
