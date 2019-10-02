// base
import React, { useState } from 'react';

// modules
import { Form, Descriptions, Input, Button, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ResponseShippingDestination } from 'models/Shipping';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { updateShippingDestinationByIdAsync } from 'store/reducer/order';

function RecipentForm(props: FormComponentProps) {
  const { form } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const [updating, setUpdating] = useState(false);

  const { orderId, shippingDestination, memo } = useSelector((state: StoreState) => state.order.order);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updating) {
      setUpdating(true);

      return;
    }

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { memo, ...others } = values;

        const updateOrderShippingDestination = {
          memo,
          shippingDestination: {
            ...others,
          },
        };

        console.log(updateOrderShippingDestination);

        dispatch(updateShippingDestinationByIdAsync.request({ orderId, updateOrderShippingDestination }));

        setUpdating(false);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Descriptions bordered colon={false} column={24} style={{ marginBottom: 10 }}>
        <Descriptions.Item span={24} label="수령자명">
          {getFieldDecorator('recipient', {
            initialValue: shippingDestination ? shippingDestination.recipient : '',
          })(<Input disabled={!updating} />)}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="연락처">
          {getFieldDecorator('recipientPhone', {
            initialValue: shippingDestination ? shippingDestination.recipientPhone : '',
          })(<Input disabled={!updating} />)}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="배송지 주소">
          <Row gutter={20}>
            <Col span={4}>
              {getFieldDecorator('recipientZipCode', {
                initialValue: shippingDestination ? shippingDestination.recipientZipCode : '',
              })(<Input maxLength={6} disabled={!updating} />)}
            </Col>
            <Col span={10}>
              {getFieldDecorator('recipientAddress', {
                initialValue: shippingDestination ? shippingDestination.recipientAddress : '',
              })(<Input disabled={!updating} />)}
            </Col>
            <Col span={10}>
              {getFieldDecorator('recipientAddressDetail', {
                initialValue: shippingDestination ? shippingDestination.recipientAddressDetail : '',
              })(<Input disabled={!updating} />)}
            </Col>
          </Row>
        </Descriptions.Item>
        <Descriptions.Item span={24} label="배송 메시지">
          {getFieldDecorator('memo', {
            initialValue: memo ? memo : '',
          })(<Input disabled={!updating} />)}
        </Descriptions.Item>
      </Descriptions>
      <Row type="flex" justify="end">
        <Col>
          <Button type="primary" htmlType="submit">
            {updating ? '등록' : '수정'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create<FormComponentProps>()(RecipentForm);
