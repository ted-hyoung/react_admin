import { EventStatus, ShippingCompany } from 'enums';
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
  shippingCompany: ShippingCompany;
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
  name: string;
  eventStatus: EventStatus;
  turn: number;
  brand: ResponseBrandForEvent;
  salesStarted: string;
  salesEnded: string;
  created: string;
  creator: ResponseEventCreator;
}

export interface ResponseEventForOrders {
  brand: ResponseBrand;
  name: string;
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
  shippingCompany: string;
  images?: UpdateFileObject[];
}

export interface SearchEvent {
  name?: string;
  brandName?: string;
  salesStarted: string;
  salesEnded: string;
  eventStatuses: EventStatus[];
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
