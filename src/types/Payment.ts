import { PaymentMethod, PaymentStatus } from 'enums';

export interface ResponsePaymentForOrders {
  paymentStatus: PaymentStatus;
  paymentDate: string;
  totalAmount: number;
}

export interface ResponsePaymentForShipping {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}
