import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { get, put as axiosPut } from 'lib/protocols';

import { message, Modal } from 'antd';

import {
  getReviewsAsync,
  updateReviewSequenceAsync,
  updateReviewsExposeAsync,
  UpdateReviewExposeRequestPayload,
  getReviewAsync,
} from 'store/reducer/review';
import * as Actions from 'store/action/reviewAction';

// types
import { PayloadAction } from 'typesafe-actions';
import { UpdateRequestPayload, GetListRequestPayload, GetRequestPayload, UpdateReview, SearchReview } from 'models';

function* getReviews(action: PayloadAction<string, GetListRequestPayload<SearchReview>>) {
  const { page, size, searchCondition } = action.payload;
  try {
    const res = yield call(() => get('/reviews', { params: { page, size, ...searchCondition } }));
    yield put(getReviewsAsync.success(res.data));
  } catch (error) {
    yield put(getReviewsAsync.failure(error));
    Modal.error({ title: error });
  }
}

function* getReview(action: PayloadAction<string, GetRequestPayload>) {
  const { id } = action.payload;
  try {
    const res = yield call(() => get('/reviews/' + id));
    yield put(getReviewAsync.success(res.data));
  } catch (error) {
    yield put(getReviewAsync.failure(error));
  }
}

function* updateReviewSequence(action: PayloadAction<string, UpdateRequestPayload<UpdateReview>>) {
  const { id, data } = action.payload;
  try {
    yield call(() => axiosPut('/reviews/' + id + '/sequence', data));
    yield put(updateReviewSequenceAsync.success(action.payload));
    const state = yield select();
    yield put(
      getReviewsAsync.request({
        page: state.review.reviews.page,
        size: state.review.reviews.size,
      }),
    );
    message.success('후기 순서가 수정되었습니다');
  } catch (error) {
    yield put(updateReviewSequenceAsync.failure(error));
  }
}

function* updateReviewsExpose(action: PayloadAction<string, UpdateReviewExposeRequestPayload[]>) {
  try {
    yield call(() => axiosPut('/reviews/expose', action.payload));
    yield put(updateReviewsExposeAsync.success(action.payload));
    message.success('공개 설정이 수정되었습니다');
  } catch (error) {
    yield put(updateReviewsExposeAsync.failure(error));
  }
}

export default function* reviewSaga() {
  yield takeLatest(Actions.GET_REVIEWS_REQUEST, getReviews);
  yield takeEvery(Actions.GET_REVIEW_REQUEST, getReview);
  yield takeEvery(Actions.UPDATE_REVIEW_SEQUENCE_REQUEST, updateReviewSequence);
  yield takeEvery(Actions.UPDATE_REVIEWS_EXPOSE_REQUEST, updateReviewsExpose);
}
