import { QnaStatus, CsrCategory } from 'enums';
import { ResponseAccount } from './Account';

export interface ResponseContactComment {
  contactCommentId: number;
  creator: ResponseAccount;
  created: string;
  comment: string;
}

export interface ResponseContact {
  contactId: number;
  status: QnaStatus;
  category: CsrCategory;
  contents: string;
  comment: ResponseContactComment;
  creator: ResponseAccount;
  created: string;
}
