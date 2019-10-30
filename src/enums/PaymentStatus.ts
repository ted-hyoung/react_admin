export enum PaymentStatus {
  READY = '결제 대기',
  CANCEL = '주문 취소',
  COMPLETE = '결제 완료',
  REFUND_COMPLETE = '환불 완료',

  '결제 대기' = 'READY',
  '주문 취소' = 'CANCEL',
  '결제 완료' = 'COMPLETE',
  '환불 완료' = 'REFUND_COMPLETE',
}

export const PAYMENT_STATUSES = [
  { label: '결제 대기', value: 'READY' },
  { label: '주문 취소', value: 'CANCEL' },
  { label: '결제 완료', value: 'COMPLETE' },
  { label: '환불 완료', value: 'REFUND_COMPLETE' },
];

export const DEFAULT_PAYMENT_STATUSES = ['READY', 'CANCEL', 'COMPLETE', 'REFUND_COMPLETE'];