// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Button, Checkbox, Row, Col, Input, Icon, Descriptions, Select, Radio, message, InputNumber } from 'antd';
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
  DEFAULT_SHIPPING_STATUSES, ActionType,
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

const AccountSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;

  const dispatch = useDispatch();
  const [startAge, setStartAge] = useState<number>(0);
  const [endAge, setEndAge] = useState<number>(0);
  const [privateInfoKey, setPrivateInfoKey] = useState<string>('');
  const [selectedTotal, setSelectedTotal] = useState<string>('total');

  const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<EventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);

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

            if (key === 'endAge') {
              const startAge = values[`startAge`];
              const endAge = values[key];
              if(startAge > endAge){
                message.error("시작 나이가 종료나이보다 클 수 없습니다.");
                setFieldsValue({
                  startAge: endAge,
                });
                return false;
              }else if(startAge === 0 &&  endAge ===0){
                  delete values[key];
                  delete values[`startAge`];
                  return;
              }
            }

            if (key === 'accessDates') {
              const dates = values[key];
              values.accessStartDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.accessEndDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);
              delete values[key];
              return;
            }

            if (key === 'orderDates') {
              const dates = values[key];
              values.orderStartDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.orderEndDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);
              delete values[key];
              return;
            }

            if (key === 'signUpDates') {
              const dates = values[key];
              values.signUpStartDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.signUpEndDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);
              delete values[key];
              return;
            }

            if(key === 'privateInfo'){
              if(!privateInfoKey){
                  message.error('검색 하려는 개인 정보의 종류를 선택바랍니다.');
                  return false;
              }else{
                values[`${privateInfoKey}`] = values[key];
                delete values[key];
              }
            }
          });
          onSearch(values);
        }
      });
    },
    [onSearch, privateInfoKey],
  );

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
  }, [onReset]);

  const handleEventSearchModal = (visable: boolean) => {
    setEventSearchModal(visable);
    setEventsData([]);
    dispatch(clearEvents());
  };

  const handleChange = (value : string) => {
    console.log(value);
    setPrivateInfoKey(value);
  };

  const onChangeRadio = (e : any) => {
    console.log('radio checked', e.target.value);
  };

  const handleChangeSelectedTotal = (value : string) => {
    setSelectedTotal(value);
    console.log(value);
  };

  const getSelectedTotal = () => {

    if((selectedTotal === 'totalOrderAmount') || (selectedTotal === 'totalPaymentAmount')){
      return (
        <Col span={12} className="text-align-left" style={{minWidth:'316px'}}>
          {getFieldDecorator('privateInfo')(
            <>
              <Col className="text-align-left" span={3} style={{width:'156px'}}>
                <Form.Item>
                  {getFieldDecorator(`${selectedTotal}Start`, {
                    initialValue: 0,
                  })(<InputNumber
                      min={0}
                      type='number'
                      style={{ width: 100, textAlign: 'center' }}
                      placeholder="시작"
                    />)}
                  <Input
                    style={{
                      width: 55,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="원  ~ "
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator(`${selectedTotal}End`, {
                    initialValue: 0,
                  })(<InputNumber
                      min={0}
                      type='number'
                      style={{ width: 100, textAlign: 'center' }}
                      placeholder="시작"
                    />
                  )}
                  <Input
                    style={{
                      width: 52,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="원"
                    disabled
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Col>
      );
    }else if((selectedTotal === 'totalOrderCount') || (selectedTotal === 'totalPaymentCount')){
      return (
        <Col span={12} className="text-align-left" style={{minWidth:'316px'}}>
          {getFieldDecorator('privateInfo')(
            <>
              <Col className="text-align-left" span={3} style={{width:'156px'}}>
                <Form.Item>
                  {getFieldDecorator(`${selectedTotal}Start`, {
                    initialValue: 0,
                  })(<InputNumber
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    style={{
                      width: 55,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="건  ~ "
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator(`${selectedTotal}End`, {
                    initialValue: 0,
                  })(<InputNumber
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    style={{
                      width: 52,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="건"
                    disabled
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Col>
      );
    }else{
      return (
        <Col span={12} className="text-align-left" style={{minWidth:'316px'}}>
          &nbsp;
        </Col>
      )
    }
  };

  return (
    <>
      <Form className="order-search-bar" onSubmit={handleSubmit}>
        <Descriptions title="회원 정보 조회" bordered column={24}>
          <Descriptions.Item label="개인정보" span={24}>
            <Row type="flex" align="middle">
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <span>
                    <Select defaultValue={ privateInfoKey } style={{ width: 120 }} onChange={handleChange}>
                      <Option value="">선택</Option>
                      <Option value="name">이름</Option>
                      <Option value="id">아이디</Option>
                      <Option value="tel">연락처</Option>
                      <Option value="address">주소</Option>
                    </Select>
                </span>
              </Col>
              <Col span={4} style={{minWidth:'160px'}}>{getFieldDecorator('privateInfo')(<Input width={50} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="가입일" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('signUpDates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(
                    <SearchDateFormItem />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="나이" span={24}>
            <Row>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator('startAge', {
                    initialValue: 0,
                  })(<InputNumber
                    min={0}
                    max={99}
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    style={{
                      width: 55,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="세  ~ "
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator('endAge', {
                    initialValue: 0,
                  })(<InputNumber
                    min={0}
                    max={99}
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    style={{
                      width: 52,
                      borderLeft: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      marginRight: '0px',
                      marginLeft: '1px',
                      border: 'none',
                    }}
                    placeholder="세"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="구매금액/건수" span={24}>
            <Row type="flex" align="middle">
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <span>
                    <Select defaultValue={ selectedTotal } style={{ width: 120 }} onChange={handleChangeSelectedTotal}>
                      <Option value="total">전체</Option>
                      <Option value="totalOrderAmount">총 주문금액</Option>
                      <Option value="totalPaymentAmount">총 실결제금액</Option>
                      <Option value="totalOrderCount">총 주문 건수</Option>
                      <Option value="totalPaymentCount">충 실결제 건수</Option>
                    </Select>
                </span>
              </Col>
              {selectedTotal && getSelectedTotal()}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="주문일" span={24}>
            <Row>
              <Col span={11} style={{width:'349px'}}>
                <Form.Item>
                  {getFieldDecorator('orderDates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('firstOrder', {
                    valuePropName: 'checked',
                  })(
                    <Checkbox  className="cancel-modal-orders-cancel-form-checkbox">
                      첫 주문
                    </Checkbox>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="주문 상품" span={24}>
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
              <Col span={11} style={{width:'349px'}}>
                <Form.Item>
                  {getFieldDecorator('accessDates', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem />)}
                </Form.Item>
              </Col>
              <Col className="text-align-left" style={{lineHeight :'40px'}}>
                * 최근 1년까지 가능
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

export default AccountSearchBar;
