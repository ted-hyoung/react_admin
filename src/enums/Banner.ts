export enum BannerExposeStatus {
  TOTAL ='전체',
  WAIT ='노출 대기',
  IN_PROGRESS ='노출 중',
  DISABLE ='사용 안함',
  '전체'= 'TOTAL',
  '노출 대기'='WAIT',
  '노출 중'='IN_PROGRESS',
  '사용 안함' ='DISABLE',
}

export enum BannerOrder {
  CREATED_DESC ='최근 등록일순',
  EXPOSE_STARTED_ASC ='시작일 오래된 순',
  EXPOSE_ENDED_DESC ='종료일 많이 남은 순',
  '최근 등록일순'='CREATED_DESC',
  '시작일 오래된 순'='EXPOSE_STARTED_ASC',
  '종료일 많이 남은 순' ='EXPOSE_ENDED_DESC',
}
export const BannerOrderJson = [
    {key: 'CREATED_DESC', value:'최근 등록일순'},
    {key: 'EXPOSE_STARTED_ASC', value:'시작일 오래된 순'},
    {key: 'EXPOSE_ENDED_DESC', value:'종료일 많이 남은 순'},
  ];

export const BannerExposeJson = [
    {key: 'TOTAL', value:'전체'},
    {key: 'WAIT', value:'노출 대기'},
    {key: 'IN_PROGRESS', value:'노출 중'},
    {key: 'DISABLE', value:'사용 안함'},
  ];

export enum BannerType {
  TOTAL ='전체',
  NOTICE ='공지',
  EVENT_PROGRESS ='이벤트',
  EVENT ='공구',
  '전체'= 'TOTAL',
  '공지'='NOTICE',
  '이벤트'='EVENT_PROGRESS',
  '공구' ='EVENT',
}

export const BannerTypeJson = [
    {key: 'TOTAL', value:'전체'},
    {key: 'NOTICE', value:'공지'},
    {key: 'EVENT_PROGRESS', value:'이벤트'},
    {key: 'EVENT', value:'공구'},
  ];