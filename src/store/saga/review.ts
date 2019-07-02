import { put, call, takeEvery } from 'redux-saga/effects';
import { get, post, del, put as axiosPut } from 'lib/protocols';
import {
  getReviewsAsync,
  updateReviewAsync,
  updateReviewExposeAsync,
  updateReviewsExposeAsync,
} from 'store/reducer/review';
import * as Actions from 'store/action/review';
import { AnyAction } from 'redux';

function* getReviews(action: AnyAction) {
  const { page, size, searchCondition } = action.payload;
  try {
    const res = yield call(() => get('/reviews', { params: { page, size, ...searchCondition } }));
    yield put(getReviewsAsync.success(res.data));
  } catch (error) {
    yield put(getReviewsAsync.failure(error));
  }
}

function* updateReviews(action: AnyAction) {
  const { id, data } = action.payload;
  try {
    yield call(() => post('/reviews/' + id, data));
    yield put(updateReviewAsync.success({}));
  } catch (error) {
    yield put(updateReviewAsync.failure(error));
  }
}

function* updateReviewExpose(action: AnyAction) {
  const { id, expose } = action.payload;
  try {
    yield call(() => axiosPut('/reviews/' + id + '/expose', { expose: `${expose}` }));
    yield put(updateReviewExposeAsync.success({}));
  } catch (error) {
    yield put(updateReviewExposeAsync.failure(error));
  }
}

function* updateReviewsExpose(action: AnyAction) {
  const { reviewIds, expose } = action.payload;
  try {
    yield call(() => axiosPut('/reviews/expose', { params: { reviewIds, expose } }));
    yield put(updateReviewsExposeAsync.success({}));
  } catch (error) {
    yield put(updateReviewsExposeAsync.failure(error));
  }
}

export default function* reviewSaga() {
  yield takeEvery(Actions.GET_REVIEWS_REQUEST, getReviews);
  yield takeEvery(Actions.UPDATE_REVIEW_REQUEST, updateReviews);
  yield takeEvery(Actions.UPDATE_REVIEWS_EXPOSE_REQUEST, updateReviewsExpose);
  yield takeEvery(Actions.UPDATE_REVIEW_EXPOSE_REQUEST, updateReviewExpose);
}
