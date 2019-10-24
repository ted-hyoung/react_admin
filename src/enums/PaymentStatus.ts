export enum PaymentStatus {
  READY = '결제 대기',
  CANCEL = '결제 취소',
  COMPLETE = '결제 완료',
  REFUND_REQUEST = '환불 요청',
  REFUND_COMPLETE = '환불 완료',
  VIRTUAL_ACCOUNT_READY = '입금 대기',
  VIRTUAL_ACCOUNT_COMPLETE = '입금 완료',
  VIRTUAL_ACCOUNT_REFUND_REQUEST = '취소 요청',
  VIRTUAL_ACCOUNT_REFUND_COMPLETE = '취소 완료',

  '결제 대기' = 'READY',
  '결제 취소' = 'CANCEL',
  '결제 완료' = 'COMPLETE',
  '환불 요청' = 'REFUND_REQUEST',
  '환불 완료' = 'REFUND_COMPLETE',
  '입금 대기' = 'VIRTUAL_ACCOUNT_READY',            // 입금전 결제 대기
  '입금 완료' = 'VIRTUAL_ACCOUNT_COMPLETE',         // 입금완료: 결제 완료
  '취소 요청' = 'VIRTUAL_ACCOUNT_REFUND_REQUEST',   // 입금후 주문취소 요청: 환불 요청
  '취소 완료' = 'VIRTUAL_ACCOUNT_REFUND_COMPLETE',  // 입금후 주문취소 및 환불완료: 환불 완료
}

export const PAYMENT_STATUSES = [
  { label: '결제 대기', value: 'READY' },
  { label: '결제 취소', value: 'CANCEL' },
  { label: '결제 완료', value: 'COMPLETE' },
  { label: '환불 요청', value: 'REFUND_REQUEST' },
  { label: '환불 완료', value: 'REFUND_COMPLETE' },
];

export const DEFAULT_PAYMENT_STATUSES = ['READY', 'CANCEL', 'COMPLETE', 'REFUND_REQUEST', 'REFUND_COMPLETE'];

// VIRTUAL_ACCOUNT


export const PAYMENT_VIRTUAL_STATUSES = [
  { label: '입금 대기', value: 'VIRTUAL_ACCOUNT_READY' },
  { label: '주문 취소', value: 'CANCEL' },
  { label: '입금 완료', value: 'VIRTUAL_ACCOUNT_COMPLETE' },
  { label: '취소 요청', value: 'VIRTUAL_ACCOUNT_REFUND_REQUEST' },
  { label: '취소 완료', value: 'VIRTUAL_ACCOUNT_REFUND_COMPLETE' },
];

export const PAYMENT_STATUSES_TOTAL = [
  { label: '결제 취소', value: 'CANCEL' },
  { label: '결제 완료', value: 'COMPLETE' },
  { label: '환불 요청', value: 'REFUND_REQUEST' },
  { label: '환불 완료', value: 'REFUND_COMPLETE' },
  { label: '입금 대기', value: 'VIRTUAL_ACCOUNT_READY' },
  { label: '입금 완료', value: 'VIRTUAL_ACCOUNT_COMPLETE' },
  { label: '취소 요청', value: 'VIRTUAL_ACCOUNT_REFUND_REQUEST' },
  { label: '취소 완료', value: 'VIRTUAL_ACCOUNT_REFUND_COMPLETE' },

];

export const DEFAULT_PAYMENT_STATUSES_TOTAL = ['CANCEL', 'COMPLETE', 'REFUND_REQUEST', 'REFUND_COMPLETE', 'VIRTUAL_ACCOUNT_READY', 'VIRTUAL_ACCOUNT_COMPLETE', 'VIRTUAL_ACCOUNT_REFUND_REQUEST', 'VIRTUAL_ACCOUNT_REFUND_COMPLETE'];

