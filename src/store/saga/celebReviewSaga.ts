// base
import { call, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/celebReviewAction';
import { PayloadAction } from 'typesafe-actions';
import { UpdateRequestPayload, UpdateCelebReview, GetRequestPayload } from 'types';
import { updateCelebReviewAsync, getCelebReviewAsync } from 'store/reducer/celebReview';

function* updateCelebReview(action: PayloadAction<string, UpdateRequestPayload<UpdateCelebReview>>) {
  const { id, data } = action.payload;
  try {
    const res = yield call(() => Api.put('/events/' + id + '/celeb-review', data));
    yield put(updateCelebReviewAsync.success(res));
  } catch (error) {
    yield put(updateCelebReviewAsync.failure(error));
  }
}

function* getCelebReview(action: PayloadAction<string, GetRequestPayload>) {
  const { id } = action.payload;
  try {
    const res = yield call(() => Api.get('/events/' + id + '/celeb-review'));
    yield put(getCelebReviewAsync.success(res.data));
  } catch (error) {
    yield put(getCelebReviewAsync.failure(error));
  }
}

export default function* celebReviewSaga() {
  yield takeEvery(Actions.UPDATE_CELEB_REVIEW_REQUEST, updateCelebReview);
  yield takeEvery(Actions.GET_CELEB_REVIEW_REQUEST, getCelebReview);
}
