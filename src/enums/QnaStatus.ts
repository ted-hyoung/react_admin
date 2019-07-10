export enum QnaStatus {
  WAIT = '답변대기',
  COMPLETE = '답변완료',

  '답변대기' = 'WAIT',
  '답변완료' = 'COMPLETE',
}

export const QNA_STATUS_OPTIONS = [
  { name: '전체', value: '' },
  { name: '답변대기', value: 'WAIT' },
  { name: '답변완료', value: 'COMPLETE' },
];
