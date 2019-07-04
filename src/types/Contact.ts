import { QnaStatus, CsrCategory } from 'enums';
import { ResponseAccount } from './Account';

export interface ResponseContactComment {
  contactCommentId: number;
  creator: ResponseAccount;
  created: string;
  comment: string;
}
export interface CreateContactComment {
  comment: string;
}

export interface UpdateContactComment {
  comment: string;
}

export interface ResponseContact {
  contactId: number;
  status: QnaStatus;
  category: CsrCategory;
  contents: string;
  creator: ResponseAccount;
  created: string;
  comment?: ResponseContactComment;
}

export interface SearchContact {
  status?: QnaStatus;
  category?: CsrCategory;
  keyword?: string;
}
