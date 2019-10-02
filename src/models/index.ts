export * from './AsyncAction';
export * from './Event';
export * from './EventNotice';
export * from './Review';
export * from './Payload';
export * from './Qna';
export * from './Review';
export * from './Modal';
export * from './Account';
export * from './Contact';
export * from './CelebReview';
export * from './Product';
export * from './Order';
export * from './Payment';
export * from './FileObject';
export * from './Consumer';
export * from './Brand';

export interface PageWrapper<T> {
  content: T[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
