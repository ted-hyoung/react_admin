// base
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';

// modules
import { Modal, Descriptions, Tag, Radio, Button, Input, Icon } from 'antd';
import moment from 'moment';

// components
import { PaginationTable } from 'components';

// lib
import { setPagingIndex } from 'lib/utils';

// enums
import { PaymentMethod, PaymentStatus, ShippingStatus, SocialProviderCode } from 'enums';

import './index.less';
import { ResponseAccounts, ResponseOrdersAccount } from 'models';
import Form, { FormComponentProps } from 'antd/lib/form';
import { getOrderByIdAsync } from '../../store/reducer/order';
import { getAccountDetailAsync, getAccountOrdersAsync, updateAccountAsync } from '../../store/action/account.action';
import { ColumnProps } from 'antd/lib/table';
import { OrderDetailModal } from '../index';

interface AccountDetailModalProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  account : ResponseAccounts;
}
const AccountDetailModal = Form.create<AccountDetailModalProps>()((props: AccountDetailModalProps) => {
  const { visible, onCancel, account, form } = props;
  const { consumerId, socialProvider } = account;
  const { getFieldDecorator, validateFields } = form;
  const dispatch = useDispatch();
  const [modifiable, setModifiable] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const { accountDetail, accountOrders } = useSelector((storeState: StoreState) => storeState.accountState);
  const { created, loginId, username, phone, email, marketingInfoAgree} = accountDetail;
  const { orders, totalOrderCompleteAmount} = accountOrders;

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
    [dispatch, consumerId],
  );

  useEffect(() => {

    if(visible){
      setModifiable(false);
    }else{
      setModifiable(true);
    }

    getDetailAccount(Number(consumerId));
    getOrdersAccount(0);
  }, [getDetailAccount, consumerId, visible]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();

      if(modifiable){
        validateFields((errors, values) => {
          if (!errors) {
            Object.keys(values).forEach(key => {
              if (values[key] === undefined) {
                delete values[key];
                return;
              }
            });
            dispatch(updateAccountAsync.request({ consumerId, ...values }));
            setModifiable(false);
          }
        });
      }
    },
    [modifiable],
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
    setModifiable(false);
  };

  const onRow = (recode: ResponseOrdersAccount) => {
    return {
      onClick: () =>  {
        setDetailVisible(true);
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
      paymentStatus: PaymentStatus[item.paymentStatus],
      shippingStatus: ShippingStatus[item.shippingStatus],
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
      title: '결제상태',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: '배송상태',
      dataIndex: 'shippingStatus',
      key: 'shippingStatus',
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
                    initialValue: phone === undefined ? null : `${phone}`.replace( /^\d{3}-\d{3,4}-\d{4}$/, ''),
                    rules: [
                      {
                        required: false,
                        message: '전화번호를 입력해주세요',
                      },
                    ],
                  })(<Input
                    size="default"
                    placeholder="전화번호"
                    prefix={<Icon type="phone" />}
                  />)}
                </Form.Item>
              ):(
                phone
              )
            }
          </Descriptions.Item>loginMethod
          <Descriptions.Item span={8} label="이메일">
            {email}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="로그인 방법">
            {SocialProviderCode[socialProvider] === SocialProviderCode.KAKAO &&
            <Tag
              className="tag-badge"
              style={{ color:  '#381e1f' }}
              color={'#e4d533'}
            >
              {SocialProviderCode[socialProvider]}
            </Tag>
            }
            {SocialProviderCode[socialProvider] === SocialProviderCode.NAVER &&
            <Tag
              className="tag-badge"
              style={{ color: '#ffffff' }}
              color={'#1bba00'}
            >
              {SocialProviderCode[socialProvider]}
            </Tag>
            }
            {SocialProviderCode[socialProvider] === SocialProviderCode.null &&
            <Tag
              className="tag-badge"
              style={{ color: '#ffffff' }}
              color={'#909090'}
            >
              {SocialProviderCode[socialProvider]}
            </Tag>
            }
          </Descriptions.Item>
          <Descriptions.Item span={8}  label="마케팅 정보 수신 동의">
            {getFieldDecorator('marketingInfoAgree', {
              initialValue: marketingInfoAgree === undefined ? null : marketingInfoAgree,
              rules: [
                {
                  required: false,
                  message: '마케팅 동의여부를 선택해주세요',
                },
              ],
            })(
              <Radio.Group disabled={!modifiable}>
                <Radio value={true}>수신동의</Radio>
                <Radio value={false}>수신거부</Radio>
              </Radio.Group>
            )}
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
        { modifiable && (
          <div style={{ textAlign: 'center', marginTop: '10px'}}>
            <Button type="danger" htmlType="submit">확인</Button>
            <Button type="default" style={{ marginLeft: '10px'}} onClick={() => handleChangeCancelInfo(false)}>취소</Button>
          </div>
        )}
      </Form>
      {!modifiable &&
      <div style={{ textAlign: 'center', marginTop: '10px'}}>
        <Button type="primary" onClick={() => handleChangeInfo(true)}>수정</Button>
      </div>
      }
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
      <OrderDetailModal visible={detailVisible} onCancel={handleCancel} />
    </Modal>

  );
});

export default AccountDetailModal;
