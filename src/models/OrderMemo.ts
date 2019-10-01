import { ImportanceCode } from 'enums/ImportanceCode';
import { ResponseAccountForOrderMemo } from './Account';

export interface CreateOrderMemo {
  orderMemoContents: string;
  importance: ImportanceCode;
}

export interface ResponseOrderMemoForOrder {
  orderMemoId: number;
  orderMemoContents: string;
  importance: ImportanceCode;
  created: string;
  creator: ResponseAccountForOrderMemo;
}

export interface UpdateOrderMemo {
  orderMemoContents: string;
  importance: ImportanceCode;
}

export interface DeleteOrderMemo {
  orderMemoIds: number[];
}
