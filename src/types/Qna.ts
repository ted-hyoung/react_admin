import { QnaOrderType } from 'enums/QnaOrderType';

export interface ResponseQna {
  qnaId: number;
  qnaStatus: string;
  eventName: string;
  contents: string;
  expose?: boolean;
  enable?: boolean;
  orderType: QnaOrderType;
  sequence: number;
  creator?: string;
  created?: string;
  qnaComment: QnaComment | null;
}

interface QnaComment {
  qnaCommentId: number;
  comment: string;
  created: string;
}
