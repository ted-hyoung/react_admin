export * from './AsyncAction';
export * from './Event';
export * from './Review';
export * from './Payload';
export * from './Qna';
export * from './Review';
export * from './Modal';
export * from './Account';
export * from './Contact';
export * from './CelebReview';
export * from './Product';

export interface PageWrapper<T> {
  content: T[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
