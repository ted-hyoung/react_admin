import { CreateFileObject, FileObject, UpdateFileObject } from './FileObject';
import { SearchOptionForOrder } from './Option';
import { PageWrapper, ResponseManagementOrdersStatisticsDailySales, ResponseOrder } from './index';

export interface ResponseProduct {
  productId: number;
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  soldOut: boolean;
  freebie: string;
  enableOption: boolean;
  options: ResponseOption[];
  images: FileObject[];
}

export interface ResponseOption {
  optionId: number;
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface CreateProduct {
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  freebie: string;
  enableOption: boolean | number;
  options: CreateOption[];
  images: CreateFileObject[];
}

export interface CreateOption {
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface UpdateProduct {
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  freebie: string;
  enableOption: boolean | number;
  options: UpdateOption[];
  images: UpdateFileObject[];
  updateDisabledOptionStock: number;
}

export interface UpdateOption {
  optionId: number | null;
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

export interface ResponseOrderItemProductForReview {
  images: FileObject[];
  productId: number;
  productName: string;
}

export interface SearchProductForOrder {
  productId: number;
  option: SearchOptionForOrder;
}

export interface ResponseManagementProductStatistics {
  productId: number;
  name: string;
  productName: string;
  enableOption: boolean;
  totalSalesAmount: number;
  discountSalesPrice: number;
  totalSalesQuantity: number;
  options: ProductOptions[]
}
export interface ProductOptions {
  "optionName": string;
  "totalSalesAmount": number;
  "salesPrice": number;
  "totalSalesQuantity": number;
  "salesRatio": number;
}

export interface ProductTables {
  "name": string;
  "productName": string;
  "optionName": string;
  "salesPrice": string;
  "totalSalesQuantity": number;
  "totalSalesAmount": string;
}

// 의류
export interface ClothingTables {
  "modelName" : string;
  "material" : string;
  "color" : string;
  "size" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "manufacturingDate" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 신발
export interface ShoesTables {
  "modelName" : string;
  "material" : string;
  "color" : string;
  "size" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 가방
export interface BAGTables {
  "modelName" : string;
  "kind" : string;
  "material" : string;
  "color" : string;
  "size" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 패션잡화(모자, 벨트, 악세사리)
export interface FashionItemTables {
  "modelName" : string;
  "kind" : string;
  "material" : string;
  "size" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 의료기기
export interface MedicalAppliancesTables {
  "modelName" : string;
  "medicalProvision" : {
  "medicalPermissionReportNumber" : string;
    "voltagePowerConsumption" : string;
},
  "kcCertified" : string;
  "sameModelLaunchDate" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "usePurposeHow" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 화장품
export interface CosmeticsTables {
  "modelName" : string;
  "cosmeticsProvision" : {
  "majorIssue" : string;
    "useDeadLine" :string;
    "ingredient" : string;
    "foodMedicineSafetyAudit" : string;
},
  "usePurposeHow" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "consumerConsultationNumber" : string;
}

// 귀금속/보석/시계류
export interface DecorativeItemTables {
  "modelName" : string;
  "material" : string;
  "weight" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "size" : string;
  "handlingSafetyPrecautions" : string;
  "jewelryProvision" : {
  "jewelryMainSpecification" : string;
    "clockMainSpecification" : string;
    "guaranteeProvision" : string;
},
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 가공식품
export interface ProcessedFoodTables {
  "modelName" : string;
  "foodType" : string;
  "manufacturerCountry" : string;
  "manufacturingDate" : string;
  "weight" : string;
  "rawMaterialContent" : string;
  "nutritionalInformation" : string;
  "transgenic" : string;
  "notationAdvertisementSideEffectOccurrence" : string;
  "importedFoodMedicineLaw" : string;
  "consumerConsultationNumber" : string;
}

// 건강기능식품
export interface HealthFoodTables {
  "modelName" : string;
  "foodType" : string;
  "manufacturerCountry" : string;
  "manufacturingDate" : string;
  "weight" : string;
  "rawMaterialContent" : string;
  "nutritionalInformation" : string;
  "heathProcessedFoodProvision" : {
  "functionalInformation" :string;
    "diseaseTreatmentMedicationNotContent" : string;
},
  "handlingSafetyPrecautions" : string;
  "transgenic" : string;
  "importedFoodMedicineLaw" : string;
  "consumerConsultationNumber" : string;
}

// 영유아용품
export interface InfantItemTables {
  "modelName" : string;
  "kcCertified" : string;
  "weight" : string;
  "color" : string;
  "material" : string;
  "infantSupplyProvision" : {
  "ageOfUseOrWeightRange" : string;
},
  "sameModelLaunchDate" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "handlingSafetyPrecautions" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 스포츠용품
export interface SportsItemTables {
  "modelName" : string;
  "weight" : string;
  "color" : string;
  "material" : string;
  "sportSupplyProvision" : {
  "configuration" : string;
    "detailSpecification" : string;
},
  "sameModelLaunchDate" : string;
  "manufacturer" : string;
  "manufacturerCountry" : string;
  "qualityAssuranceCriteria" : string;
  "serviceManagerNumber" : string;
}

// 기타 재화
export interface EtcTables {
  "etcProvision" : {
  "legalCertification" : string;
},
  "manufacturerCountry" : string;
  "manufacturer" : string;

}


