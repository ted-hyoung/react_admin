import { PaymentMethod } from 'enums';

export interface ResponsePaymentForOrders {
  paymentDate: string;
  totalAmount: number;
}

export interface ResponsePaymentForShipping {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}
