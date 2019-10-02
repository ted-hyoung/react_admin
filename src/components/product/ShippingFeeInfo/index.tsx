// base
import React, { useEffect } from 'react';

// modules
import { Row, Col, Button, Form, message, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { useDispatch } from 'react-redux';

// types
import { ResponseEvent, ResponseShippingFeeInfo, UpdateEventShippingFeeInfo } from 'models';

// store
import { updateEventShippingFeeInfoAsync } from 'store/reducer/event';

// less
import './index.less';

interface Props extends FormComponentProps {
  shippingFreeInfo: ResponseShippingFeeInfo;
  event: ResponseEvent;
}

function ShippingFeeInfo(props: Props) {
  const { form } = props;
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
  const { shippingFreeInfo, event } = props;
  const { eventId } = event;
  const dispatch = useDispatch();

  useEffect(() => {
    setFieldsValue({
      shippingFee: shippingFreeInfo.shippingFee,
      shippingFreeCondition: shippingFreeInfo.shippingFreeCondition,
    });
  }, [shippingFreeInfo, setFieldsValue]);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((error, values: UpdateEventShippingFeeInfo) => {
      if (!error) {
        const { shippingFee, shippingFreeCondition } = values;
        const data = {
          eventId,
          data: {
            shippingFeeInfo: {
              shippingFee,
              shippingFreeCondition,
            },
          },
        };
        dispatch(updateEventShippingFeeInfoAsync.request(data));
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  return (
    <div className="shippingFee-info">
      <Form onSubmit={handleSubmit}>
        <div className="shippingFee-info-title">
          <h2>배송비 설정</h2>
        </div>
        <Row className="shippingFee-info-row" justify="space-around">
          <Col span={3} className="shippingFee-info-col-center">
            배송비 정보
          </Col>
          <Col span={2} className="shippingFee-info-col-right">
            배송비
          </Col>
          <Col span={3} className="shippingFee-info-col-margin">
            <Form.Item>
              {getFieldDecorator('shippingFee')(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  className="product-modal-input"
                  size="small"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={1} className="shippingFee-info-col-right">
            원
          </Col>
          <Col span={4} className="shippingFee-info-col-right">
            * 배송비 무료 조건 (금액 :
          </Col>
          <Col span={3} className="shippingFee-info-col-margin">
            <Form.Item>
              {getFieldDecorator('shippingFreeCondition')(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  className="product-modal-input"
                  size="small"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={4} className="shippingFee-info-col-left">
            원 이상 구매시 무료)
          </Col>
        </Row>
        <div className="shippingFee-info-button">
          <Button type="primary" size="large" htmlType="submit">
            배송비 수정
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Form.create<Props>()(ShippingFeeInfo);
