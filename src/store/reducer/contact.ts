import {
  PageWrapper,
  ResponseContact,
  GetListRequestPayload,
  CreateContactComment,
  CreateRequestPayload,
  UpdateRequestPayload,
  UpdateContactComment,
  DeleteRequestPayload,
  SearchContact,
  ResponseContactComment,
} from 'types';
import { AnyAction } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import * as Actions from 'store/action/contact';
import { AxiosError } from 'axios';
import produce from 'immer';

export interface ContactState {
  contacts: PageWrapper<ResponseContact>;
}

// 목록 조회
export const getContactsAsync = createAsyncAction(
  Actions.GET_CONTACTS_REQUEST,
  Actions.GET_CONTACTS_SUCCESS,
  Actions.GET_CONTACTS_FAILURE,
)<GetListRequestPayload<SearchContact>, PageWrapper<ResponseContact>, AxiosError>();

// 답글 등록
export const createContactCommentAsync = createAsyncAction(
  Actions.CREATE_CONTACT_COMMENT_REQUEST,
  Actions.CREATE_CONTACT_COMMENT_SUCCESS,
  Actions.CREATE_CONTACT_COMMENT_FAILURE,
)<CreateRequestPayload<CreateContactComment>, ResponseContact, AxiosError>();

// 답글 수정
export const updateContactCommentAsync = createAsyncAction(
  Actions.UPDATE_CONTACT_COMMENT_REQUEST,
  Actions.UPDATE_CONTACT_COMMENT_SUCCESS,
  Actions.UPDATE_CONTACT_COMMENT_FAILURE,
)<UpdateRequestPayload<UpdateContactComment>, UpdateRequestPayload<UpdateContactComment>, AxiosError>();

// 답글 삭제
export const deleteContactCommentAsync = createAsyncAction(
  Actions.DELETE_CONTACT_COMMENT_REQUEST,
  Actions.DELETE_CONTACT_COMMENT_SUCCESS,
  Actions.DELETE_CONTACT_COMMENT_FAILURE,
)<DeleteRequestPayload, {}, AxiosError>();

const initialState: ContactState = {
  contacts: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
};

const contact = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.GET_CONTACTS_SUCCESS: {
      return produce(state, draft => {
        draft.contacts = action.payload;
      });
    }
    case Actions.CREATE_CONTACT_COMMENT_SUCCESS: {
      return produce(state, draft => {
        const currContactIndex = draft.contacts.content.findIndex(
          contact => (contact.contactId = action.payload.contactId),
        );
        if (currContactIndex > -1) {
          draft.contacts.content[currContactIndex] = action.payload;
        }
      });
    }
    default: {
      return state;
    }
  }
};

export default contact;
