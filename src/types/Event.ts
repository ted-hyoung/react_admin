import { EventStatus } from 'enums';

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

export interface SearchEvent {
  name: string;
  brandName: string;
  salesStarted: string;
  salesEnded: string;
}
