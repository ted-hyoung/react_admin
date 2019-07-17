export interface ResponseEventNotice {
  eventNoticeId?: number;
  contents: string;
}

export interface UpdateEventNotices {
  eventNotices: ResponseEventNotice[];
}
