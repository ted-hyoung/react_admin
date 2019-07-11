// base
import { produce } from 'immer';
import { AnyAction } from 'redux';
import { createAsyncAction, createReducer, PayloadAction, action } from 'typesafe-actions';
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
  GetRequestPayload,
  UpdateRequestPayload,
  UpdateEvent,
} from 'types';

import { EventStatus } from 'enums';

export interface EventState {
  events: PageWrapper<ResponseEventForList>;
  event: ResponseEvent;
}

// 공구 생성
export const createEventAsync = createAsyncAction(
  Actions.CREATE_EVENT_REQUEST,
  Actions.CREATE_EVENT_SUCCESS,
  Actions.CREATE_EVENT_FAILURE,
)<CreateRequestPayload<CreateEvent>, AxiosResponse, AxiosError>();

// 공구 목록 조회
export const getEventsAsync = createAsyncAction(
  Actions.GET_EVENTS_REQUEST,
  Actions.GET_EVENTS_SUCCESS,
  Actions.GET_EVENTS_FAILURE,
)<GetListRequestPayload, AxiosResponse, AxiosError>();

// 공구 조회
export const getEventByIdAsync = createAsyncAction(
  Actions.GET_EVENT_REQUEST,
  Actions.GET_EVENT_SUCCESS,
  Actions.GET_EVENT_FAILURE,
)<GetRequestPayload, AxiosResponse, AxiosError>();

// 공구 수정
export const updateEventByIdAsync = createAsyncAction(
  Actions.UPDATE_EVENT_REQUEST,
  Actions.UPDATE_EVENT_SUCCESS,
  Actions.UPDATE_EVENT_FAILURE,
)<UpdateRequestPayload<UpdateEvent>, AxiosResponse, AxiosError>();

export const clearEvent = action(Actions.CLEAR_EVENT);

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
    targetAmount: 0,
    videoUrl: '',
    shippingFeeInfo: {
      shippingFee: 0,
      shippingFreeCondition: 0,
    },
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
    case Actions.GET_EVENT_SUCCESS: {
      return produce(state, draft => {
        draft.event = action.payload;
      });
    }
    case Actions.CLEAR_EVENT: {
      return produce(state, draft => {
        draft.event = initialState.event;
      });
    }
    default: {
      return state;
    }
  }
};
