export interface RequestListAsync<T = {}> {
  page: number;
  size: number;
  searchCondition?: T;
}

export type RequestAsync = {
  id: number;
};

export type UpdateAsync<T> = {
  id: number;
  data: T;
};

export type DeleteAsync = {
  id: number;
};
