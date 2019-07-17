import { ShippingStatus } from 'enums';

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
