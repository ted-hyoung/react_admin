import { produce } from 'immer';
import { createAsyncAction } from 'typesafe-actions';

import { ResponseList } from 'types';
import { ResponseReview, UpdateReview, SearchReview } from 'types/Review';

import * as Actions from 'store/action/review';
import { RequestListAsync, RequestAsync, UpdateAsync, DeleteAsync } from 'types/AsyncActions';
import { AnyAction } from 'redux';
import { AxiosError } from 'axios';

export interface ReviewState {
  reviews: ResponseList<ResponseReview>;
  review: ResponseReview;
}

interface UpdateReviewExposeAsync {
  id: number;
  expose: boolean;
}

interface UpdateReviewsExposeAsync {
  reviewIds: number[] | string[];
  expose: boolean;
}

// 목록 조회
export const getReviewsAsync = createAsyncAction(
  Actions.GET_REVIEWS_REQUEST,
  Actions.GET_REVIEWS_SUCCESS,
  Actions.GET_REVIEWS_FAILURE,
)<RequestListAsync<SearchReview>, ResponseList<ResponseReview>, AxiosError>();

// 단건 조회
export const getReviewAsync = createAsyncAction(
  Actions.GET_REVIEW_REQUEST,
  Actions.GET_REVIEW_SUCCESS,
  Actions.GET_REVIEW_FAILURE,
)<RequestAsync, ResponseReview, AxiosError>();

// 수정
export const updateReviewAsync = createAsyncAction(
  Actions.UPDATE_REVIEW_REQUEST,
  Actions.UPDATE_REVIEW_SUCCESS,
  Actions.UPDATE_REVIEW_FAILURE,
)<UpdateAsync<UpdateReview>, {}, AxiosError>();

// expose 여부 수정
export const updateReviewExposeAsync = createAsyncAction(
  Actions.UPDATE_REVIEW_EXPOSE_REQUEST,
  Actions.UPDATE_REVIEW_EXPOSE_SUCCESS,
  Actions.UPDATE_REVIEW_EXPOSE_FAILURE,
)<UpdateReviewExposeAsync, {}, AxiosError>();

// expose 여부 수정(multi)
export const updateReviewsExposeAsync = createAsyncAction(
  Actions.UPDATE_REVIEWS_EXPOSE_REQUEST,
  Actions.UPDATE_REVIEWS_EXPOSE_SUCCESS,
  Actions.UPDATE_REVIEWS_EXPOSE_FAILURE,
)<UpdateReviewsExposeAsync, {}, AxiosError>();

const initialState: ReviewState = {
  reviews: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
  },
  review: {
    reviewId: 0,
    starRate: 0,
    contents: '',
    created: new Date(),
    creator: {
      username: '',
    },
  },
};

const review = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.GET_REVIEWS_SUCCESS: {
      return produce(state, draft => {
        draft.reviews = action.payload;
      });
    }
    case Actions.GET_REVIEW_SUCCESS: {
      return produce(state, draft => {
        draft.review = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default review;
