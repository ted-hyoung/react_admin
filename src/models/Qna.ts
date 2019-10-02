import { QnaOrderType } from 'enums/QnaOrderType';
import { ResponseEventForQna } from './Event';
import { QnaStatus } from 'enums';

export interface ResponseQna {
  qnaId: number;
  qnaStatus: QnaStatus;
  event: ResponseEventForQna;
  contents: string;
  expose: boolean;
  enable?: boolean;
  orderType: QnaOrderType;
  sequence: number;
  created: string;
  qnaComment: QnaComment | null;
}

export interface QnaComment {
  qnaCommentId: number;
  comment: string;
  created: string;
  creator: QnaCommentCreator;
}

interface QnaCommentCreator {
  loginId: string;
  username: string;
}
