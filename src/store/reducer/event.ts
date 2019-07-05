// base
import { produce } from 'immer';
import { createAsyncAction, PayloadAction } from 'typesafe-actions';

// actions
import * as Actions from 'store/action/eventAction';

// types
import { ResponseEventForList, GetListRequestPayload, PageWrapper } from 'types';
import { AxiosError } from 'axios';

export interface EventState {
  events: PageWrapper<ResponseEventForList>;
}

export const getEventsAsync = createAsyncAction(
  Actions.GET_EVENTS_REQUEST,
  Actions.GET_EVENTS_SUCCESS,
  Actions.GET_EVENTS_FAILURE,
)<GetListRequestPayload, EventState, AxiosError>();

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
};

export default (state = initialState, action: PayloadAction<string, EventState>) => {
  switch (action.type) {
    case Actions.GET_EVENTS_SUCCESS: {
      return produce(state, draft => {
        draft.events = action.payload.events;
      });
    }
    default: {
      return state;
    }
  }
};
