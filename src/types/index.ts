export * from './Review';
export * from './Payload';
export * from './Account';
export * from './Contact';
export * from './Event';
export * from './Modal';

export interface PageWrapper<T> {
  content: T[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
