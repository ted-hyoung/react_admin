// todo : 추후 상품 이미지 관련 CommonFile.ts 반영 필요
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
}

export interface ResponseOption {
  optionId: number;
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
  options: CreateOption[]
}

export interface CreateOption {
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}