// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import {
  Button,
  Checkbox,
  Row,
  Col,
  Input,
  Icon,
  Descriptions,
  Select,
  message,
  InputNumber,
} from 'antd';
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
  ageDatas,
  OrderSearch
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
  const [selectedTotal, setSelectedTotal] = useState<string>('TOTAL');

  const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<EventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();

      validateFields((errors, values) => {
        if (!errors) {
          Object.keys(values).forEach(key => {

            if ((values[key] === undefined) || (values[key] === "")) {
              delete values[key];
              return;
            }

            values.orderSearch = selectedTotal;

            if(selectedTotal !== 'TOTAL'){
              if (key === 'orderTotalEnded') {
                const start = values[`orderTotalStarted`];
                const end = values[key];
                if(start > end){
                  message.error("시작값이 종료값보다 클 수 없습니다.");
                  setFieldsValue({
                    orderTotalStarted: end,
                  });
                  return false;
                }else if(start === 0 ||  end ===0){
                  message.error("값을 입력 바랍니다.");
                  return false;
                }
              }
            }else{
              delete values[`orderSearch`];
              delete values[`orderTotalEnded`];
              delete values[`orderTotalStarted`];
            }

            if (key === 'consumerCreated') {
              const dates = values[key];
              values.consumerCreatedStarted= dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.consumerCreatedEnded = dates[1].format(LOCAL_DATE_TIME_FORMAT);
              delete values[key];
              return;
            }

            if (key === 'consumerAccessDate') {
              const dates = values[key];
              values.consumerAccessDateStarted = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.consumerAccessDateEnded = dates[1].format(LOCAL_DATE_TIME_FORMAT);
              delete values[key];
              return;
            }

            if (key === 'orderCreate') {
              const dates = values[key];
              values.orderCreateStarted = dates[0].format(LOCAL_DATE_TIME_FORMAT);
              values.orderCreateEnded = dates[1].format(LOCAL_DATE_TIME_FORMAT);
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
    [onSearch, privateInfoKey, selectedTotal],
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
    setPrivateInfoKey(value);
  };


  const handleChangeSelectedTotal = (value : string) => {
    setSelectedTotal(value);
  };

  const getSelectedTotal = () => {

    if(
      (selectedTotal === OrderSearch[OrderSearch.TOTAL_ORDER_AMOUNT]) ||
      (selectedTotal === OrderSearch[OrderSearch.TOTAL_ORDER_AMOUNT_COMPLETE])
    ){
      return (
        <Col span={12} className="text-align-left" style={{minWidth:'316px'}}>
          {getFieldDecorator('privateInfo')(
            <>
              <Col className="text-align-left" span={3} style={{width:'156px'}}>
                <Form.Item>
                  {getFieldDecorator(`orderTotalStarted`, {
                    initialValue: 0,
                  })(<InputNumber
                      min={0}
                      type='number'
                      style={{ width: 100, textAlign: 'center' }}
                      placeholder="시작"
                    />)}
                  <Input
                    className ="account-input"
                    placeholder="원  ~ "
                    disabled
                    style={{backgroundColor : '#ffffff'}}
                  />
                </Form.Item>
              </Col>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator(`orderTotalEnded`, {
                    initialValue: 0,
                  })(<InputNumber
                      min={0}
                      type='number'
                      style={{ width: 100, textAlign: 'center' }}
                      placeholder="시작"
                    />
                  )}
                  <Input
                    className ="account-input"
                    placeholder="원"
                    disabled
                    style={{backgroundColor : '#ffffff'}}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Col>
      );
    }else if(
      (selectedTotal === OrderSearch[OrderSearch.TOTAL_ORDER_COUNT]) ||
      (selectedTotal === OrderSearch[OrderSearch.TOTAL_ORDER_COUNT_COMPLETE])
    ){
      return (
        <Col span={12} className="text-align-left" style={{minWidth:'316px'}}>
          {getFieldDecorator('privateInfo')(
            <>
              <Col className="text-align-left" span={3} style={{width:'156px'}}>
                <Form.Item>
                  {getFieldDecorator(`orderTotalStarted`, {
                    initialValue: 0,
                  })(<InputNumber
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    className ="account-input"
                    placeholder="건  ~ "
                    disabled
                    style={{backgroundColor : '#ffffff'}}
                  />
                </Form.Item>
              </Col>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <Form.Item>
                  {getFieldDecorator(`orderTotalEnded`, {
                    initialValue: 0,
                  })(<InputNumber
                    type='number'
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="시작"
                  />)}
                  <Input
                    className ="account-input"
                    placeholder="건"
                    disabled
                    style={{backgroundColor : '#ffffff'}}
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
                      <Option value="username">이름</Option>
                      <Option value="phone">연락처</Option>
                    </Select>
                </span>
              </Col>
              <Col span={4} style={{ minWidth:'160px' }} >
                {getFieldDecorator('privateInfo')(<Input width={50} />)}
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="가입일" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('consumerCreated', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(
                    <SearchDateFormItem initValue={true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="나이" span={24}>
            <Row>
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                {getFieldDecorator('age', {
                  initialValue: '',
                  rules: [
                    {
                      required: false,
                      message: '연령대 선택해 주세요!',
                    },
                  ],
                })(
                  <Select className="cancel-modal-orders-cancel-form-option" >
                    <Option value="" style={{ zIndex: 2050 }}>선택</Option>
                    {ageDatas.map((item, index) => {
                      return (
                        <Option key={index} value={item.key} style={{ zIndex: 2050 }}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="구매금액/건수" span={24}>
            <Row type="flex" align="middle">
              <Col className="text-align-left" span={3} style={{width:'160px'}}>
                <span>
                    <Select defaultValue={ selectedTotal } style={{ width: 120 }} onChange={handleChangeSelectedTotal}>
                      <Option value="TOTAL">전체</Option>
                      <Option value="TOTAL_ORDER_AMOUNT">총 주문금액</Option>
                      <Option value="TOTAL_ORDER_AMOUNT_COMPLETE">총 실결제금액</Option>
                      <Option value="TOTAL_ORDER_COUNT">총 주문 건수</Option>
                      <Option value="TOTAL_ORDER_COUNT_COMPLETE">충 실결제 건수</Option>
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
                  {getFieldDecorator('orderCreate')(<SearchDateFormItem initValue={false}/>)}
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
                  {getFieldDecorator('consumerAccessDate', {
                    initialValue: [moment().startOf('day'), moment().endOf('day')],
                  })(<SearchDateFormItem initValue={true} />)}
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
