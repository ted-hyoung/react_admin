// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Checkbox, Row, Col, Input, Icon, Select } from 'antd';
import moment from 'moment';

// store
import { clearEvents } from 'store/reducer/event';

// components
import OrderSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/order/OrderSearchDate';

import { OrderSearchEventModal } from 'components';

// types
import { ResponseProduct } from 'types';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

// enums
import { PAYMENT_STATUSES, SHIPPING_STATUSES, DEFAULT_PAYMENT_STATUSES, DEFAULT_SHIPPING_STATUSES } from 'enums';

// assets
import './index.less';

// define
const { Option } = Select;

export interface EventList {
  key: number;
  sales: string;
  name: string;
  eventStatus: string;
  products: ResponseProduct[];
}

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const OrderSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields } = form;

  const [paymentChaeckALl, setPaymentCheckAll] = useState<boolean>(true);
  const [shippingCheckAll, setShippingCheckAll] = useState<boolean>(true);
  const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<EventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);

  const dispatch = useDispatch();

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

  const handleSearch = useCallback(() => {
    validateFields((err, val) => {
      if (!err) {
        Object.keys(val).forEach(key => {
          if (val[key] === undefined) {
            delete val[key];
            return;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
          if (key === 'paymentStatuses') {
            if (paymentChaeckALl) {
              delete val[key];
              return;
            }
          }
          if (key === 'shippingStatuses') {
            if (shippingCheckAll) {
              delete val[key];
              return;
            }
          }
        });
        onSearch(val);
      }
    });
  }, [onSearch, paymentChaeckALl, shippingCheckAll]);

  const handleReset = useCallback(() => {
    resetFields();
    setPaymentCheckAll(true);
    setShippingCheckAll(true);
    onReset();
  }, [onReset]);

  const handleEventSearchModal = (visable: boolean) => {
    setEventSearchModal(visable);
    setEventsData([]);
    dispatch(clearEvents);
  };

  return (
    <Form className="order-search-bar">
      <Row style={{ paddingBottom: 15 }}>
        <Col span={2} style={{ paddingTop: 5, width: '10%' }}>
          <span style={{ fontSize: 18, textAlign: 'center' }}>검색 항목</span>
        </Col>
      </Row>
      <Row style={{ paddingBottom: 15 }}>
        <Col span={3} style={{ paddingTop: 6, textAlign: 'center' }}>
          <span>주문인</span>
        </Col>
        <Col span={4}>
          <Input width={50} />
        </Col>
        <Col span={2} style={{ paddingTop: 6, textAlign: 'center' }}>
          <span>주문번호</span>
        </Col>
        <Col span={4}>
          <Input width={50} />
        </Col>
        <Col span={2} style={{ paddingTop: 6, textAlign: 'center', width: '10%' }}>
          <span>배송 받는 분</span>
        </Col>
        <Col span={4}>
          <Input width={50} />
        </Col>
      </Row>
      <Row style={{ paddingBottom: 15 }}>
        <Col span={3} style={{ paddingTop: 6, textAlign: 'center' }}>
          <span>송장번호</span>
        </Col>
        <Col span={4}>
          <Input width={60} />
        </Col>
        <Col span={3} style={{ paddingTop: 6, textAlign: 'center', width: '12%' }}>
          <span>주문인 휴대폰 번호</span>
        </Col>
        <Col span={4}>
          <Input width={50} />
        </Col>
        <Col span={4} style={{ paddingTop: 6, textAlign: 'center', width: '15%' }}>
          <span>배송 받는 분 휴대폰 번호</span>
        </Col>
        <Col span={4}>
          <Input width={50} />
        </Col>
      </Row>
      <Row style={{ paddingBottom: 15 }}>
        <Col span={2} style={{ paddingTop: 5, width: '10%' }}>
          <span style={{ fontSize: 18, textAlign: 'center' }}>공구명</span>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => handleEventSearchModal(true)} style={{ width: 150 }}>
            공구 검색
          </Button>
          <Icon type="search" style={{ fontSize: 20, marginTop: 7, marginLeft: 5 }} />
        </Col>
      </Row>
      <Col span={2} style={{ paddingTop: 5, width: '10%' }}>
        <span style={{ fontSize: 18, textAlign: 'center' }}>검색 기간</span>
      </Col>
      <Row>
        <Col span={18}>
          <Form.Item>
            {getFieldDecorator('date', {
              initialValue: [moment(new Date()).format(startDateFormat), moment(new Date()).format(endDateFormat)],
              getValueFromEvent: getValueFromEventForSearchDate,
              getValueProps: getValuePropsForSearchDate,
            })(<OrderSearchDate />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={2} style={{ paddingTop: 7, width: '10%' }}>
          <span style={{ fontSize: 18, textAlign: 'center' }}>결제 상태</span>
        </Col>
        <Col span={18}>
          <Form.Item>
            <Checkbox onChange={handleChangePaymentStatusesAll} checked={paymentChaeckALl}>
              전체
            </Checkbox>
            {getFieldDecorator('paymentStatuses', {
              initialValue: DEFAULT_PAYMENT_STATUSES,
            })(<Checkbox.Group options={PAYMENT_STATUSES} onChange={handleChangePaymentStatuses} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={2} style={{ paddingTop: 7, width: '10%' }}>
          <span style={{ fontSize: 18, textAlign: 'center' }}>배송 상태</span>
        </Col>
        <Col span={18}>
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
      <Form.Item>
        <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
          검색
        </Button>
        <Button onClick={handleReset}>초기화</Button>
      </Form.Item>
      <OrderSearchEventModal
        eventSearchModal={eventSearchModal}
        handleEventSearchModal={handleEventSearchModal}
        eventsData={eventsData}
        setEventsData={setEventsData}
        setSelectedEvents={setSelectedEvents}
      />
    </Form>
  );
});

export default OrderSearchBar;
