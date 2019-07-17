import { ResponseShippingDestination, ResponseShippingForOrders } from './Shipping';
import { ResponseOrderItem } from './OrderItem';
import { ResponseOrderAccount } from './Account';
import { ResponsePaymentForOrders } from './Payment';
import { paymentStatus, ShippingStatus } from 'enums';

export interface ResponseOrder {
  orderId: number;
  shippingDestination: ResponseShippingDestination;
  orderItems: ResponseOrderItem[];
  account: ResponseOrderAccount;
  payment: ResponsePaymentForOrders;
  shipping: ResponseShippingForOrders;
}

export interface SearchOrder {
  startDate?: string;
  endDate?: string;
  orderId?: number;
  username?: string;
  recipient?: string;
  recipientPhone?: string;
  paymentStatuses?: paymentStatus[];
  shippingStatuses?: ShippingStatus[];
}
