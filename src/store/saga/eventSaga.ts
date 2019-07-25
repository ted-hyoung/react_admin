// base
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/eventAction';
import {
  getEventsAsync,
  createEventAsync,
  getEventByIdAsync,
  updateEventByIdAsync,
  updateEventNoticesAsync,
  updateEventStatusAsync,
} from 'store/reducer/event';

// modules
import { PayloadAction } from 'typesafe-actions';
import { message } from 'antd';

// types
import {
  GetListRequestPayload,
  SearchEvent,
  CreateRequestPayload,
  CreateEvent,
  GetRequestPayload,
  UpdateRequestPayload,
  UpdateEvent,
  UpdateEventNotices,
  UpdateEventStatus,
} from 'types';

// sagas
function* createEvent(action: PayloadAction<string, CreateRequestPayload<CreateEvent>>) {
  const { data } = action.payload;

  try {
    const res = yield call(() => Api.post('/event', data));
    yield put(createEventAsync.success(res.data));
    yield put(replace('/events/detail/' + res.data));

    message.success('공구가 등록되었습니다.');
  } catch (error) {
    yield put(createEventAsync.failure(error));
  }
}

function* getEvents(action: PayloadAction<string, GetListRequestPayload<SearchEvent>>) {
  const { page, size, searchCondition } = action.payload;

  try {
    const res = yield call(() => Api.get('/events', { params: { page, size, ...searchCondition } }));
    yield put(getEventsAsync.success(res.data));
  } catch (error) {
    yield put(getEventsAsync.failure(error));
  }
}

function* getEventById(action: PayloadAction<string, GetRequestPayload>) {
  const { id } = action.payload;

  try {
    const res = yield call(() => Api.get(`/events/${id}`));
    yield put(getEventByIdAsync.success(res.data));
  } catch (error) {
    yield put(getEventByIdAsync.failure(error));
    yield put(push('/events'));
  }
}

function* updateEventById(action: PayloadAction<string, UpdateRequestPayload<UpdateEvent>>) {
  const { id, data } = action.payload;
  const state = yield select();

  try {
    const res = yield call(() => Api.put(`/events/${id}`, data));
    yield put(updateEventByIdAsync.success(res.data));
    yield put(replace(state.router.location.pathname));
    yield message.success('공구가 수정되었습니다.');
  } catch (error) {
    yield put(updateEventByIdAsync.failure(error));
  }
}

function* updateEventNotices(action: PayloadAction<string, UpdateRequestPayload<UpdateEventNotices>>) {
  const { id, data } = action.payload;

  try {
    const res = yield call(() => Api.put(`/events/${id}/notices`, data));
    yield put(updateEventNoticesAsync.success(res.data));
    yield put(getEventByIdAsync.request({ id }));
    yield message.success('공지가 등록되었습니다.');
  } catch (error) {
    yield put(updateEventNoticesAsync.failure(error));
  }
}

function* updateEventStatus(action: PayloadAction<string, UpdateRequestPayload<UpdateEventStatus>>) {
  const { id, data } = action.payload;

  try {
    const res = yield call(() => Api.put(`/events/${id}/status`, data));
    yield put(updateEventStatusAsync.success(res.data));
    yield message.success('공구가 오픈되었습니다.');
  } catch (error) {
    yield put(updateEventStatusAsync.failure(error));
    yield message.error(error);
  }
}

export default function* eventSaga() {
  yield takeLatest(Actions.CREATE_EVENT_REQUEST, createEvent);
  yield takeEvery(Actions.GET_EVENTS_REQUEST, getEvents);
  yield takeEvery(Actions.GET_EVENT_REQUEST, getEventById);
  yield takeLatest(Actions.UPDATE_EVENT_REQUEST, updateEventById);
  yield takeLatest(Actions.UPDATE_EVENT_NOTICES_REQUEST, updateEventNotices);
  yield takeLatest(Actions.UPDATE_EVENT_STATUS_REQUEST, updateEventStatus);
}
