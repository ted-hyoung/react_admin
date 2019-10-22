// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  ExpGroupAction,
  GET_EXP_GROUPS_SUCCESS,
  GET_EXP_GROUPS_BY_ID_SUCCESS,
  CLEAR_STORE_EXP_GROUP,
  GET_EXP_GROUPS_FOR_EVENT_SUCCESS,
  GET_EXP_GROUPS_BY_EVENT_SUCCESS,
  CLEAR_STORE_SEARCH_EXP_GROUP,
} from '../action/expGroup.action';

// models
import {
  ResponseExperienceGroups,
  PageWrapper,
  ResponseExperienceGroup,
  ResponseSearchExperienceGroupForEventNoConsumer,
  Indexable,
} from 'models';

export interface ExpGroupState extends Indexable {
  expGroup: ResponseExperienceGroup | null;
  eventExpGroups: PageWrapper<ResponseSearchExperienceGroupForEventNoConsumer>;
  expGroups: PageWrapper<ResponseExperienceGroups>;
  searchExpGroup: PageWrapper<ResponseSearchExperienceGroupForEventNoConsumer>;
}

const initialState: ExpGroupState = {
  expGroup: null,
  eventExpGroups: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  expGroups: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  searchExpGroup: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
};

export default createReducer<ExpGroupState, ExpGroupAction>(initialState, {
  [GET_EXP_GROUPS_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroup = action.payload;
    }),
  [GET_EXP_GROUPS_BY_EVENT_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.eventExpGroups = action.payload;
    }),
  [GET_EXP_GROUPS_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroups = action.payload;
    }),
  [GET_EXP_GROUPS_FOR_EVENT_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.searchExpGroup = action.payload;
    }),
  [CLEAR_STORE_EXP_GROUP]: state =>
    produce(state, draft => {
      draft.expGroup = initialState.expGroup;
    }),
  [CLEAR_STORE_SEARCH_EXP_GROUP]: state =>
    produce(state, draft => {
      draft.searchExpGroup = initialState.searchExpGroup;
    }),
});
