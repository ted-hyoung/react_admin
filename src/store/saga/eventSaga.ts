// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/eventAction';

// modules
import { message } from 'antd';

// types
import { PayloadAction } from 'typesafe-actions';
import {
  GetListRequestPayload,
  SearchEvent,
  CreateRequestPayload,
  CreateEvent,
  GetRequestPayload,
  UpdateRequestPayload,
  UpdateEvent,
} from 'types';
import { getEventsAsync, createEventAsync, getEventByIdAsync, updateEventByIdAsync } from 'store/reducer/event';

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

  try {
    const res = yield call(() => Api.put(`/events/${id}`, data));
    yield put(updateEventByIdAsync.success(res.data));

    message.success('공구가 수정되었습니다.');
  } catch (error) {
    yield put(updateEventByIdAsync.failure(error));
  }
}

export default function* eventSaga() {
  yield takeLatest(Actions.CREATE_EVENT_REQUEST, createEvent);
  yield takeEvery(Actions.GET_EVENTS_REQUEST, getEvents);
  yield takeEvery(Actions.GET_EVENT_REQUEST, getEventById);
  yield takeLatest(Actions.UPDATE_EVENT_REQUEST, updateEventById);
}
