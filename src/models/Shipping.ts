import { ShippingStatus, ShippingCompany } from 'enums';
import { ResponseOrderForShipping, UpdateOrderForShipping } from './Order';

export interface ResponseShipping {
  shippingId: number;
  shippingCompany: ShippingCompany;
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
  shippingCompany: ShippingCompany;
  shippingStatus: ShippingStatus;
}

export interface ResponseClientShippingForOrder {
  shippingId: number;
  shippingStatus: ShippingStatus;
  shippingCompany: ShippingCompany;
  shippingFee: number;
  invoice: string;
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

export interface UpdateShippingExcelInvoice {
  invoice: string;
  shippingCompany: ShippingCompany;
  order: UpdateOrderForShipping;
}
