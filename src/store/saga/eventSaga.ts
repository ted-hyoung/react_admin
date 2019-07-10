// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/eventAction';

// modules
import {} from 'antd';

// types
import { PayloadAction } from 'typesafe-actions';
import {
  GetListRequestPayload,
  SearchEvent,
  CreateRequestPayload,
  CreateEvent,
  UpdateRequestPayload,
  UpdateCelebReview,
} from 'types';
import { getEventsAsync, createEventAsync, updateEventCelebReviewAsync } from 'store/reducer/event';

// saga

function* createEvent(action: PayloadAction<string, CreateRequestPayload<CreateEvent>>) {
  const { data } = action.payload;

  try {
    const res = yield call(() => Api.post('/event', data));
    yield put(createEventAsync.success(res));
  } catch (error) {
    yield put(createEventAsync.failure(error));
  }
}

function* getEvents(action: PayloadAction<string, GetListRequestPayload<SearchEvent>>) {
  const { page, size, searchCondition } = action.payload;

  try {
    const res = yield call(() => Api.get('/events', { params: { page, size, ...searchCondition } }));
    yield put(getEventsAsync.success(res));
  } catch (error) {
    yield put(getEventsAsync.failure(error));
  }
}

function* updateEventCelebReview(action: PayloadAction<string, UpdateRequestPayload<UpdateCelebReview>>) {
  const { id, data } = action.payload;
  try {
    const res = yield call(() => Api.put('/events' + id + '/celeb-review', data));
    yield put(updateEventCelebReviewAsync.success(res));
  } catch (error) {
    yield put(updateEventCelebReviewAsync.failure(error));
  }
}

export default function* eventSaga() {
  yield takeLatest(Actions.CREATE_EVENT_REQUEST, createEvent);
  yield takeEvery(Actions.GET_EVENTS_REQUEST, getEvents);
  yield takeEvery(Actions.UPDATE_EVENT_CELEB_REVIEW_REQUEST, updateEventCelebReview);
}
