// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  ExpGroupConsumerAction,
  GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS,
  GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS,
  GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_SUCCESS,
} from '../action/expGroupConsumer.action';

// models
import { ResponseSearchExperienceGroupConsumers, PageWrapper, ResponseExperienceGroupConsumers } from 'models';

export interface ExpGroupConsumerState {
  expGroupConsumer: ResponseExperienceGroupConsumers | null;
  expGroupConsumers: PageWrapper<ResponseSearchExperienceGroupConsumers>;
  expGroupConsumersExcel: ResponseSearchExperienceGroupConsumers[];
}

const initialState: ExpGroupConsumerState = {
  expGroupConsumer: null,
  expGroupConsumers: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  expGroupConsumersExcel: [],
};

export default createReducer<ExpGroupConsumerState, ExpGroupConsumerAction>(initialState, {
  [GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroupConsumer = action.payload;
    }),
  [UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS]: (state, action) =>
    produce(state, draft => {
      const { experienceGroupConsumerIds, prizeStatus } = action.payload;

      draft.expGroupConsumers.content = state.expGroupConsumers.content.map(item => {
        if (experienceGroupConsumerIds.indexOf(item.experienceGroupConsumerId) !== -1) {
          item.prizeStatus = prizeStatus;
        }

        return item;
      });
    }),
  [GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroupConsumers = action.payload;
    }),
  [GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroupConsumersExcel = action.payload;
    }),
});
