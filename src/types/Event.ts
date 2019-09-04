import { EventStatus } from 'enums';
import { UpdateFileObject, CreateFileObject, FileObject } from './FileObject';
import { ResponseCelebReview } from './CelebReview';
import { ResponseProduct } from './Product';
import { ResponseEventNotice } from './EventNotice';
import { ResponseBrandForEvent, ResponseBrand, BrandInfo } from './Brand';

export interface CreateEvent {
  name: string;
  choiceReview: string;
  brand: BrandInfo;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
  images?: CreateFileObject[];
}

export interface ResponseEvent extends ResponseEventForList {
  targetAmount: number;
  choiceReview: string;
  detail: string;
  videoUrl: string;
  shippingFeeInfo: ResponseShippingFeeInfo;
  images: FileObject[];
  celebReview: ResponseCelebReview;
  products: ResponseProduct[];
  eventNotices: ResponseEventNotice[];
}

export interface ResponseEventForList {
  eventId: number;
  name: string;
  eventStatus: EventStatus;
  turn: number;
  brand: ResponseBrandForEvent;
  salesStarted: string;
  salesEnded: string;
  created: string;
}

export interface ResponseEventForOrders {
  brand: ResponseBrand;
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

export interface UpdateEvent {
  name: string;
  choiceReview: string;
  brand: BrandInfo;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
  images?: UpdateFileObject[];
}

export interface SearchEvent {
  name: string;
  brandName: string;
  salesStarted: string;
  salesEnded: string;
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
