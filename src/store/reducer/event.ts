// base
import { produce } from 'immer';
import { AnyAction } from 'redux';
import { createAsyncAction, createReducer, PayloadAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

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

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.CREATE_EVENT_SUCCESS: {
      return state;
    }
    case Actions.GET_EVENTS_SUCCESS: {
      return produce(state, draft => {
        draft.events = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};
