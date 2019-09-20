export enum EventStatus {
  READY = '진행 예정',
  IN_PROGRESS = '진행 중',
  COMPLETE = '종료',

  '진행 예정' = 'READY',
  '진행 중' = 'IN_PROGRESS',
  '종료' = 'COMPLETE',
}
export const EVENT_STATUS = [
  { label: '진행 예정', value: 'READY' },
  { label: '진행 중', value: 'IN_PROGRESS' },
  { label: '종료', value: 'COMPLETE' },
];

export const DEFAULT_EVENT_STATUSES = ['READY', 'IN_PROGRESS', 'COMPLETE'];
