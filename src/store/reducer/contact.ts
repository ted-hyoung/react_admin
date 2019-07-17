import { createAsyncAction } from 'typesafe-actions';
import produce from 'immer';

// types
import {
  PageWrapper,
  ResponseContact,
  GetListRequestPayload,
  GetRequestPayload,
  CreateContactComment,
  CreateRequestPayload,
  UpdateRequestPayload,
  UpdateContactComment,
  DeleteRequestPayload,
  SearchContact,
  CountContact,
} from 'types';
import { AxiosError } from 'axios';
import { AnyAction } from 'redux';

// store
import * as Actions from 'store/action/contactAction';

export interface ContactState {
  contacts: PageWrapper<ResponseContact>;
  counts: CountContact;
}

// 목록 조회
export const getContactsAsync = createAsyncAction(
  Actions.GET_CONTACTS_REQUEST,
  Actions.GET_CONTACTS_SUCCESS,
  Actions.GET_CONTACTS_FAILURE,
)<GetListRequestPayload<SearchContact>, PageWrapper<ResponseContact>, AxiosError>();

// 상세 조회
export const getContactAsync = createAsyncAction(
  Actions.GET_CONTACT_REQUEST,
  Actions.GET_CONTACT_SUCCESS,
  Actions.GET_CONTACT_FAILURE,
)<GetRequestPayload, ResponseContact, AxiosError>();

// 답글 등록
export const createContactCommentAsync = createAsyncAction(
  Actions.CREATE_CONTACT_COMMENT_REQUEST,
  Actions.CREATE_CONTACT_COMMENT_SUCCESS,
  Actions.CREATE_CONTACT_COMMENT_FAILURE,
)<CreateRequestPayload<CreateContactComment>, {}, AxiosError>();

// 답글 수정
export const updateContactCommentAsync = createAsyncAction(
  Actions.UPDATE_CONTACT_COMMENT_REQUEST,
  Actions.UPDATE_CONTACT_COMMENT_SUCCESS,
  Actions.UPDATE_CONTACT_COMMENT_FAILURE,
)<UpdateRequestPayload<UpdateContactComment>, {}, AxiosError>();

// 답글 삭제
export const deleteContactCommentAsync = createAsyncAction(
  Actions.DELETE_CONTACT_COMMENT_REQUEST,
  Actions.DELETE_CONTACT_COMMENT_SUCCESS,
  Actions.DELETE_CONTACT_COMMENT_FAILURE,
)<DeleteRequestPayload, {}, AxiosError>();

// count
export const getContactsCountAsync = createAsyncAction(
  Actions.GET_CONTACTS_COUNNT_REQUEST,
  Actions.GET_CONTACTS_COUNNT_SUCCESS,
  Actions.GET_CONTACTS_COUNNT_FAILURE,
)<{}, CountContact, AxiosError>();

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
  counts: {
    wait: 0,
    complete: 0,
  },
};

const contact = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.GET_CONTACTS_SUCCESS: {
      return produce(state, draft => {
        draft.contacts = action.payload;
      });
    }
    case Actions.GET_CONTACT_SUCCESS: {
      return produce(state, draft => {
        const currIndex = draft.contacts.content.findIndex(contact => contact.contactId === action.payload.contactId);
        draft.contacts.content[currIndex] = action.payload;
      });
    }
    case Actions.GET_CONTACTS_COUNNT_SUCCESS: {
      return produce(state, draft => {
        draft.counts = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default contact;
