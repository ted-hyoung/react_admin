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
  message, Rate,
} from 'antd';
import { Element, scroller } from 'react-scroll';
import moment from 'moment';

// components
import { ScrollspyTabs } from 'components';

// lib
import { endDateFormat, startDateFormat } from 'lib/utils';

// enums
import { SocialProviderCode } from 'enums';

import './index.less';
import {
  ResponseAccounts,
  SearchOrder,
} from '../../models';
import Form, { FormComponentProps } from 'antd/lib/form';
import { getOrdersAsync } from '../../store/reducer/order';

interface AccountDetailModalProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  account:ResponseAccounts;
}
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};
const AccountDetailModal = Form.create<AccountDetailModalProps>()((props: AccountDetailModalProps) => {
// function AccountDetailModal(props: AccountDetailModalProps) {
  const { visible, onCancel, account, form } = props;
  const { consumerId , socialProvider, username, marketingInfoAgree, created, phone } = account;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;
  const dispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modifiable, setModifiable] = useState<boolean>(false);
  const [submitable, setSubmitable] = useState<boolean>(false);
  const { order, orders, ordersExcel } = useSelector((storeState: StoreState) => storeState.order);
  const { content ,totalElements, totalPages } = orders;
  console.log(content);
  const handleChangeTabs = (activeKey: string) => {
    scroller.scrollTo(`section-${activeKey}`, {
      duration: 500,
      smooth: true,
      containerId: 'scroll-container',
      offset: -250,
    });
  };
  const onChangeRadio = (e : any) => {
    console.log('radio checked', e.target.value);
  };
  const initScrollTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  };

  const getOrders = useCallback(
    (page: number, size = 10, searchCondition?: SearchOrder) => {
      dispatch(
        getOrdersAsync.request({
          page,
          size,
          searchCondition,
        }),
      );

    },
    [dispatch, 10],
  );

  useEffect(() => {
    getOrders(0, 10, defaultSearchCondition);
  }, [getOrders, 10]);

  useEffect(() => {
    initScrollTop();
  }, [visible]);

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
              <strong>성명: </strong>
              <span>{username}</span>
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
        <ScrollspyTabs
          rootEl="#scroll-container"
          items={['section-1', 'section-2']}
          currentClassName="ant-tabs-tab-active"
          onChange={handleChangeTabs}
        >
          <li>회원기본정보</li>
          <li>회원주문내역</li>
        </ScrollspyTabs>
        <div ref={scrollContainerRef} id="scroll-container" className="account-scroll-container">
          <Form onSubmit={handleSubmit}>
          <Element id="section-1" className="scroll-section" name="section-1">
            <p className="scroll-section-title">회원기본정보</p>
            <Descriptions bordered colon={false} column={24}>
              <Descriptions.Item  span={24} label="아이디">
                {consumerId}
              </Descriptions.Item>
              <Descriptions.Item  span={24} label="이름">
                {username}
              </Descriptions.Item>
              <Descriptions.Item span={24} label="휴대폰번호">
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
              <Descriptions.Item span={24} label="이메일">
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
              <Descriptions.Item span={24} label="로그인 방법">
                <Tag
                  style={{
                    boxShadow: '1px 1px 1px 1px #b3b3b3',
                    color: SocialProviderCode.카카오 === account.socialProvider ? '#381e1f' : '#ffffff'
                  }}
                  color={
                    SocialProviderCode.카카오 === account.socialProvider ? '#e4d533' : '#1bba00'
                  }>
                  {SocialProviderCode[account.socialProvider]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item span={24}  label="마케팅 정보 수신 동의">
                <Radio.Group onChange={onChangeRadio} defaultValue={marketingInfoAgree} disabled={!modifiable}>
                  <Radio value={true}>수신</Radio>
                  <Radio value={false}>수신거부</Radio>
                </Radio.Group>
              </Descriptions.Item>
            </Descriptions>
          </Element>
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

          <Element id="section-2" className="account-scroll-section" name="section-2">
            <p className="account-scroll-section-title">회원주문내역</p>

          </Element>
        </div>

    </Modal>
  );
});

export default AccountDetailModal;
