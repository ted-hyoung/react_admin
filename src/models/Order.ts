import { ResponseShippingDestination, ResponseShippingForOrders, ResponseClientShippingForOrder } from './Shipping';
import { ResponseOrderItem, ResponseClientOrderItem, ResponseClientOrderItemForReview } from './OrderItem';
import { ResponseOrderAccount } from './Account';
import { ResponsePaymentForOrders, ResponsePaymentForShipping, ResponseClientPaymentForOrder } from './Payment';
import { PaymentStatus, ShippingStatus, PaymentMethod } from 'enums';
import { ResponseEventForOrders, ResponseEventForShipping, SearchEventForOrder } from './Event';
import { ResponseOrderConsumer } from './Consumer';
import { ResponseOrderMemoForOrder } from './OrderMemo';
import { UpdateShippingDestination } from './ShippingDestination';

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

export interface ResponseClientOrder {
  orderId: number;
  orderNo: string;
  orderItems: ResponseOrderItem[];
  orderMemos: ResponseOrderMemoForOrder[];
  memo: string;
  created?: string;
  payment?: ResponseClientPaymentForOrder;
  shipping?: ResponseClientShippingForOrder;
  shippingDestination?: ResponseShippingDestination;
  event?: ResponseEventForOrders;
  consumer?: ResponseOrderConsumer;
}

export interface ResponseOrderForShipping {
  orderNo: string;
  memo: string;
  event: ResponseEventForShipping;
  orderItems: ResponseOrderItem[];
  consumer: ResponseOrderConsumer;
  shippingDestination: ResponseShippingDestination;
  payment: ResponsePaymentForShipping;
}

export interface SearchOrder {
  startDate?: string;
  endDate?: string;
  orderNo?: number;
  username?: string;
  recipient?: string;
  recipientPhone?: string;
  phone?: string;
  invoice?: string;
  events?: SearchEventForOrder[];
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
  orders: ResponseManagementOrdersDailySalesExcel[];
  ordersCharts: ResponseManagementOrdersDailySalesChart[];
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

export interface DataSets {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  type?: string;
  data?: any[];
}

export interface ChartData {
  labels: string[];
  datasets: DataSets[];
}

export interface ChartData2 {
  labels: (string[])[];
  datasets: DataSets[];
}

export interface UpdateOrderForShipping {
  orderNo: string;
}

export interface UpdateOrderShippingDestination {
  memo: string;
  shippingDestination: UpdateShippingDestination;
}

export interface CheckAccount {
  refundAccountDepositor:string;
  refundAccountBank:string;
  refundAccountNumber:string;
}
