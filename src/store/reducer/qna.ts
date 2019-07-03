import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';
import * as Actions from 'store/action/qnaAction';
import { ResponseQna, RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction } from 'types';

// types
export interface QnaState {
  qna: {
    content: ResponseQna[];
    first?: boolean;
    last?: boolean;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
  };
}

// action
export const getQnaAsync = createAsyncAction(Actions.GET_QNA_REQUEST, Actions.GET_QNA_SUCCESS, Actions.GET_QNA_FAILURE)<
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction
>();

export const createQnaCommentAsync = createAsyncAction(
  Actions.CREATE_QNA_COMMENT_REQUEST,
  Actions.CREATE_QNA_COMMENT_SUCCESS,
  Actions.CREATE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateQnaCommentAsync = createAsyncAction(
  Actions.UPDATE_QNA_COMMENT_REQUEST,
  Actions.UPDATE_QNA_COMMENT_SUCCESS,
  Actions.UPDATE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const deleteQnaCommentAsync = createAsyncAction(
  Actions.DELETE_QNA_COMMENT_REQUEST,
  Actions.DELETE_QNA_COMMENT_SUCCESS,
  Actions.DELETE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateQnaExposeAsync = createAsyncAction(
  Actions.UPDATE_QNA_EXPOSE_REQUEST,
  Actions.UPDATE_QNA_EXPOSE_SUCCESS,
  Actions.UPDATE_QNA_EXPOSE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: QnaState = {
  qna: {
    content: [],
  },
};

const qna = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_QNA_SUCCESS: {
      return produce(state, draft => {
        const { page, content, last, totalElements } = action.payload;
        if (page === 0) {
          draft.qna = action.payload;
        } else {
          draft.qna.content = state.qna.content.concat(content);
          draft.qna.last = last;
          draft.qna.totalElements = totalElements;
        }
      });
    }
    case Actions.CREATE_QNA_COMMENT_SUCCESS: {
      return state;
    }
    case Actions.UPDATE_QNA_COMMENT_SUCCESS: {
      return state;
    }
    case Actions.DELETE_QNA_COMMENT_SUCCESS: {
      return produce(state, draft => {
        const item = draft.qna.content.find(item => item.qnaId === action.payload);

        if (item) {
          item.qnaComment = null;
          item.qnaStatus = 'WAIT';
        }
      });
    }
    case Actions.UPDATE_QNA_EXPOSE_SUCCESS: {
      return produce(state, draft => {
        const { qnaId, expose } = action.payload;
        const item = draft.qna.content.find(item => item.qnaId === qnaId);

        if (item) {
          item.expose = expose;
        }
      });
    }
    default: {
      return state;
    }
  }
};

export default qna;
