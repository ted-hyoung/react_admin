// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  ExpGroupAction,
  CREATE_EXP_GROUP_SUCCESS,
  GET_EXP_GROUPS_SUCCESS,
  GET_EXP_GROUPS_BY_ID_SUCCESS,
  UPDATE_EXP_GROUPS_BY_ID_SUCCESS,
  CLEAR_EXP_GROUP_DETAIL,
  UPDATE_EXP_GROUP_CONSUMERS_SUCCESS,
} from '../action/expGroup.action';

// models
import { ResponseExperienceGroups, PageWrapper, ResponseExperienceGroup } from 'models';

export interface ExpGroupState {
  expGroups: PageWrapper<ResponseExperienceGroups>;
  expGroup: ResponseExperienceGroup | null;
}

const initialState: ExpGroupState = {
  expGroups: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  expGroup: null,
};

export default createReducer<ExpGroupState, ExpGroupAction>(initialState, {
  [GET_EXP_GROUPS_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroups = action.payload;
    }),
  [GET_EXP_GROUPS_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroup = action.payload;
    }),
  [CLEAR_EXP_GROUP_DETAIL]: state =>
    produce(state, draft => {
      draft.expGroup = initialState.expGroup;
    }),
});
