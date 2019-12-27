import { EventStatus, ShippingCompany } from 'enums';
import { UpdateFileObject, CreateFileObject, FileObject } from './FileObject';
import { ResponseCelebReview } from './CelebReview';
import { ResponseProduct, SearchProductForOrder } from './Product';
import { ResponseEventNotice } from './EventNotice';
import { ResponseBrandForEvent, ResponseBrand, BrandInfo } from './Brand';
import { ResponseClientAccount } from './Account';

export interface CreateEvent {
  name: string;
  choiceReview: string;
  brand: BrandInfo;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
  shippingCompany: ShippingCompany;
  shippingScheduled: string;
  images?: CreateFileObject[];
}

export interface ResponseEvent extends ResponseEventForList {
  targetAmount: number;
  choiceReview: string;
  detail: string;
  videoUrl: string;
  shippingCompany: string;
  shippingFeeInfo: ResponseShippingFeeInfo;
  images: FileObject[];
  celebReview: ResponseCelebReview;
  products: ResponseProduct[];
  likeCnt: number;
  eventNotices: ResponseEventNotice[];
  creator: ResponseEventCreator;
  productProvisions: [];
  shippingPeriod: string;
  shippingScheduled: string;
  cancellationExchangeReturnRegulationAgree: boolean;
  cancellationExchangeReturnAgree: boolean;
  turn: number;
}

export interface ResponseEventCreator {
  loginId: string;
  avatar: FileObject;
  username: string;
  sns: ResponseEventCreatorSns;
}

export interface ResponseEventCreatorSns {
  instagramFollowers: string;
  youtubeSubscriberCount: string;
}

export interface ResponseEventForList {
  eventId: number;
  eventUrl:string;
  name: string;
  eventStatus: EventStatus;
  turn: number;
  brand: ResponseBrandForEvent;
  salesStarted: string;
  salesEnded: string;
  created: string;
  creator: ResponseEventCreator;
  products: ResponseProduct[];
}
export interface ResponseEventForUrl {
  eventId: number;
  eventUrl:string;
  name: string;
  brand: ResponseBrandForEvent;
  salesStarted: string;
  salesEnded: string;
  creator: ResponseEventCreator;
}

export interface ResponseEventForOrders {
  brand: ResponseBrand;
  images: FileObject[];
  name: string;
  creator: ResponseClientAccount;
  eventStatus: EventStatus;
}
export interface ResponseEventForReview {
  eventId: number;
  images: FileObject[];
  name: string;
  brand: ResponseBrand;
}

export interface ResponseEventForQna {
  name: string; // 공구명
}

export interface ResponseEventForShipping {
  name: string;
  brand: ResponseBrand;
}

export interface CreateCopyEvent {
  eventId: number;
  salesStarted: string;
  salesEnded: string;
  shippingScheduled: string;
}

export interface ResponseCopyEvent {
  eventId: number;
}

export interface UpdateEvent {
  name: string;
  choiceReview: string;
  brand: BrandInfo;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
  shippingCompany: string;
  shippingScheduled: string;
  images?: UpdateFileObject[];
}

export interface SearchEvent {
  name?: string;
  brandName?: string;
  salesStarted: string;
  salesEnded: string;
  eventStatuses?: EventStatus[];
  accountIds?:number[];
  brandIds?:number[];
}

export interface SearchEventForOrder {
  name: string;
  product: SearchProductForOrder;
}

export interface UpdateEventStatus {
  eventStatus: EventStatus;
}

export interface ResponseShippingFeeInfo {
  shippingFee: number;
  shippingFreeCondition: number;
}

export interface UpdateEventShippingFeeInfo {
  shippingFee: number;
  shippingFreeCondition: number;
}

export interface UpdateEventShippingInfo {
  shippingPeriod: string;
  cancellationExchangeReturnRegulationAgree: boolean;
  cancellationExchangeReturnAgree: boolean;
}

export interface UpdateEventShipping {
  shippingFee: number;
}


export interface GetSearchEventByUrl {
  eventUrl: string;
}