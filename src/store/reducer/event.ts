// base

import { produce } from 'immer';

import { createAsyncAction, PayloadAction } from 'typesafe-actions';

// actions

import * as Actions from 'store/action/eventAction';

// types

import {
  ResponseEventForList,
  GetListRequestPayload,
  PageWrapper,
  ResponseEvent,
  CreateRequestPayload,
  CreateEvent,
} from 'types';

import { AxiosError, AxiosResponse } from 'axios';

import { EventStatus } from 'enums';

export interface EventState {
  events: PageWrapper<ResponseEventForList[]>;
  event: ResponseEvent;
}

export const createEventAsync = createAsyncAction(
  Actions.CREATE_EVENT_REQUEST,

  Actions.CREATE_EVENT_SUCCESS,

  Actions.CREATE_EVENT_FAILURE,
)<CreateRequestPayload<CreateEvent>, AxiosResponse, AxiosError>();

export const getEventsAsync = createAsyncAction(
  Actions.GET_EVENTS_REQUEST,

  Actions.GET_EVENTS_SUCCESS,

  Actions.GET_EVENTS_FAILURE,
)<GetListRequestPayload, AxiosResponse, AxiosError>();

const initialState: EventState = {
  events: {
    content: [],

    first: false,

    last: false,

    totalElements: 0,

    totalPages: 0,

    page: 0,

    size: 10,
  },

  event: {
    eventId: 0,

    name: '',

    eventStatus: EventStatus[EventStatus.READY],

    turn: 0,

    brandName: '',

    salesStarted: '',

    salesEnded: '',

    created: '',

    choiceReview: '',

    detail: '',

    videoUrl: '',

    shippingFeeInfo: null,

    images: [],

    celebReview: null,

    products: [],

    eventNotices: [],
  },
};

export default (state = initialState, action: PayloadAction<string, AxiosResponse>) => {
  switch (action.type) {
    case Actions.GET_EVENTS_SUCCESS: {
      return produce(state, draft => {
        draft.events = action.payload.data;
      });
    }

    case Actions.CREATE_EVENT_SUCCESS: {
      return state;
    }

    default: {
      return state;
    }
  }
};
