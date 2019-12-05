export interface ResponseEventNotice {
  eventNoticeId?: number;
  contents: string;
  shippingScheduledEnable: boolean;
}

export interface UpdateEventNotices {
  eventNotices: ResponseEventNotice[];
}
