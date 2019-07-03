export interface GetListRequestPayload<T = {}> {
  page: number;
  size: number;
  searchCondition?: T;
}

export interface GetRequestPayload {
  id: number;
}

export interface UpdateRequestPayload<T> {
  id: number;
  data: T;
}

export interface DeleteRequestPayload {
  id: number;
}
