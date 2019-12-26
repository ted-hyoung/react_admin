// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Button, Checkbox, Row, Col, Input, Icon, Descriptions } from 'antd';
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
  DEFAULT_SHIPPING_STATUSES, DateActionType,
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

export interface BannerEventList {
  key: number;
  sales: string;
  name: string;
  eventStatus: string;
  eventUrl: string;
  products: ResponseProduct[];
  brandName: string,
  loginId:string,
  username:string
  eventId:number,
}

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
      paymentStatuses: e.target.checked ? DEFAULT_PAYMENT_STATUSES : [],
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

  return (
    <>
      <Form className="order-search-bar" onSubmit={handleSubmit}>
        <Descriptions title="주문 검색 조회" bordered column={24}>
          <Descriptions.Item label="검색어" span={24}>
            <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
              <Col className="text-align-center" span={4}>
                <span>주문인</span>
              </Col>
              <Col span={4}>{getFieldDecorator('username')(<Input width={50} />)}</Col>
              <Col className="text-align-center" span={4}>
                <span>주문번호</span>
              </Col>
              <Col className="text-align-center" span={4}>
                {getFieldDecorator('orderNo')(<Input width={50} />)}
              </Col>
              <Col className="text-align-center" span={4}>
                <span>배송 받는 분</span>
              </Col>
              <Col span={4}>{getFieldDecorator('recipient')(<Input width={50} />)}</Col>
            </Row>
            <Row type="flex" align="middle">
              <Col className="text-align-center" span={4}>
                <span>송장번호</span>
              </Col>
              <Col span={4}>{getFieldDecorator('invoice')(<Input width={60} />)}</Col>
              <Col className="text-align-center" span={4}>
                <span>주문인 휴대폰 번호</span>
              </Col>
              <Col className="text-align-center" span={4}>
                {getFieldDecorator('phone')(<Input width={50} />)}
              </Col>
              <Col className="text-align-center" span={4}>
                <span>배송 받는 분 휴대폰 번호</span>
              </Col>
              <Col span={4}>{getFieldDecorator('recipientPhone')(<Input width={50} />)}</Col>
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
          <Descriptions.Item label="검색 기간" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('dates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(
                    <SearchDateFormItem
                      optionDateLength={
                        [
                          DateActionType.TODAY,
                          DateActionType.RECENT_THREE_DAYS,
                          DateActionType.RECENT_WEEK,
                          DateActionType.RECENT_MONTH,
                          DateActionType.RECENT_THREE_MONTH
                        ]}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="결제 상태" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Checkbox onChange={handleChangePaymentStatusesAll} checked={paymentCheckAll}>
                    전체
                  </Checkbox>
                  {getFieldDecorator('paymentStatuses', {
                    initialValue: DEFAULT_PAYMENT_STATUSES,
                  })(<Checkbox.Group options={PAYMENT_STATUSES} onChange={handleChangePaymentStatuses} />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="배송 상태" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Checkbox onChange={handleChangeShippingStatusesAll} checked={shippingCheckAll}>
                    전체
                  </Checkbox>
                  {getFieldDecorator('shippingStatuses', {
                    initialValue: DEFAULT_SHIPPING_STATUSES,
                  })(<Checkbox.Group options={SHIPPING_STATUSES} onChange={handleChangeShippingStatuses} />)}
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
