import { ResponseShippingDestination, ResponseShippingForOrders } from './Shipping';
import { ResponseOrderItem, ResponseClientOrderItem, ResponseClientOrderItemForReview } from './OrderItem';
import { ResponseOrderAccount } from './Account';
import { ResponsePaymentForOrders, ResponsePaymentForShipping } from './Payment';
import { PaymentStatus, ShippingStatus } from 'enums';
import { ResponseEventForOrders } from './Event';
import { ResponseOrderConsumer } from './Consumer';

export interface ResponseOrder {
  orderId: number;
  orderNo: string;
  shippingDestination: ResponseShippingDestination;
  orderItems: ResponseOrderItem[];
  consumer: ResponseOrderAccount;
  event: ResponseEventForOrders;
  payment: ResponsePaymentForOrders;
  shipping: ResponseShippingForOrders;
}

export interface ResponseOrderForShipping {
  orderNo: string;
  memo: string;
  orderItems: ResponseOrderItem[];
  consumer: ResponseOrderConsumer;
  payment: ResponsePaymentForShipping;
}

export interface SearchOrder {
  startDate?: string;
  endDate?: string;
  orderId?: number;
  username?: string;
  recipient?: string;
  recipientPhone?: string;
  paymentStatuses?: PaymentStatus[];
  shippingStatuses?: ShippingStatus[];
}

export interface ResponseOrderForReview {
  orderId: number;
  orderNo: string;
  created: string;
  orderItems: ResponseClientOrderItemForReview[];
}

export interface ResponseManagementOrdersStatisticsDailySales {
  ordersTable: ResponseManagementOrdersDailySalesTable[];
  ordersCharts: ResponseManagementOrdersDailySalesChart[];
  ordersExcels: ResponseManagementOrdersDailySalesExcel[];
}

export interface ResponseManagementOrdersDailySalesTable {
  totalSalesAmount: number;
  totalSalesCount: number;
  totalOrderCompleteAmount: number;
  totalOrderCompleteCount: number;
  totalOrderCancelAmount: number;
  totalOrderCancelCount: number;
}

export interface ResponseManagementOrdersDailySalesChart {
  paymentDate: string;
  totalOrderCompleteAmount: number;
  totalOrderCompleteCount: number;
  totalOrderCancelAmount: number;
  totalOrderCancelCount: number;
}

export interface ResponseManagementOrdersDailySalesExcel {
  paymentDate: string;
  totalOrderCompleteAmount: number;
  totalOrderCompleteCount: number;
  totalOrderCancelAmount: number;
  totalOrderCancelCount: number;
}
