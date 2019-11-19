// base
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';

// modules
import {
  Modal,
  Table,
  Row,
  Col,
  Descriptions,
  Result,
  Tag,
  Radio,
  Button,
  InputNumber,
  Input,
  Icon,
  Tabs,
  message, Rate,
} from 'antd';
import { Element, scroller } from 'react-scroll';
import moment from 'moment';

// components
import { PaginationTable, ScrollspyTabs } from 'components';

// lib
import { endDateFormat, setPagingIndex, sortedString, startDateFormat } from 'lib/utils';

// enums
import { EventStatus, PaymentMethod, PaymentStatus, ShippingStatus, SocialProviderCode } from 'enums';

import './index.less';
import {
  ResponseAccounts, ResponseOrdersAccount,
  SearchOrder,
} from '../../models';
import Form, { FormComponentProps } from 'antd/lib/form';
import { getOrderByIdAsync, getOrdersAsync } from '../../store/reducer/order';
import { getAccountDetailAsync, getAccountOrdersAsync } from '../../store/action/account.action';
import { getEventByIdAsync } from '../../store/reducer/event';
import { isNumber } from 'util';
import { ColumnProps } from 'antd/lib/table';
import EventList from '../../pages/EventList';
import { OrderDetailModal } from '../index';

interface AccountDetailModalProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  consumerId: number;
}
const { TabPane } = Tabs
;
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};
const AccountDetailModal = Form.create<AccountDetailModalProps>()((props: AccountDetailModalProps) => {
// function AccountDetailModal(props: AccountDetailModalProps) {
  const { visible, onCancel, consumerId, form } = props;
  // const { consumerId , socialProvider, username, marketingInfoAgree, created, phone } = account;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;
  const dispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modifiable, setModifiable] = useState<boolean>(false);
  const [detailOrderId, setDetailOrderId] = useState();
  const [submitable, setSubmitable] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const { accountDetail, accountOrders } = useSelector((storeState: StoreState) => storeState.accountState);
  const { content } = useSelector((storeState: StoreState) => storeState.order.orders);
  const { created, loginId, username, phone, email, socialProvider, marketingInfoAgree} = accountDetail;
  const { orders, totalOrderCompleteAmount} = accountOrders;

  console.log(content);

  const onChangeRadio = (e : any) => {
    console.log('radio checked', e.target.value);
  };

  const getDetailAccount = useCallback(
    (consumerId : number) => {
      dispatch(
        getAccountDetailAsync.request({ consumerId }),
      );
    },
    [dispatch],
  );

  const getOrdersAccount = useCallback(
    (page: number, size = 10) => {
      dispatch(
        getAccountOrdersAsync.request({
          page,
          size,
          consumerId :Number(consumerId)
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getDetailAccount(Number(consumerId));
    getOrdersAccount(0);
  }, [getDetailAccount]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
        validateFields((errors, values) => {
          console.log(values);
          if (!errors) {
            Object.keys(values).forEach(key => {
              if (values[key] === undefined) {
                delete values[key];
                return;
              }
            });
            console.log(values);
            // setModifiable(false);
            // onSearch(values);
          }
        }
      );
    },
    [],
  );
  const handleChangeInfo = (state:boolean) => {
    setModifiable(state);
  };

  const handleChangeCancelInfo = (state:boolean) => {
    setModifiable(state);
  };

  const handleChangePageSize = useCallback(
    (value: number) => {
      getOrdersAccount(0, value);
    },
    [getOrdersAccount],
  );

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getOrdersAccount(currentPage - 1);
    },
    [getOrdersAccount],
  );

  const pagination = useMemo(() => {
    return {
      total: orders.totalElements,
      pageSize: orders.size,
      onChange: handlePaginationChange,
    };
  }, [orders]);

  const handleCancel = () => {
    setDetailVisible(false);
  };



  const onRow = (recode: ResponseOrdersAccount) => {
    return {
     // onClick: () => history.push('/events/detail/' + recode.key),
      onClick: () =>  {
        setDetailVisible(true);
        setDetailOrderId(recode.orderId);
        dispatch(getOrderByIdAsync.request({ id: recode.orderId }));
      }
    };
  };

  const data: ResponseOrdersAccount[] = orders.content.map((item, i) => {
    return {
      key: i + 1,
      no: setPagingIndex(orders.totalElements, orders.page, orders.size, i),
      orderId: item.orderId,
      created: `${moment(item.created).format('YYYY-MM-DD')}`,
      orderNo: item.orderNo,
      totalAmount: item.totalAmount,
      paymentMethod: PaymentMethod[item.paymentMethod],
      paymentStatuses: PaymentStatus[PaymentStatus[item.paymentStatuses]],
      shippingStatuses: ShippingStatus[ShippingStatus[item.shippingStatuses]],
    };
  });

  const colums: ColumnProps<ResponseOrdersAccount>[] = [
    {
      title: '번호',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '주문일',
      dataIndex: 'created',
      key: 'created',
      sorter: (a, b) => moment(a.created).unix() - moment(b.created).unix(),
    },
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '실결제금',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value, record) => (
        Number(record.totalAmount).toLocaleString()+'원'
      ),
    },
    {
      title: '결제수단',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '결제',
      dataIndex: 'paymentStatuses',
      key: 'paymentStatuses',
    },
    {
      title: '배송',
      dataIndex: 'shippingStatuses',
      key: 'shippingStatuses',
    },
  ];

  return (
    <Modal
      centered
      destroyOnClose
      className="account-detail-modal"
      visible={visible}
      footer={null}
      title="회원상세정보"
      onCancel={onCancel}
    >
      <div className="account-info">
        <Row type="flex" gutter={20}>
          <Col>
            <strong>회원기본정보</strong>
          </Col>
          <Col>
            <strong>가입일: </strong>
            <span>{moment(created).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Col>
          <Col>
            <strong>최근 방문일: </strong>
            <span>{moment(created).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Col>
        </Row>
      </div>
      {/*<Tabs type="card">*/}
      {/*  <TabPane tab="회원기본정보" key="1">*/}
          <Form onSubmit={handleSubmit}>
            <Descriptions bordered colon={false} column={24}>
              <Descriptions.Item  span={8} label="아이디">
                {loginId}
              </Descriptions.Item>
              <Descriptions.Item  span={8} label="이름">
                {username}
              </Descriptions.Item>
              <Descriptions.Item span={8} label="휴대폰번호">
                {modifiable ?
                  (
                    <Form.Item style={{ marginBottom: '0px'}}>
                      {getFieldDecorator('phone', {
                        initialValue: phone === undefined ? null : phone,
                        rules: [
                          {
                            required: false,
                            message: '전화번호를 입력해주세요',
                          },
                        ],
                      })(<Input size="default" placeholder="전화번호" prefix={<Icon type="phone" />} />)}
                    </Form.Item>
                  ):(
                    phone
                  )
                }
              </Descriptions.Item>loginMethod
              <Descriptions.Item span={8} label="이메일">
                {modifiable ?
                  (
                    <Form.Item style={{ marginBottom: '0px'}}>
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            required: false,
                            message: '이메일을 입력해주세요',
                          },
                        ],
                      })(<Input size="default" placeholder="이메일" prefix={<Icon type="mail" />} />)}
                    </Form.Item>
                  ):(
                    'sample@imform.co.kr'
                  )
                }
              </Descriptions.Item>
              <Descriptions.Item span={8} label="로그인 방법">
                {SocialProviderCode[socialProvider] === SocialProviderCode.KAKAO &&
                <Tag
                  style={{ boxShadow: '1px 1px 1px 1px #b3b3b3', color:  '#381e1f' }}
                  color={'#e4d533'}
                >
                  {SocialProviderCode[socialProvider]}
                </Tag>
                }
                {SocialProviderCode[socialProvider] === SocialProviderCode.NAVER &&
                <Tag
                  style={{ boxShadow: '1px 1px 1px 1px #b3b3b3', color: '#ffffff' }}
                  color={'#1bba00'}
                >
                  {SocialProviderCode[socialProvider]}
                </Tag>
                }
                {SocialProviderCode[socialProvider] === SocialProviderCode.null &&
                <Tag
                  style={{ boxShadow: '1px 1px 1px 1px #b3b3b3', color: '#ffffff' }}
                  color={'#909090'}
                >
                  {SocialProviderCode[socialProvider]}
                </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item span={8}  label="마케팅 정보 수신 동의">
                <Radio.Group onChange={onChangeRadio} defaultValue={marketingInfoAgree} disabled={!modifiable}>
                  <Radio value={true}>수신</Radio>
                  <Radio value={false}>수신거부</Radio>
                </Radio.Group>
              </Descriptions.Item>
              <Descriptions.Item  span={8} label="가입일">
                {moment(created).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item  span={8} label="최근방문일">
                {moment(created).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item  span={8} label="총 실결제 금액">
                {totalOrderCompleteAmount.toLocaleString()} 원
              </Descriptions.Item>
            </Descriptions>
            <div style={{ textAlign: 'center', marginTop: '10px'}}>
              {console.log(modifiable)}
              {modifiable ? (
                <Button type="danger" htmlType="submit">확인</Button>
              ):(
                <Button type="primary" onClick={() => handleChangeInfo(true)}>수정</Button>
              )}
              <Button type="default" style={{ marginLeft: '10px'}} onClick={() => handleChangeCancelInfo(false)}>취소</Button>
            </div>
          </Form>
        {/*</TabPane>*/}
        {/*<TabPane tab="회원주문내역" key="2">*/}
        {/*  <Descriptions bordered colon={false} column={24} style={{marginBottom: '15px'}}>*/}
        {/*    <Descriptions.Item  span={12} label="이름">*/}
        {/*      {username}*/}
        {/*    </Descriptions.Item>*/}
        {/*    <Descriptions.Item  span={12} label="아이디">*/}
        {/*      {loginId}*/}
        {/*    </Descriptions.Item>*/}
        {/*    <Descriptions.Item  span={24} label="총 실결제 금액">*/}
        {/*      {totalOrderCompleteAmount.toLocaleString()} 원*/}
        {/*    </Descriptions.Item>*/}
        {/*  </Descriptions>*/}
          <div ref={scrollContainerRef} id="scroll-container" >
            <PaginationTable
              size={'small'}
              style={{
                overflow: 'hidden',
                overflowY: 'scroll',
                height: '480px'}}
              bordered
              columns={colums}
              dataSource={data}
              onChangePageSize={handleChangePageSize}
              pagination={pagination}
              onRow={onRow}
            />
          </div>
      {/*  </TabPane>*/}
      {/*</Tabs>*/}
      <OrderDetailModal visible={detailVisible} onCancel={handleCancel} />
    </Modal>

  );
});

export default AccountDetailModal;
