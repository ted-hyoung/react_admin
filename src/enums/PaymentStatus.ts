export enum PaymentStatus {
  READY = '결제 대기',
  CANCEL = '결제 취소',
  COMPLETE = '결제 완료',
  // todo : 결제 취소 관련 Procress 나오면 반영 예정 (이종현)
  // REFUND_REQUEST = '환불 요청',
  // REFUND_COMPLETE = '환불 완료',

  '결제 대기' = 'READY',
  '결제 취소' = 'CANCEL',
  '결제 완료' = 'COMPLETE',
  // todo : 결제 취소 관련 Procress 나오면 반영 예정 (이종현)
  // '환불 요청' = 'REFUND_REQUEST',
  // '환불 완료' = 'REFUND_COMPLETE',
}

export const PAYMENT_STATUSES = [
  { label: '결제 대기', value: 'READY' },
  { label: '결제 취소', value: 'CANCEL' },
  { label: '결제 완료', value: 'COMPLETE' },

  // { label: '환불 요청', value: 'REFUND_REQUEST' },
  // { label: '환불 완료', value: 'REFUND_COMPLETE' },
];

export const DEFAULT_PAYMENT_STATUSES = ['READY', 'CANCEL', 'COMPLETE', 'REFUND_REQUEST', 'REFUND_COMPLETE'];
