export * from './Event';
export * from './Review';
export * from './Payload';
export * from './AsyncAction';
export * from './Product';

export interface PageWrapper<T> {
  content: Array<T>;
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}