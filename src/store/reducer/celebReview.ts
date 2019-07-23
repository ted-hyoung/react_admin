import { AnyAction } from 'redux';
import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';

import * as Actions from 'store/action/celebReviewAction';

import { UpdateRequestPayload, UpdateCelebReview, GetRequestPayload, ResponseCelebReview } from 'types';
import { AxiosResponse, AxiosError } from 'axios';

export interface CelebReviewState {
  celebReview: ResponseCelebReview;
}

export const updateCelebReviewAsync = createAsyncAction(
  Actions.UPDATE_CELEB_REVIEW_REQUEST,
  Actions.UPDATE_CELEB_REVIEW_SUCCESS,
  Actions.UPDATE_CELEB_REVIEW_FAILURE,
)<UpdateRequestPayload<UpdateCelebReview>, AxiosResponse, AxiosError>();

export const getCelebReviewAsync = createAsyncAction(
  Actions.GET_CELEB_REVIEW_REQUEST,
  Actions.GET_CELEB_REVIEW_SUCCESS,
  Actions.GET_CELEB_REVIEW_FAILURE,
)<GetRequestPayload, ResponseCelebReview, AxiosError>();

const initialState: CelebReviewState = {
  celebReview: {
    created: '',
    instagramUrl: '',
    contents: '',
    modified: '',
  },
};

const celebReview = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.GET_CELEB_REVIEW_SUCCESS: {
      return produce(state, draft => {
        draft.celebReview = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default celebReview;
