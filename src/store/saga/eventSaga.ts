// base
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
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
  updateEventShippingFeeInfoAsync,
  deleteEventAsync,
  updateEventShippingAsync, createCopyEventAsync,
} from 'store/reducer/event';

// lib
import { parseParams } from 'lib/utils';

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
  RequestAsyncAction,
} from 'models';

// sagas
function* createEvent(action: PayloadAction<string, CreateRequestPayload<CreateEvent>>) {
  const { data } = action.payload;

  try {
    const res = yield call(() => Api.post('/event', data));
    yield put(createEventAsync.success(res.data));
    yield put(getEventByIdAsync.request({ id : res.data }));

    message.success('공구가 등록되었습니다.');
  } catch (error) {
    message.error(error);
    yield put(createEventAsync.failure(error));
  }
}


function* createEventCopy(action: RequestAsyncAction) {

  const {  eventId, salesStarted, salesEnded, shippingScheduled, } = action.payload.data;

  const data = {
    salesStarted,
    salesEnded,
    shippingScheduled,
  };

  try {
    const res = yield call(() => Api.post(`/events/${eventId}/copy`, data));
   yield put(createCopyEventAsync.success(res.data));
  } catch (error) {
    message.error(error);
    yield put(createEventAsync.failure(error));
  }
}

function* getEvents(action: PayloadAction<string, GetListRequestPayload<SearchEvent>>) {
  const { page, size, searchCondition } = action.payload;

  try {
    const res = yield call(() =>
      Api.get('/events', {
        params: { page, size, ...searchCondition },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
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
    yield put(getEventByIdAsync.request({ id }));
    yield message.success('공구가 수정되었습니다.');
  } catch (error) {
    yield put(updateEventByIdAsync.failure(error));
    yield message.error(error);
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

function* updateEventShippingFeeInfo(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    yield call(() => Api.put(`/events/${eventId}/shipping-fee`, data));
    yield put(updateEventShippingFeeInfoAsync.success(data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('배송비 설정을 수정했습니다.');
  } catch (error) {
    yield put(updateEventShippingFeeInfoAsync.failure(error));
    message.error('배송비 설정 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* deleteEvent(action: RequestAsyncAction) {
  try {
    const { eventId } = action.payload;

    yield call(() => Api.del(`/events/${eventId}`));
    yield put(deleteEventAsync.success());
    yield put(replace('/events'));
  } catch (error) {
    yield put(deleteEventAsync.failure(error));
  }
}

function* updateEventShipping(action: RequestAsyncAction) {
  const { eventId, data } = action.payload;

  try {
    const res = yield call(() => Api.put(`/events/${eventId}/shipping`, data));
    yield put(updateEventShippingAsync.success(res.data));
    yield message.success('공구 배송 정보가 수정되었습니다.');
  } catch (error) {
    yield put(updateEventShippingAsync.failure(error));
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
  yield takeLatest(Actions.UPDATE_EVENT_SHIPPING_FEE_INFO_REQUEST, updateEventShippingFeeInfo);
  yield takeLatest(Actions.DELETE_EVENT_REQUEST, deleteEvent);
  yield takeLatest(Actions.UPDATE_EVENT_SHIPPING_REQUEST, updateEventShipping);
  yield takeLatest(Actions.CREATE_COPY_EVENT_REQUEST, createEventCopy);
}
