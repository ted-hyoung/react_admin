export interface ResponseList<T> {
  content: T[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size?: number;
}
