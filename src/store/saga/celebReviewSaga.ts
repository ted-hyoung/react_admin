// base
import { call, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/celebReviewAction';
import { PayloadAction } from 'typesafe-actions';
import { UpdateRequestPayload, UpdateCelebReview, GetRequestPayload } from 'types';
import { updateCelebReviewAsync, getCelebReviewAsync } from 'store/reducer/celebReview';
import { message } from 'antd';
import { getEventByIdAsync } from 'store/reducer/event';

function* updateCelebReview(action: PayloadAction<string, UpdateRequestPayload<UpdateCelebReview>>) {
  const { id, data } = action.payload;
  try {
    const res = yield call(() => Api.put('/events/' + id + '/celeb-review', data));
    yield put(updateCelebReviewAsync.success(res));
    yield put(getEventByIdAsync.request({ id }));
    message.success('저장되었습니다');
  } catch (error) {
    yield put(updateCelebReviewAsync.failure(error));
    message.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
