// base
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { RequestAsyncAction } from 'types/AsyncAction';
import * as Api from 'lib/protocols';
import * as Action from 'store/action/qnaAction';
import {
  getQnaAsync,
  createQnaCommentAsync,
  updateQnaCommentAsync,
  deleteQnaCommentAsync,
  updateQnaExposeAsync,
  updateQnaSequenceAsync,
  getQnaStatusWaitAsync,
} from 'store/reducer/qna';

function* getQna(action: RequestAsyncAction) {
  try {
    const { page, size, qnaStatus, searchName } = action.payload;

    const res = yield call(() =>
      Api.get('/qna', {
        params: {
          page,
          size,
          qnaStatus: qnaStatus || undefined,
          searchName: searchName || undefined,
          expose: false,
        },
      }),
    );
    const waitStatusCount = yield call(() => Api.get('/qna/wait'));

    yield put(getQnaAsync.success(res.data));
    yield put(getQnaStatusWaitAsync.success(waitStatusCount.data));
  } catch (error) {
    yield put(getQnaAsync.failure(error));
  }
}

function* createQnaComment(action: RequestAsyncAction) {
  try {
    const { qnaId, comment } = action.payload;
    const data = {
      comment,
    };

    yield call(() => Api.post(`/qna/${qnaId}/comment`, data));

    const state = yield select();

    yield put(
      getQnaAsync.request({
        page: state.qna.qna.page,
        size: state.qna.qna.size,
      }),
    );
  } catch (error) {
    yield put(createQnaCommentAsync.failure(error));
  }
}

function* updateQnaComment(action: RequestAsyncAction) {
  try {
    const { qnaId, qnaCommentId, comment } = action.payload;
    const data = {
      comment,
    };

    yield call(() => Api.put(`/qna/${qnaId}/comment/${qnaCommentId}`, data));
    const res = yield call(() => Api.get(`/qna/${qnaId}`));

    yield put(updateQnaCommentAsync.success(res.data));
  } catch (error) {
    yield put(updateQnaCommentAsync.failure(error));
  }
}

function* deleteQnaComment(action: RequestAsyncAction) {
  try {
    const { qnaId, qnaCommentId } = action.payload;

    yield call(() => Api.del(`/qna/${qnaId}/comment/${qnaCommentId}`));

    const state = yield select();

    yield put(
      getQnaAsync.request({
        page: state.qna.qna.page,
        size: state.qna.qna.size,
      }),
    );
  } catch (error) {
    yield put(deleteQnaCommentAsync.failure(error));
  }
}

function* updateQnaExpose(action: RequestAsyncAction) {
  try {
    const { qnaId, expose } = action.payload;

    yield call(() => Api.put(`/qna/${qnaId}/expose`, { expose }));
    yield put(updateQnaExposeAsync.success(action.payload));
  } catch (error) {
    yield put(updateQnaExposeAsync.failure(error));
  }
}

function* updateQnaSequence(action: RequestAsyncAction) {
  try {
    const { qnaId, orderType, sequence } = action.payload;
    const data = {
      orderType,
      sequence,
    };

    yield call(() => Api.put(`/qna/${qnaId}/sequence`, data));

    const state = yield select();

    yield put(
      getQnaAsync.request({
        page: state.qna.qna.page,
        size: state.qna.qna.size,
      }),
    );
  } catch (error) {
    yield put(updateQnaSequenceAsync.failure(error));
  }
}

export default function* qnaSaga() {
  yield takeEvery(Action.GET_QNA_REQUEST, getQna);
  yield takeLatest(Action.CREATE_QNA_COMMENT_REQUEST, createQnaComment);
  yield takeEvery(Action.UPDATE_QNA_COMMENT_REQUEST, updateQnaComment);
  yield takeEvery(Action.DELETE_QNA_COMMENT_REQUEST, deleteQnaComment);
  yield takeEvery(Action.UPDATE_QNA_EXPOSE_REQUEST, updateQnaExpose);
  yield takeEvery(Action.UPDATE_QNA_SEQUENCE_REQUEST, updateQnaSequence);
}
