export * from './Event';
export * from './Review';
export * from './Payload';
export * from './Account';
export * from './Contact';
export * from './Modal';
export * from './CelebReview';

export interface PageWrapper<T> {
  content: Array<T>;
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
