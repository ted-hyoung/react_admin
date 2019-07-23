import { CreateFileObject, UpdateFileObject } from './FileObject';

export interface ResponseProduct {
  productId: number;
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number,
  disabledOptionStock: number,
  disabledOptionSafeStock: number,
  disabled: boolean;
  soldOut: boolean;
  freebie: string;
  enableOption: boolean;
  options: ResponseOption[];
  images: UpdateFileObject[];
}

export interface ResponseOption {
  optionId?: number;
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface ResponseShippingFeeInfo {
  shippingFee: number;
  shippingFreeCondition: number;
}

export interface CreateProduct {
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  freebie: string;
  enableOption: boolean;
  options: CreateOption[];
  images:CreateFileObject[];
}

export interface CreateOption {
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface ResponseOrderItemProduct {
  productId: number;
  productName: string;
}