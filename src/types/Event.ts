import { EventStatus } from 'enums';
import { UpdateFileObject, CreateFileObject, FileObject } from './FileObject';
import { ResponseCelebReview } from './CelebReview';
import { ResponseProduct, ResponseShippingFeeInfo } from './Product';
import { ResponseEventNotice } from './EventNotice';

export interface CreateEvent {
  name: string;
  choiceReview: string;
  brandName: string;
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
  brandName: string;
  salesStarted: string;
  salesEnded: string;
  created: string;
}

export interface ResponseEventForOrders {
  brandName: string;
}

export interface UpdateEvent {
  name: string;
  choiceReview: string;
  brandName: string;
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
