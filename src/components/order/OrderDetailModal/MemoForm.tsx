// base
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store';

// modules
import { Form, Table, Descriptions, Input, Select, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { createOrderMemoAsync } from 'store/reducer/orderMemo';

interface MemoFormProps extends FormComponentProps {}

function MemoForm(props: MemoFormProps) {
  const { form } = props;

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const { orderId } = useSelector((state: StoreState) => ({
    orderId: state.order.order.orderId,
  }));

  const dispatch = useDispatch();

  const handleCreateOrderMemo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        dispatch(createOrderMemoAsync.request({ orderId, createOrderMemo: values }));
      }
    });
  };

  return (
    <Form onSubmit={handleCreateOrderMemo}>
      <Descriptions style={{ marginBottom: 10 }} bordered colon={false} column={24}>
        <Descriptions.Item label="메모 내용 등록" span={24}>
          {getFieldDecorator('orderMemoContents')(
            <TextArea style={{ resize: 'none' }} rows={3} placeholder="내용을 입력해주세요" />,
          )}
          {getFieldDecorator('importance', {
            initialValue: 'HIGH',
          })(
            <Select style={{ width: 120 }}>
              <Select.Option value="HIGH">상</Select.Option>
              <Select.Option value="MIDDLE">중</Select.Option>
              <Select.Option value="ROW">하</Select.Option>
            </Select>,
          )}
        </Descriptions.Item>
      </Descriptions>
      <Row type="flex" justify="end">
        <Col>
          <Button type="primary" htmlType="submit">
            등록
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create<MemoFormProps>()(MemoForm);
