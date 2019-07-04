import * as Actions from 'store/action/contactAction';
import { PayloadAction } from 'typesafe-actions';
import {
  GetListRequestPayload,
  ResponseContact,
  CreateContactComment,
  CreateRequestPayload,
  UpdateContactComment,
  UpdateRequestPayload,
  DeleteRequestPayload,
  GetRequestPayload,
} from 'types';
import { put, call, takeEvery } from 'redux-saga/effects';
import { get, post, put as axiosPut, del } from 'lib/protocols';
import {
  getContactsAsync,
  createContactCommentAsync,
  updateContactCommentAsync,
  deleteContactCommentAsync,
  getContactAsync,
} from 'store/reducer/contact';
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

function* getContact(action: PayloadAction<string, GetRequestPayload>) {
  const { id } = action.payload;
  try {
    const res = yield call(() => get('/contacts/' + id));
    yield put(getContactAsync.success(res.data));
  } catch (error) {
    yield put(getContactAsync.failure(error));
  }
}

function* createContactComment(action: PayloadAction<string, CreateRequestPayload<CreateContactComment>>) {
  const { parentId, data } = action.payload;
  try {
    yield call(() => post('/contacts/' + parentId + '/comment', data));
    yield put(createContactCommentAsync.success({}));
    if (parentId) {
      yield put(
        getContactAsync.request({
          id: parentId,
        }),
      );
    }
    message.success('답변이 등록되었습니다');
  } catch (error) {
    yield put(createContactCommentAsync.failure(error));
  }
}

function* updateContactComment(action: PayloadAction<string, UpdateRequestPayload<UpdateContactComment>>) {
  const { id, data } = action.payload;
  try {
    yield call(() => axiosPut('/contacts/' + id + '/comment', data));
    yield put(updateContactCommentAsync.success({}));
    message.success('답변이 수정되었습니다');
    yield put(getContactAsync.request({ id }));
  } catch (error) {
    yield put(updateContactCommentAsync.failure(error));
  }
}

function* deleteContactComment(action: PayloadAction<string, DeleteRequestPayload>) {
  const { id } = action.payload;
  try {
    yield call(() => del('/contacts/' + id + '/comment'));
    yield put(deleteContactCommentAsync.success({}));
    message.success('답변을 삭제했습니다');
    yield put(getContactAsync.request({ id }));
  } catch (error) {
    yield put(deleteContactCommentAsync.failure(error));
  }
}

export default function* contactSaga() {
  yield takeEvery(Actions.GET_CONTACTS_REQUEST, getContacts);
  yield takeEvery(Actions.GET_CONTACT_REQUEST, getContact);
  yield takeEvery(Actions.CREATE_CONTACT_COMMENT_REQUEST, createContactComment);
  yield takeEvery(Actions.UPDATE_CONTACT_COMMENT_REQUEST, updateContactComment);
  yield takeEvery(Actions.DELETE_CONTACT_COMMENT_REQUEST, deleteContactComment);
}
