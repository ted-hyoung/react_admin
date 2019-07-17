import { EventStatus } from 'enums';

export interface CreateEvent {
  name: string;
  choiceReview: string;
  brandName: string;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
}

export interface ResponseEvent extends ResponseEventForList {
  targetAmount: number;
  choiceReview: string;
  detail: string;
  videoUrl: string;
  shippingFeeInfo: any;
  images: any[];
  celebReview: any;
  products: any[];
  eventNotices: any[];
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

export interface UpdateEvent {
  name: string;
  choiceReview: string;
  brandName: string;
  salesStarted: string;
  salesEnded: string;
  targetAmount: number;
  detail?: string;
  videoUrl?: string;
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
