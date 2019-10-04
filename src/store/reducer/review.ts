// base
import { produce } from 'immer';
import { createAsyncAction, action } from 'typesafe-actions';

// store
import * as Actions from 'store/action/reviewAction';

// types
import {
  PageWrapper,
  ResponseReview,
  UpdateReview,
  SearchReview,
  GetListRequestPayload,
  GetRequestPayload,
  UpdateRequestPayload,
} from 'models';
import { AnyAction } from 'redux';
import { AxiosError } from 'axios';

export interface ReviewState {
  reviews: PageWrapper<ResponseReview>;
  review: ResponseReview;
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
)<GetListRequestPayload<SearchReview>, PageWrapper<ResponseReview>, AxiosError>();

// 단건 조회
export const getReviewAsync = createAsyncAction(
  Actions.GET_REVIEW_REQUEST,
  Actions.GET_REVIEW_SUCCESS,
  Actions.GET_REVIEW_FAILURE,
)<GetRequestPayload, ResponseReview, AxiosError>();

// sequence 수정
export const updateReviewSequenceAsync = createAsyncAction(
  Actions.UPDATE_REVIEW_SEQUENCE_REQUEST,
  Actions.UPDATE_REVIEW_SEQUENCE_SUCCESS,
  Actions.UPDATE_REVIEW_SEQUENCE_FAILURE,
)<UpdateRequestPayload<UpdateReview>, UpdateRequestPayload<UpdateReview>, AxiosError>();

// expose 여부 수정
export const updateReviewsExposeAsync = createAsyncAction(
  Actions.UPDATE_REVIEWS_EXPOSE_REQUEST,
  Actions.UPDATE_REVIEWS_EXPOSE_SUCCESS,
  Actions.UPDATE_REVIEWS_EXPOSE_FAILURE,
)<UpdateReviewExposeRequestPayload[], UpdateReviewExposeRequestPayload[], AxiosError>();

export const clearReview = () => action(Actions.CLEAR_REVIEW);

const defaultReview = {
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
  images: [],
  order: {
    orderId: 0,
    orderNo: '',
    orderItems: [],
    created: '',
  },
  event: {
    name: '',
    images: [],
    eventId: 0,
    brand: {
      brandName: '',
    },
  },
};

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
  review: defaultReview,
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
    case Actions.UPDATE_REVIEW_SEQUENCE_SUCCESS: {
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
    case Actions.CLEAR_REVIEW: {
      return produce(state, draft => {
        draft.review = defaultReview;
      });
    }
    default: {
      return state;
    }
  }
};

export default review;
