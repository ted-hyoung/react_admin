// base
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// modules
import { Modal, Form, Input, Rate, Divider } from 'antd';
import moment from 'moment';

// store
import { StoreState } from 'store';
import { modalReviewAsync } from 'store/reducer/review';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

function ReviewDetailModal() {
  const { review, detailModalVisible } = useSelector((state: StoreState) => state.review);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(modalReviewAsync(false));
  }, [dispatch]);
  const created = useMemo(() => moment(review.created).format('YYYY-MM-DD hh:mm:ss'), [review]);
  return (
    <Modal visible={detailModalVisible} onCancel={handleClose} title="리뷰 상세">
      <Form layout="horizontal" {...formItemLayout}>
        {/* todo: order */}
        <Form.Item label="공구명">
          <Input value={'비클 앰플 공구 1차'} disabled />
        </Form.Item>
        <Form.Item label="주문번호">
          <Input value={'0000-0000-0000-0000'} disabled />
        </Form.Item>
        <Form.Item label="구매상품">
          <Input value={'01. 비클 앰플 1세트(옵션 : 주황마스크)'} disabled />
        </Form.Item>

        <Divider />

        <Form.Item label="아이디">
          <Input value={review.creator.loginId} disabled />
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
        <Form.Item label="이미지">
          <div>
            {Array(10)
              .fill('')
              .map((item, i) => (
                <img key={i} style={{ marginBottom: 5, marginRight: 5 }} src="http://placehold.it/100x100" alt="" />
              ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ReviewDetailModal;
