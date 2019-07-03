// base
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// modules
import { Modal, Form, Input, Rate } from 'antd';
import moment from 'moment';

// store
import { StoreState } from 'store';
import { modalReviewAsync } from 'store/reducer/review';

function ReviewDetailModal() {
  const { review, detailModalVisible } = useSelector((state: StoreState) => state.review);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(modalReviewAsync(false));
  }, [dispatch]);
  const created = useMemo(() => moment(review.created).format('YYYY-MM-DD hh:mm:ss'), [review]);
  return (
    <Modal visible={detailModalVisible} onCancel={handleClose}>
      <Form>
        {/* todo: order */}
        <Form.Item label="아이디">
          <Input value={review.creator.username} disabled />
        </Form.Item>
        <Form.Item label="연락처">
          <Input value={review.creator.phone} disabled />
        </Form.Item>
        <Form.Item label="작성일">
          <Input value={created} disabled />
        </Form.Item>
        <Form.Item label="평점">
          <Rate value={review.starRate} disabled />
        </Form.Item>
        <Form.Item label="내용">
          <Input.TextArea value={review.contents} style={{ height: 300 }} disabled />
        </Form.Item>
        {/* todo : image */}
      </Form>
    </Modal>
  );
}

export default ReviewDetailModal;
