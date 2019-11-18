import { Indexable } from 'models';

export * from './EventStatus';
export * from './QnaStatus';
export * from './QnaOrderType';
export * from './Csr';
export * from './ProductMode';
export * from './ProductSold';
export * from './ProductNotice';
export * from './ShippingStatus';
export * from './PaymentStatus';
export * from './PaymentMethod';
export * from './ShippingCompany';
export * from './DateRange';
export * from './CardCode';
export * from './Role';
export * from './ImportanceCode';
export * from './PrizeStatus';
export * from './BankCode';
export * from './SocialProviderCode';



export function getEnumKeyByValue<T extends Indexable, V>(enumType: T, enumValue: V): string | undefined {
  const keys = Object.keys(enumType).filter(k => enumType[k] === enumValue);

  return keys.length > 0 ? keys[0] : undefined;
}
