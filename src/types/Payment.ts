import { PaymentMethod, PaymentStatus } from 'enums';

export interface ResponsePaymentForOrders {
  paymentId: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  totalAmount: number;
}

export interface ResponsePaymentForShipping {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}
