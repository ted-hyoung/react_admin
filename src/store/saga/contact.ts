import * as Actions from 'store/action/contact';
import { PayloadAction } from 'typesafe-actions';
import {
  GetListRequestPayload,
  ResponseContact,
  CreateContactComment,
  CreateRequestPayload,
  UpdateContactComment,
  UpdateRequestPayload,
} from 'types';
import { put, call, takeEvery } from 'redux-saga/effects';
import { get, post, put as axiosPut } from 'lib/protocols';
import { getContactsAsync, createContactCommentAsync, updateContactCommentAsync } from 'store/reducer/contact';
import { message } from 'antd';

function* getContacts(action: PayloadAction<string, GetListRequestPayload<ResponseContact>>) {
  const { page, size, searchCondition } = action.payload;
  try {
    const res = yield call(() => get('/contacts', { params: { page, size, ...searchCondition } }));
    yield put(getContactsAsync.success(res.data));
  } catch (error) {
    yield put(getContactsAsync.failure(error));
  }
}

function* createContactComment(action: PayloadAction<string, CreateRequestPayload<CreateContactComment>>) {
  const { parentId, data } = action.payload;
  try {
    yield call(() => post('/contacts/' + parentId + '/comment', data));
    const res = yield call(() => get('/contacts/' + parentId));
    yield put(createContactCommentAsync.success(res.data));
    message.success('답변이 등록되었습니다');
  } catch (error) {
    yield put(createContactCommentAsync.failure(error));
  }
}

function* updateContactComment(action: PayloadAction<string, UpdateRequestPayload<UpdateContactComment>>) {
  const { id, data } = action.payload;
  try {
    yield call(() => axiosPut('/contacts/' + id + '/comment', data));
    yield put(updateContactCommentAsync.success(action.payload));
  } catch (error) {
    yield put(updateContactCommentAsync.failure(error));
  }
}

export default function* contactSaga() {
  yield takeEvery(Actions.GET_CONTACTS_REQUEST, getContacts);
  yield takeEvery(Actions.CREATE_CONTACT_COMMENT_REQUEST, createContactComment);
  yield takeEvery(Actions.UPDATE_CONTACT_COMMENT_REQUEST, updateContactComment);
}
