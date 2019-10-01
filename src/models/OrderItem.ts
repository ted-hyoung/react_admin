import { ResponseOrderItemProduct, ResponseOrderItemProductForReview } from './Product';
import { ResponseOrderItemOption } from './Option';

export interface ResponseOrderItem {
  orderItemId: number;
  product: ResponseOrderItemProduct;
  option: ResponseOrderItemOption;
  productSalePrice: number;
  optionSalePrice: number;
  totalSalePrice: number;
  quantity: number;
}

export interface ResponseClientOrderItem {
  orderItemId: number;
  product: ResponseOrderItemProduct;
  option: ResponseOrderItemOption;
}

export interface ResponseClientOrderItemForReview {
  orderItemId: number;
  product: ResponseOrderItemProductForReview;
  option: ResponseOrderItemOption;
}
