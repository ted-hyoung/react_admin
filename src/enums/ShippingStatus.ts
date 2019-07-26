export enum ShippingStatus {
  READY = '배송 준비중',
  IN_PROGRESS = '배송중',
  COMPLETE = '배송 완료',

  '배송 준비중' = 'READY',
  '배송중' = 'IN_PROGRESS',
  '배송 완료' = 'COMPLETE',
}

export const SHIPPING_STATUSES = [
  { label: '배송 준비중', value: 'READY' },
  { label: '배송중', value: 'IN_PROGRESS' },
  { label: '배송완료', value: 'COMPLETE' },
];

export const DEFAULT_SHIPPING_STATUSES = ['READY', 'IN_PROGRESS', 'COMPLETE'];
