// base
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction } from 'typesafe-actions';
import * as Actions from 'store/action/expGroup.action';
import {
  createExpGroupAsync,
  getExpGroupsAsync,
  getExpGroupsByIdAsync,
  updateExpGroupsByIdAsync,
  updateExpGroupConsumersAsync,
} from 'store/action/expGroup.action';

// models
import { CreateExperienceGroup, UpdateExperienceGroup, UpdateExperienceGroupConsumerUpload } from 'models';
import { getExpGroupConsumersByIdAsync } from 'store/action/expGroupConsumer.action';

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

export default function* expGroupSaga() {
  yield takeLatest(Actions.CREATE_EXP_GROUP_REQUEST, createExpGroup);
  yield takeEvery(Actions.GET_EXP_GROUPS_REQUEST, getExpGroups);
  yield takeEvery(Actions.GET_EXP_GROUPS_BY_ID_REQUEST, getExpGroupsById);
  yield takeLatest(Actions.UPDATE_EXP_GROUPS_BY_ID_REQUEST, updateExpGroupsById);
  yield takeLatest(Actions.UPDATE_EXP_GROUP_CONSUMERS_REQUEST, updateExpGroupConsumers);
}
