// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/eventAction';

// modules
import { message } from 'antd';

// types
import { PayloadAction } from 'typesafe-actions';
import { GetListRequestPayload, SearchEvent, CreateRequestPayload, CreateEvent } from 'types';
import { getEventsAsync, createEventAsync } from 'store/reducer/event';

// saga

function* createEvent(action: PayloadAction<string, CreateRequestPayload<CreateEvent>>) {
  const { data } = action.payload;

  try {
    const res = yield call(() => Api.post('/event', data));
    yield put(createEventAsync.success(res.data));

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

export default function* eventSaga() {
  yield takeLatest(Actions.CREATE_EVENT_REQUEST, createEvent);
  yield takeEvery(Actions.GET_EVENTS_REQUEST, getEvents);
}
