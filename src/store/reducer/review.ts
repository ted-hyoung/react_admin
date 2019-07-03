// base
import { produce } from 'immer';
import { createAsyncAction, action } from 'typesafe-actions';

// store
import * as Actions from 'store/action/review';

// types
import { ResponseList } from 'types';
import { ResponseReview, UpdateReview, SearchReview } from 'types/Review';
import { GetListRequestPayload, GetRequestPayload, UpdateRequestPayload } from 'types/Payload';
import { AnyAction } from 'redux';
import { AxiosError } from 'axios';

export interface ReviewState {
  reviews: ResponseList<ResponseReview>;
  review: ResponseReview;
  detailModalVisible: boolean;
}

export interface UpdateReviewExposeRequestPayload {
  reviewId: number | string;
  expose: boolean;
}

// 목록 조회
export const getReviewsAsync = createAsyncAction(
  Actions.GET_REVIEWS_REQUEST,
  Actions.GET_REVIEWS_SUCCESS,
  Actions.GET_REVIEWS_FAILURE,
)<GetListRequestPayload<SearchReview>, ResponseList<ResponseReview>, AxiosError>();

// 단건 조회
export const getReviewAsync = createAsyncAction(
  Actions.GET_REVIEW_REQUEST,
  Actions.GET_REVIEW_SUCCESS,
  Actions.GET_REVIEW_FAILURE,
)<GetRequestPayload, ResponseReview, AxiosError>();

// 수정
export const updateReviewAsync = createAsyncAction(
  Actions.UPDATE_REVIEW_REQUEST,
  Actions.UPDATE_REVIEW_SUCCESS,
  Actions.UPDATE_REVIEW_FAILURE,
)<UpdateRequestPayload<UpdateReview>, UpdateRequestPayload<UpdateReview>, AxiosError>();

// expose 여부 수정
export const updateReviewsExposeAsync = createAsyncAction(
  Actions.UPDATE_REVIEWS_EXPOSE_REQUEST,
  Actions.UPDATE_REVIEWS_EXPOSE_SUCCESS,
  Actions.UPDATE_REVIEWS_EXPOSE_FAILURE,
)<UpdateReviewExposeRequestPayload[], UpdateReviewExposeRequestPayload[], AxiosError>();

// detailModalVisible
export const modalReviewAsync = (visible: boolean) => action(Actions.MODAL_REVIEW, visible);

const initialState: ReviewState = {
  reviews: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  review: {
    reviewId: 0,
    starRate: 0,
    contents: '',
    created: '',
    creator: {
      loginId: '',
      username: '',
      phone: '',
    },
    expose: true,
    sequence: 0,
  },
  detailModalVisible: false,
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
        draft.detailModalVisible = true;
      });
    }
    case Actions.UPDATE_REVIEW_SUCCESS: {
      return produce(state, draft => {
        const selectedReview = draft.reviews.content.findIndex(review => review.reviewId === action.payload.id);
        draft.reviews.content[selectedReview].sequence = 0;

        const sameSequenceReview = draft.reviews.content.findIndex(
          review => review.sequence === action.payload.data.sequence,
        );
        if (sameSequenceReview > -1) {
          draft.reviews.content[sameSequenceReview].sequence = 0;
        }
      });
    }
    case Actions.UPDATE_REVIEWS_EXPOSE_SUCCESS: {
      return produce(state, draft => {
        action.payload.forEach((item: UpdateReviewExposeRequestPayload) => {
          const selected = draft.reviews.content.findIndex(review => review.reviewId === Number(item.reviewId));
          draft.reviews.content[selected].expose = item.expose;
        });
      });
    }
    case Actions.MODAL_REVIEW: {
      return produce(state, draft => {
        draft.detailModalVisible = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default review;
