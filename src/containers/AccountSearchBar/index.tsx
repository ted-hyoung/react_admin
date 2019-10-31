// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Button, Checkbox, Row, Col, Input, Icon, Descriptions, Select, Radio } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';

// store
import { clearEvents } from 'store/reducer/event';

// components
import { SearchDateFormItem } from 'components';

// containers
import { EventSearch, EventSearchModal } from 'containers';

// models, enums
import { ResponseProduct } from 'models';
import {
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  DEFAULT_PAYMENT_STATUSES,
  DEFAULT_SHIPPING_STATUSES,
  PAYMENT_VIRTUAL_STATUSES,
  PAYMENT_STATUSES_TOTAL,
  DEFAULT_PAYMENT_STATUSES_TOTAL,
} from 'enums';

// lib
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';

// enums

import './index.less';

// define

export interface EventList {
  key: number;
  sales: string;
  name: string;
  eventStatus: string;
  products: ResponseProduct[];
}
const { Option } = Select;

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const OrderSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;

  const dispatch = useDispatch();

  const [paymentCheckAll, setPaymentCheckAll] = useState<boolean>(true);
  const [shippingCheckAll, setShippingCheckAll] = useState<boolean>(true);
  const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<EventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);

  const handleChangePaymentStatuses = useCallback(values => {
    setPaymentCheckAll(values.length === PAYMENT_STATUSES.length);
  }, []);

  const handleChangeShippingStatuses = useCallback(values => {
    setShippingCheckAll(values.length === SHIPPING_STATUSES.length);
  }, []);

  const handleChangePaymentStatusesAll = useCallback(e => {
    setFieldsValue({
      paymentStatuses: e.target.checked ? DEFAULT_PAYMENT_STATUSES_TOTAL : [],
    });
    setPaymentCheckAll(e.target.checked);
  }, []);

  const handleChangeShippingStatusesAll = useCallback(e => {
    setFieldsValue({
      shippingStatuses: e.target.checked ? DEFAULT_SHIPPING_STATUSES : [],
    });
    setShippingCheckAll(e.target.checked);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();

      validateFields((errors, values) => {
        if (!errors) {
          Object.keys(values).forEach(key => {
            if (values[key] === undefined) {
              delete values[key];
              return;
            }
            if (key === 'dates') {
              const dates = values[key];

              values.startDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.endDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);

              delete values[key];
              return;
            }
            // if (key === 'paymentStatuses') {
            //   if (paymentCheckAll) {
            //     delete values[key];
            //     return;
            //   }
            // }
            if (key === 'shippingStatuses') {
              if (shippingCheckAll) {
                delete values[key];
                return;
              }
            }
          });
          onSearch(values);
        }
      });
    },
    [onSearch, paymentCheckAll, shippingCheckAll],
  );

  const handleReset = useCallback(() => {
    resetFields();
    setPaymentCheckAll(true);
    setShippingCheckAll(true);
    onReset();
  }, [onReset]);

  const handleEventSearchModal = (visable: boolean) => {
    setEventSearchModal(visable);
    setEventsData([]);
    dispatch(clearEvents());
  };

  const handleChange = (value : string) => {
    console.log(value);
  };

  const onChangeRadio = (e : any) => {
    console.log('radio checked', e.target.value);
  };

  return (
    <>
      <Form className="order-search-bar" onSubmit={handleSubmit}>
        <Descriptions title="회원 정보 조회" bordered column={24}>
          <Descriptions.Item label="개인정보" span={24}>
            <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
              <Col className="text-align-center" span={4}>
                <span>
                    <Select defaultValue="" style={{ width: 120 }} onChange={handleChange}>
                      <Option value="">선택</Option>
                      <Option value="name">이름</Option>
                      <Option value="id">아이디</Option>
                      <Option value="tel">연락처</Option>
                      <Option value="address">주소</Option>
                    </Select>
                </span>
              </Col>
              <Col span={4}>{getFieldDecorator('username')(<Input width={50} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="회원등급" span={24}>
            <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
              <Col className="text-align-center" span={4}>
                  <span>
                    <Select defaultValue="" style={{ width: 120 }} onChange={handleChange}>
                      <Option value="">선택</Option>
                      <Option value="seed">씨앗</Option>
                      <Option value="tree">나무</Option>
                      <Option value="fruit">열매</Option>
                    </Select>
                </span>
              </Col>
              <Col span={4}>{getFieldDecorator('username')(<Input width={50} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="회원유형" span={24}>
            <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
              <Col className="text-align-center" span={7}>
                  <span>
                    <Radio.Group onChange={onChangeRadio}>
                      <Radio value=''>전체</Radio>
                      <Radio value={'nomal'}>일반회원</Radio>
                      <Radio value={'resting'}>휴면회원</Radio>
                      <Radio value={'withdrawal'}>탈퇴회원</Radio>

                    </Radio.Group>
                </span>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="가입일" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('orderDates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="주문일" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('orderDates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="공구명" span={24}>
            <Row>
              <Col span={24} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Button type="primary" onClick={() => handleEventSearchModal(true)} style={{ width: 150 }}>
                  공구 검색
                </Button>
                <Icon type="search" style={{ fontSize: 20, marginLeft: 10 }} />
              </Col>
              <Col span={24}>{getFieldDecorator('events')(<EventSearch selectedEvents={selectedEvents} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="접속일" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('dates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
        </Descriptions>
        <Form.Item>
          <Button htmlType="submit" type="primary" style={{ marginRight: 5 }}>
            검색
          </Button>
          <Button htmlType="button" onClick={handleReset}>
            초기화
          </Button>
        </Form.Item>
      </Form>
      <EventSearchModal
        eventSearchModal={eventSearchModal}
        handleEventSearchModal={handleEventSearchModal}
        eventsData={eventsData}
        setEventsData={setEventsData}
        setSelectedEvents={setSelectedEvents}
      />
    </>
  );
});

export default OrderSearchBar;
