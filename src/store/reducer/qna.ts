import produce from 'immer';
import { createAsyncAction } from 'typesafe-actions';
import * as Actions from 'store/action/qnaAction';
import { PageWrapper, ResponseQna, RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction } from 'models';

// types
export interface QnaState {
  qna: PageWrapper<ResponseQna>;
  waitStatusCount: number;
}

// action
// Q&A 목록 조회
export const getQnaAsync = createAsyncAction(Actions.GET_QNA_REQUEST, Actions.GET_QNA_SUCCESS, Actions.GET_QNA_FAILURE)<
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction
>();

// Q&A 답변 등록
export const createQnaCommentAsync = createAsyncAction(
  Actions.CREATE_QNA_COMMENT_REQUEST,
  Actions.CREATE_QNA_COMMENT_SUCCESS,
  Actions.CREATE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// Q&A 답변 수정
export const updateQnaCommentAsync = createAsyncAction(
  Actions.UPDATE_QNA_COMMENT_REQUEST,
  Actions.UPDATE_QNA_COMMENT_SUCCESS,
  Actions.UPDATE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// Q&A 답변 삭제
export const deleteQnaCommentAsync = createAsyncAction(
  Actions.DELETE_QNA_COMMENT_REQUEST,
  Actions.DELETE_QNA_COMMENT_SUCCESS,
  Actions.DELETE_QNA_COMMENT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 공개 & 비공개 수정
export const updateQnaExposeAsync = createAsyncAction(
  Actions.UPDATE_QNA_EXPOSE_REQUEST,
  Actions.UPDATE_QNA_EXPOSE_SUCCESS,
  Actions.UPDATE_QNA_EXPOSE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 우선 순위 수정
export const updateQnaSequenceAsync = createAsyncAction(
  Actions.UPDATE_QNA_SEQUENCE_REQUEST,
  Actions.UPDATE_QNA_SEQUENCE_SUCCESS,
  Actions.UPDATE_QNA_SEQUENCE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 답변대기 개수
export const getQnaStatusWaitAsync = createAsyncAction(
  Actions.GET_QNA_STATUS_WAIT_REQUEST,
  Actions.GET_QNA_STATUS_WAIT_SUCCESS,
  Actions.GET_QNA_STATUS_WAIT_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// reducers
const initialState: QnaState = {
  qna: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  waitStatusCount: 0,
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
    case Actions.UPDATE_QNA_COMMENT_SUCCESS: {
      return produce(state, draft => {
        const { qnaId, qnaComment } = action.payload;
        const item = draft.qna.content.find(item => item.qnaId === qnaId);

        if (item) {
          item.qnaComment = qnaComment;
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
    case Actions.GET_QNA_STATUS_WAIT_SUCCESS: {
      return produce(state, draft => {
        const { waitStatusCount } = action.payload;
        draft.waitStatusCount = waitStatusCount;
      });
    }
    default: {
      return state;
    }
  }
};

export default qna;
