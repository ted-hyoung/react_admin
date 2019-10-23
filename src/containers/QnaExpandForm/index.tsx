// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Row, Col, Button, Input, Statistic, Popconfirm } from 'antd';
import moment from 'moment';

// types
import { ResponseQna } from 'models';

// store
import {
  createQnaCommentAsync,
  updateQnaCommentAsync,
  deleteQnaCommentAsync,
  updateQnaExposeAsync,
} from 'store/reducer/qna';

// defines
const { TextArea } = Input;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

interface Props {
  record: ResponseQna;
}

function QnaExpandForm(props: Props) {
  const { qnaId, contents, expose, qnaComment } = props.record;
  const [comment, setComment] = useState(qnaComment ? qnaComment.comment : '');
  const [activation, setActivation] = useState(false);
  const dispatch = useDispatch();

  const handleChangeComment = useCallback(e => {
    setComment(e.target.value);
  }, []);

  const handleChangeActivation = useCallback(() => {
    setActivation(!activation);
  }, [activation]);

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
    (qnaId, qnaCommentId) => {
      const data = {
        qnaId,
        qnaCommentId,
        comment,
      };

      dispatch(updateQnaCommentAsync.request(data));
      setActivation(!activation);
    },
    [dispatch, comment, activation],
  );

  const handleDeleteComment = useCallback(
    (qnaId, qnaCommentId) => {
      const data = {
        qnaId,
        qnaCommentId,
      };

      dispatch(deleteQnaCommentAsync.request(data));
      setComment('');
    },
    [dispatch],
  );

  const handleUpdateExpose = useCallback(
    (qnaId, expose) => {
      const data = {
        qnaId,
        expose: !expose,
      };

      dispatch(updateQnaExposeAsync.request(data));
    },
    [dispatch],
  );

  return (
    <div className="qna-expand-form">
      <Row type="flex" style={{ marginBottom: 20 }}>
        <Col span={2}>
          <strong>질문</strong>
        </Col>
        <Col span={20}>
          <p style={{ wordBreak: 'break-all' }}>{contents}</p>
        </Col>
        <Col span={2} style={{ textAlign: 'right' }}>
          <Popconfirm
            title={expose ? '해당 게시물이 비공개 처리됩니다.' : '해당 게시물이 공개 처리됩니다.'}
            onConfirm={() => handleUpdateExpose(qnaId, expose)}
            okText="확인"
            cancelText="취소"
          >
            <Button type={expose ? 'primary' : 'dashed'}>{expose ? '공개' : '비공개'}</Button>
          </Popconfirm>
        </Col>
      </Row>

      <Row type="flex">
        <Col span={2}>
          <strong>답변</strong>
        </Col>
        <Col span={22}>
          <Row type="flex" style={{ marginBottom: 10 }}>
            <Col span={18}>{qnaComment && qnaComment.creator.username}</Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              {qnaComment ? (
                moment(qnaComment.created).format(DATE_FORMAT)
              ) : (
                <Statistic value={comment.length} suffix="/ 500" />
              )}
            </Col>
          </Row>

          <div style={{ marginBottom: 10 }}>
            <TextArea
              key={qnaId}
              disabled={qnaComment ? !activation : activation}
              rows={4}
              maxLength={500}
              value={comment}
              onChange={handleChangeComment}
            />
          </div>
          <div>
            {qnaComment ? (
              <>
                {activation ? (
                  <Popconfirm
                    title="답글을 수정하시겠습니까?"
                    onConfirm={() => handleUpdateComment(qnaId, qnaComment.qnaCommentId)}
                    okText="확인"
                    cancelText="취소"
                  >
                    <Button type="primary">등록</Button>
                  </Popconfirm>
                ) : (
                  <>
                    <Button style={{ marginRight: 4 }} type="primary" onClick={handleChangeActivation}>
                      수정
                    </Button>
                    <Popconfirm
                      title="답글을 삭제하시겠습니까?"
                      onConfirm={() => handleDeleteComment(qnaId, qnaComment.qnaCommentId)}
                      okText="확인"
                      cancelText="취소"
                    >
                      <Button type="danger">삭제</Button>
                    </Popconfirm>
                  </>
                )}
              </>
            ) : (
              <Popconfirm
                title="답글을 등록하시겠습니까?"
                onConfirm={() => handleCreateComment(qnaId)}
                okText="확인"
                cancelText="취소"
              >
                <Button type="primary">등록</Button>
              </Popconfirm>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default QnaExpandForm;
