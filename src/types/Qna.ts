export interface ResponseQna {
  qnaId: number;
  qnaStatus?: string;
  eventName: string;
  contents: string;
  expose?: boolean;
  enable?: boolean;
  creator?: string;
  created?: string;
  qnaComment: QnaComment | null;
}

interface QnaComment {
  qnaCommentId: number;
  comment: string;
}
