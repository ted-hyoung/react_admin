// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  SnsCrawlerAction,
  GET_SNS_CRAWLER_SUCCESS
} from '../action/snsCrawler.action';

// models
import {
  ResponseSnsCrawlerGroups,
  Indexable,
} from 'models';

export interface SnsCrawlerState extends Indexable {
  snsCrawler: ResponseSnsCrawlerGroups;
}

const initialState: SnsCrawlerState = {
  snsCrawler: {
    commentCount: 0,
    content: '',
    contentImages : [],
    fullName: '',
    likeCount: 0,
    location: '',
    postCreated: '',
    profileImage: '',
    url: '',
    username: '',
  }

};

export default createReducer<SnsCrawlerState, SnsCrawlerAction>(initialState, {
  [GET_SNS_CRAWLER_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.snsCrawler = action.payload;
    }),

});
