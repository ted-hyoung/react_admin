import { QnaStatus, CsrCategory } from 'enums';
import { ResponseAccount } from './Account';
import { FileObject } from './FileObject';
import { ResponseOrderForReview } from './Order';

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
  contactComment?: ResponseContactComment;
  images: FileObject[];
  order: ResponseOrderForReview;
}

export interface SearchContact {
  status?: QnaStatus;
  category?: CsrCategory;
  keyword?: string;
}

export interface CountContact {
  wait: number;
  complete: number;
}
