// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  ExpGroupConsumerAction,
  GET_EXP_GROUP_CONSUMERS_BY_ID_SUCCESS,
  UPDATE_EXP_GROUP_CONSUMERS_PRIZE_SUCCESS,
  GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS,
} from '../action/expGroupConsumer.action';

// models
import { ResponseSearchExperienceGroupConsumers, PageWrapper, ResponseExperienceGroupConsumers } from 'models';
import { PrizeStatus } from 'enums';

export interface ExpGroupConsumerState {
  expGroupConsumers: PageWrapper<ResponseSearchExperienceGroupConsumers>;
  expGroupConsumer: ResponseExperienceGroupConsumers | null;
}

const initialState: ExpGroupConsumerState = {
  expGroupConsumers: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  },
  expGroupConsumer: null,
};

export default createReducer<ExpGroupConsumerState, ExpGroupConsumerAction>(initialState, {
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
  [GET_EXP_GROUP_CONSUMER_BY_ID_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.expGroupConsumer = action.payload;
    }),
});
