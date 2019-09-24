export interface ResponseBrandForEvent {
  brandId: number;
  brandName: string;
}

export interface ResponseBrand {
  brandName: string;
}

export interface BrandInfo {
  brandId: number;
  brandName: string;
}

export interface ResponseManagementBrandStatistics {

  brandName : string;
  totalSalesAmount : number;
  totalOrderCompleteAmount : number;
  totalOrderCompleteCount : number;
  totalOrderCancelAmount : number;
  totalOrderCancelCount : number;
  totalSalesAmountAvg : number;
  totalOrderCompleteAmountAvg : number;
  totalOrderCompleteCountAvg : number;
  totalOrderCancelAmountAvg : number;
  totalOrderCancelCountAvg : number;
}
