// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import {
  getQnaAsync,
  createQnaCommentAsync,
  updateQnaCommentAsync,
  deleteQnaCommentAsync,
  updateQnaExposeAsync,
} from 'store/reducer/qna';

// modules
import { Input, Button } from 'antd';
import { OrderTable } from 'components';

const Qna = () => {
  const qna = useSelector((storeState: StoreState) => storeState.qna.qna);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const getQna = useCallback(() => {
    const params = {
      page: 0,
      size: 20,
    };

    dispatch(getQnaAsync.request(params));
  }, [dispatch]);

  useEffect(() => {
    getQna();
  }, [getQna]);

  const handleCommentChange = useCallback(e => {
    setComment(e.target.value);
  }, []);

  const handleCreateComment = useCallback(
    qnaId => {
      const data = {
        qnaId,
        comment,
      };

      dispatch(createQnaCommentAsync.request(data));
    },
    [dispatch, comment],
  );

  const handleUpdateComment = useCallback(
    (qnaId, qnaComment) => {
      const qnaCommentId = qnaComment.qnaCommentId;
      const data = {
        qnaId,
        qnaCommentId,
        comment,
      };

      dispatch(updateQnaCommentAsync.request(data));
    },
    [dispatch, comment],
  );

  const handleDeleteComment = useCallback(
    (qnaId, qnaComment) => {
      const qnaCommentId = qnaComment.qnaCommentId;
      const data = {
        qnaId,
        qnaCommentId,
      };

      dispatch(deleteQnaCommentAsync.request(data));
    },
    [dispatch],
  );

  const handleUpdateExpose = useCallback((qnaId, expose) => {
    const data = {
      qnaId,
      expose: !expose,
    };

    dispatch(updateQnaExposeAsync.request(data));
  }, []);

  return (
    <div className="qna">
      {qna.content.map(item => {
        return (
          <div key={item.qnaId}>
            {item.contents}
            <Input
              value={comment}
              defaultValue={item.qnaComment ? item.qnaComment.comment : ''}
              onChange={handleCommentChange}
            />

            {item.qnaComment !== null ? (
              <>
                <Button onClick={() => handleUpdateComment(item.qnaId, item.qnaComment)}>수정</Button>
                <Button onClick={() => handleDeleteComment(item.qnaId, item.qnaComment)}>삭제</Button>
              </>
            ) : (
              <Button onClick={() => handleCreateComment(item.qnaId)}>등록</Button>
            )}

            <Button onClick={() => handleUpdateExpose(item.qnaId, item.expose)}>
              {item.expose ? '공개' : '비공개'}
            </Button>
          </div>
        );
      })}

      <OrderTable dataSource={qna.content} />
    </div>
  );
};

export default Qna;
