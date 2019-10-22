// base
import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction, ActionType } from 'typesafe-actions';
import * as Actions from 'store/action/expGroup.action';
import {
  createExpGroupAsync,
  createExpGroupByEventAsync,
  getExpGroupsAsync,
  getExpGroupsByIdAsync,
  getExpGroupsByEventAsync,
  updateExpGroupsByIdAsync,
  updateExpGroupConsumersAsync,
  getExpGroupsForEventAsync,
  deleteExpGroupByEventAsync,
} from 'store/action/expGroup.action';

import { getExpGroupConsumersByIdAsync } from 'store/action/expGroupConsumer.action';

// models
import {
  CreateExperienceGroup,
  UpdateExperienceGroup,
  UpdateExperienceGroupConsumerUpload,
  SearchExperienceGroupForEvent,
  CreateExperienceGroupEvent,
  DeleteExperienceGroupEvent,
} from 'models';

function* createExpGroup(action: PayloadAction<string, CreateExperienceGroup>) {
  const data = action.payload;

  try {
    const res = yield call(() => Api.post('/experience-groups', data));

    yield put(createExpGroupAsync.success(res.data));
    yield put(replace(`/exps/detail/${res.data}`));

    yield message.success('체험단 후기 모집이 생성되었습니다.');
  } catch (error) {
    yield put(createExpGroupAsync.failure(error));
  }
}

function* createExpGroupByEvent(action: PayloadAction<string, { id: number; data: CreateExperienceGroupEvent }>) {
  const { id, data } = action.payload;

  try {
    yield call(() => Api.put(`/events/${id}/experience-groups`, data));

    yield put(createExpGroupByEventAsync.success());

    // const { page } = yield select(state => state.expGroupState.eventExpGroups);

    yield put(getExpGroupsByEventAsync.request({ id, page: 0, size: 20 }));

    yield message.success('체험단 후기가 공구에 등록되었습니다.');
  } catch (error) {
    yield put(createExpGroupByEventAsync.failure(error));
  }
}

function* getExpGroups(action: PayloadAction<string, { page: number; size: number }>) {
  const { page, size } = action.payload;

  try {
    const res = yield call(() => Api.get('/experience-groups', { params: { page, size } }));

    yield put(getExpGroupsAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupsAsync.failure(error));
  }
}

function* getExpGroupsById(action: PayloadAction<string, { id: number }>) {
  const { id } = action.payload;

  try {
    const res = yield call(() => Api.get(`/experience-groups/${id}`));

    yield put(getExpGroupsByIdAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupsByIdAsync.failure(error));
  }
}

function* getExpGroupsByEvent(action: PayloadAction<string, { id: number; page: number; size: number }>) {
  const { id, page, size } = action.payload;

  try {
    const res = yield call(() => Api.get(`/events/${id}/experience-groups`, { params: { page, size } }));

    yield put(getExpGroupsByEventAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupsByEventAsync.failure(error));
  }
}

function* updateExpGroupsById(action: PayloadAction<string, { id: number; data: UpdateExperienceGroup }>) {
  const { id, data } = action.payload;

  try {
    const res = yield call(() => Api.put(`/experience-groups/${id}`, data));

    yield put(updateExpGroupsByIdAsync.success(res.data));

    yield message.success('체험단 후기 모집이 수정되었습니다.');
  } catch (error) {
    yield put(updateExpGroupsByIdAsync.failure(error));
  }
}

function* updateExpGroupConsumers(
  action: PayloadAction<string, { id: number; data: UpdateExperienceGroupConsumerUpload }>,
) {
  const { id, data } = action.payload;

  try {
    const res = yield call(() => Api.put(`/experience-groups/consumers/${id}/upload`, data));

    yield put(updateExpGroupConsumersAsync.success(res.data));
    yield put(getExpGroupConsumersByIdAsync.request({ id, page: 0, size: 20 }));

    yield message.success('체험단 참여자 정보가 업데이트되었습니다.');
  } catch (error) {
    yield put(updateExpGroupConsumersAsync.failure(error));
  }
}

function* getExpGroupsForEvent(action: ActionType<typeof getExpGroupsForEventAsync.request>) {
  const { eventId, page, size, params } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/events/${eventId}/experience-groups/calling`, {
        params: { page, size, ...params },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    yield put(getExpGroupsForEventAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupsForEventAsync.failure(error));
  }
}

function* deleteExpGroupByEvent(action: PayloadAction<string, { eventId: number; data: DeleteExperienceGroupEvent }>) {
  const { eventId, data } = action.payload;

  try {
    yield call(() => Api.del(`/events/${eventId}/experience-groups`, { data }));
    yield put(deleteExpGroupByEventAsync.success());

    const page = yield select(state => state.expGroupState.eventExpGroups.page);

    yield put(getExpGroupsByEventAsync.request({ id: eventId, page, size: 20 }));
    yield message.success('선택한 체험단이 해당 공구에서 제외되었습니다.');
  } catch (error) {
    yield put(deleteExpGroupByEventAsync.failure(error));
  }
}

export default function* expGroupSaga() {
  yield takeLatest(Actions.CREATE_EXP_GROUP_REQUEST, createExpGroup);
  yield takeLatest(Actions.CREATE_EXP_GROUP_BY_EVENT_REQUEST, createExpGroupByEvent);
  yield takeEvery(Actions.GET_EXP_GROUPS_REQUEST, getExpGroups);
  yield takeEvery(Actions.GET_EXP_GROUPS_BY_ID_REQUEST, getExpGroupsById);
  yield takeEvery(Actions.GET_EXP_GROUPS_BY_EVENT_REQUEST, getExpGroupsByEvent);
  yield takeLatest(Actions.UPDATE_EXP_GROUPS_BY_ID_REQUEST, updateExpGroupsById);
  yield takeLatest(Actions.UPDATE_EXP_GROUP_CONSUMERS_REQUEST, updateExpGroupConsumers);
  yield takeEvery(Actions.GET_EXP_GROUPS_FOR_EVENT_REQUEST, getExpGroupsForEvent);
  yield takeLatest(Actions.DELETE_EXP_GROUP_BY_ID_REQUEST, deleteExpGroupByEvent);
}
