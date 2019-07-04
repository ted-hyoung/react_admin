export interface GetListRequestPayload<T = {}> {
  page: number;
  size: number;
  searchCondition?: T;
}

export interface GetRequestPayload {
  id: number;
}

export interface CreateRequestPayload<T> {
  data: T;
  parentId?: number;
}

export interface UpdateRequestPayload<T> {
  id: number;
  data: T;
}

export interface DeleteRequestPayload {
  id: number;
}
