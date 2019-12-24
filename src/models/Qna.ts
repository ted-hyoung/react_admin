import { QnaOrderType } from 'enums/QnaOrderType';
import { ResponseEventQnaGroup } from './Event';
import { QnaStatus } from 'enums';

export interface ResponseQna {
  no: number;
  qnaId: number;
  qnaStatus: QnaStatus;
  eventQnaGroup: ResponseEventQnaGroup;
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
