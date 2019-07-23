import { ResponseOrderItemProduct } from './Product';
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
