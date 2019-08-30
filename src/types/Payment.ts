import { PaymentMethod, PaymentStatus } from 'enums';

export interface ResponsePaymentForOrders {
  paymentId: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  totalAmount: number;
  nicePayment: ResponseNicePaymentForOrders;
}

export interface ResponsePaymentForShipping {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}

export interface ResponseNicePaymentForOrders {
  transactionId: string;
}
