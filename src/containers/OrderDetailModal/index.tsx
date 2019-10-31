// base
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';

// modules
import { Modal, Table, Row, Col, Descriptions, Result, Tag } from 'antd';
import { Element, scroller } from 'react-scroll';
import moment from 'moment';

// components
import { ScrollspyTabs } from 'components';
import RecipientForm from './RecipientForm';
import MemoForm from './MemoForm';

// lib
import { getThumbUrl } from 'lib/utils';

// enums
import { ShippingStatus, PaymentMethod, PaymentStatus, CardCode, ShippingCompany } from 'enums';
import { ImportanceCode } from 'enums/ImportanceCode';
import { Role } from 'enums/Role';

import './index.less';

// defines
const getPaymentMethodColor = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PaymentMethod[PaymentMethod.CARD]: {
      return 'green';
    }
    case PaymentMethod[PaymentMethod.ACCOUNT_TRANSFER]: {
      return 'gold';
    }
    case PaymentMethod[PaymentMethod.REMITTANCE]: {
      return 'lime';
    }
    case PaymentMethod[PaymentMethod.PHONE]: {
      return 'blue';
    }
    default: {
      return 'magenta';
    }
  }
};

// const orderCancelText = (
//   <div>
//     <p style={{ textAlign: 'center', fontWeight: 700 }}>주문취소를 진행하시겠습니까?</p>
//     <p style={{ textAlign: 'center', fontSize: 12 }}>
//       주문 취소 시 즉시 환불 진행되오니 <br />
//       배송상태, 환불 및 반품규정에 따른 <br />
//       배송비 입금 여부를 확인해 주시기 바랍니다.
//     </p>
//   </div>
// );

interface OrderDetailModalProps {
  visible: boolean;
  onCancel: () => void;
}

function OrderDetailModal(props: OrderDetailModalProps) {
  const { visible, onCancel } = props;

  const { orderNo, created, payment, orderItems, shipping, event, consumer, orderMemos } = useSelector(
    (state: StoreState) => state.order.order,
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleChangeTabs = (activeKey: string) => {
    scroller.scrollTo(`section-${activeKey}`, {
      duration: 500,
      smooth: true,
      containerId: 'scroll-container',
      offset: -250,
    });
  };

  const initScrollTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    initScrollTop();
  }, [visible]);

  return (
    <Modal
      centered
      destroyOnClose
      className="order-detail-modal"
      visible={visible}
      footer={null}
      title="주문상세정보"
      onCancel={onCancel}
    >
      <div className="event-info">
        <Row type="flex" gutter={20}>
          <Col>
            <strong>주문 번호: </strong>
            <span>{orderNo}</span>
          </Col>
          <Col>
            <strong>주문 일자: </strong>
            <span>{created ? moment(created).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
          </Col>
        </Row>
        <Row type="flex" gutter={20}>
          <Col>
            <strong>공구명: </strong>
            <span>{event ? event.name : ''}</span>
          </Col>
          <Col>
            <strong>판매자: </strong>
            <span>{event ? event.creator.username : ''}</span>
          </Col>
          <Col>
            <strong>브랜드: </strong>
            <span>{event ? event.brand.brandName : ''}</span>
          </Col>
        </Row>
      </div>
      <ScrollspyTabs
        rootEl="#scroll-container"
        items={['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6', 'section-7']}
        currentClassName="ant-tabs-tab-active"
        onChange={handleChangeTabs}
      >
        <li>주문제품</li>
        <li>결제정보</li>
        <li>결제수단</li>
        <li>환불정보</li>
        <li>주문자정보</li>
        <li>수령자정보</li>
        <li>메모</li>
      </ScrollspyTabs>
      <div ref={scrollContainerRef} id="scroll-container" className="scroll-container">
        <Element id="section-1" className="scroll-section" name="section-1">
          <Row style={{ marginBottom: 10 }} type="flex" justify="space-between" align="middle">
            <Col>
              <p className="scroll-section-title">주문제품</p>
            </Col>
            {/* <Col>
              <Popconfirm
                title={orderCancelText}
                okText="주문취소 진행"
                cancelText="취소"
                placement="bottomLeft"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              >
                <Button type="primary">주문취소</Button>
              </Popconfirm>
            </Col> */}
          </Row>
          <Table
            bordered
            pagination={false}
            dataSource={orderItems.map((orderItem, index) => ({
              key: index + 1,
              orderItem,
              productSalePrice: orderItem.productSalePrice,
              quantity: orderItem.quantity,
              totalSalePrice: orderItem.totalSalePrice,
              shippingFee: shipping ? shipping.shippingFee : 0,
              orderStatus: shipping ? shipping.shippingStatus : '',
            }))}
            columns={[
              {
                title: 'No',
                dataIndex: 'key',
                key: 'key',
                render: (value, record, index) => value,
              },
              {
                title: '제품명',
                dataIndex: 'orderItem',
                key: 'orderItem',
                render: (value, record, index) => (
                  <Row type="flex" gutter={10}>
                    <Col>
                      <img src={getThumbUrl(value.product.images[0].fileKey)} alt="" />
                    </Col>
                    <Col>
                      <strong>{`${index + 1}. ${value.product.productName}`}</strong>
                      {value.option && <p>옵션: {value.option.optionName}</p>}
                      {value.freebie && <p>사은품: {value.freebie}</p>}
                    </Col>
                  </Row>
                ),
              },
              {
                title: '판매가',
                dataIndex: 'productSalePrice',
                key: 'productSalePrice',
                render: value => <span>{value.toLocaleString()} 원</span>,
              },
              {
                title: '구매 수량',
                dataIndex: 'quantity',
                key: 'quantity',
              },
              {
                title: '총 구매액',
                dataIndex: 'totalSalePrice',
                key: 'totalSalePrice',
                render: value => <span>{value.toLocaleString()} 원</span>,
              },
              {
                title: '배송비',
                dataIndex: 'shippingFee',
                key: 'shippingFee',
                render: value => {
                  return {
                    children: <span>{value} 원</span>,
                    props: {
                      rowSpan: 2,
                    },
                  };
                },
              },
              {
                title: '주문상태',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                render: value => {
                  let orderStatus: PaymentStatus | ShippingStatus = ShippingStatus[value as ShippingStatus];

                  if (
                    payment &&
                    (payment.paymentStatus === PaymentStatus[PaymentStatus.CANCEL] ||
                      payment.paymentStatus === PaymentStatus[PaymentStatus.REFUND_COMPLETE])
                  ) {
                    orderStatus = PaymentStatus[payment.paymentStatus];
                  }

                  return {
                    children: orderStatus,
                    props: {
                      rowSpan: 2,
                    },
                  };
                },
              },
            ]}
          />
          <Table
            bordered
            pagination={false}
            style={{ borderTop: 0 }}
            dataSource={[
              {
                key: 1,
                totalSalePrice: orderItems.reduce((ac, orderItem) => (ac += orderItem.totalSalePrice), 0),
                shippingFee: shipping ? shipping.shippingFee : 0,
              },
            ]}
          >
            <Table.Column
              width="50%"
              title="총 구매액"
              dataIndex="totalSalePrice"
              key="totalSalePrice"
              render={value => <span>{value.toLocaleString()} 원</span>}
            />
            <Table.Column
              width="50%"
              title="총 배송비"
              dataIndex="shippingFee"
              key="shippingFee"
              render={value => <span>{value.toLocaleString()} 원</span>}
            />
          </Table>
          <Row type="flex" gutter={30} style={{ marginTop: 30 }}>
            <Col>
              <strong>배송정보</strong>
            </Col>
            <Col>
              <span>{shipping ? ShippingCompany[shipping.shippingCompany] : ''}</span>
            </Col>
            <Col>
              <span>{shipping ? shipping.invoice : ''}</span>
            </Col>
          </Row>
        </Element>
        <Element id="section-2" className="scroll-section" name="section-2">
          <p className="scroll-section-title">결제정보</p>
          <Table
            bordered
            pagination={false}
            dataSource={orderItems.map((orderItem, index) => ({
              key: index + 1,
              totalSalePrice: orderItem.totalSalePrice,
              shippingFee: shipping ? shipping.shippingFee : 0,
            }))}
          >
            <Table.Column
              align="center"
              width="50%"
              title="총상품구매금액"
              dataIndex="totalSalePrice"
              key="totalSalePrice"
              render={value => <span>{value.toLocaleString()} 원</span>}
            />
            <Table.Column
              align="center"
              width="50%"
              title="+ 배송비"
              dataIndex="shippingFee"
              key="shippingFee"
              render={value => <span>{value.toLocaleString()} 원</span>}
            />
            {/* <Table.Column title="할인혜택" key=""></Table.Column> */}
          </Table>
          <Table bordered pagination={false} dataSource={[{ key: 1, totalAmount: payment ? payment.totalAmount : 0 }]}>
            <Table.Column
              align="center"
              title="실결제금액"
              dataIndex="totalAmount"
              key="totalAmount"
              render={value => <span>{value.toLocaleString()} 원</span>}
            />
          </Table>
        </Element>
        <Element id="section-3" className="scroll-section" name="section-3">
          <p className="scroll-section-title">결제수단</p>
          <Descriptions bordered colon={false} column={24}>
            <Descriptions.Item span={24} label="결제(입금)자">
              {consumer ? consumer.username : ''}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="결제수단">
              {payment ? (
                <Tag color={getPaymentMethodColor(payment.paymentMethod)}>{PaymentMethod[payment.paymentMethod]}</Tag>
              ) : (
                ''
              )}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="결제정보">
              {payment && payment.paymentMethod === 'VIRTUAL_ACCOUNT' && payment.nicePayment.virtualBankName + ' / ' + payment.nicePayment.virtualBankNumber}
              {payment && payment.paymentMethod === 'CARD' && CardCode[Number(payment.nicePayment.cardCode)]}
              {payment && payment.paymentMethod === 'ACCOUNT_TRANSFER' && payment.nicePayment.paymentBankName}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="결제상세내역">
              {payment &&
                payment.paymentMethod === 'CARD' &&
                `카드결제: ${moment(payment.paymentDate).format(
                  'YYYY-MM-DD HH:mm:ss',
                )} / 최종결제금액: ${payment.totalAmount.toLocaleString()}원`}
              {payment &&
                payment.paymentMethod === 'VIRTUAL_ACCOUNT' &&
                payment.paymentStatus === 'CANCEL' &&
                `${PaymentStatus[payment.paymentStatus]}: ${moment(payment.paymentDate).format(
                  'YYYY-MM-DD HH:mm:ss',
                )} / 최종결제금액: 미 입금`}
              {payment &&
              payment.paymentMethod === 'VIRTUAL_ACCOUNT' &&
              payment.paymentStatus !== 'CANCEL' &&
              `입금일(${PaymentStatus[payment.paymentStatus]}): ${moment(payment.paymentDate).format(
                'YYYY-MM-DD HH:mm:ss',
              )} / 최종결제금액: ${payment.totalAmount.toLocaleString()}원`}
              {payment &&
              payment.paymentMethod === 'ACCOUNT_TRANSFER' &&
              `계좌이체(${PaymentStatus[payment.paymentStatus]}): ${moment(payment.paymentDate).format(
                'YYYY-MM-DD HH:mm:ss',
              )} / 최종결제금액: ${payment.totalAmount.toLocaleString()}원`}
            </Descriptions.Item>
          </Descriptions>
        </Element>
        <Element id="section-4" className="scroll-section" name="section-4">
          <p className="scroll-section-title">환불정보</p>
          {payment &&
          (payment.paymentStatus === PaymentStatus[PaymentStatus.CANCEL] ||
            payment.paymentStatus === PaymentStatus[PaymentStatus.REFUND_COMPLETE]) ? (
            <Descriptions bordered colon={false} column={24}>
              <Descriptions.Item span={24} label="환불번호">
                <span>{payment.nicePayment.transactionId}</span>
              </Descriptions.Item>
              <Descriptions.Item span={24} label="환불금액">
                <span>{payment.totalAmount.toLocaleString()} 원</span>
              </Descriptions.Item>
              <Descriptions.Item span={12} label="환불수단">
                <span>
                  {payment.paymentStatus === PaymentStatus[PaymentStatus.CANCEL] ? '미 입금' :  ' 현금 환불'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item span={12} label="환불일자">
                <span>{moment(payment.paymentCanceled).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Descriptions.Item>
              {payment && payment.paymentMethod === 'VIRTUAL_ACCOUNT' && (
                <Descriptions.Item span={24} label="환불계좌정보">
                  <span>
                    환불은행: {payment.refundAccountBank ? (payment.refundAccountBank) : ' - '} |
                    환불계좌: {payment.refundAccountNumber ? (payment.refundAccountNumber):' - '} |
                    예금주:{payment.refundAccountDepositor ? (payment.refundAccountDepositor):' - '}
                  </span>
                </Descriptions.Item>
              )}
              <Descriptions.Item span={24} label="환불사유">
                <span> - </span>
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Result title="환불 내역이 없습니다." />
          )}
        </Element>
        <Element id="section-5" className="scroll-section" name="section-5">
          <p className="scroll-section-title">주문자정보</p>
          <Descriptions bordered colon={false} column={24}>
            <Descriptions.Item span={24} label="주문자명(ID)">
              {consumer ? consumer.username : ''}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="연락처">
              {consumer ? consumer.phone : ''}
            </Descriptions.Item>
          </Descriptions>
        </Element>
        <Element id="section-6" className="scroll-section" name="section-6">
          <p className="scroll-section-title">수령자정보</p>
          <RecipientForm />
        </Element>
        <Element id="section-7" className="scroll-section" name="section-7">
          <p className="scroll-section-title">메모</p>
          <Table
            style={{ marginBottom: 30 }}
            bordered
            pagination={false}
            size="middle"
            dataSource={orderMemos
              .map(orderMemo => ({
                key: orderMemo.orderMemoId,
                importance: ImportanceCode[orderMemo.importance],
                created: moment(orderMemo.created).format('YYYY.MM.DD HH:mm:ss'),
                loginId: orderMemo.creator.loginId,
                role: Role[orderMemo.creator.role],
                orderMemoContents: orderMemo.orderMemoContents,
              }))
              .reverse()}
            columns={[
              {
                title: '중요도',
                dataIndex: 'importance',
                key: 'importance',
                align: 'center',
              },
              {
                title: '작성일',
                dataIndex: 'created',
                key: 'created',
                align: 'center',
              },
              {
                title: '작성자',
                children: [
                  {
                    title: '등급',
                    dataIndex: 'role',
                    key: 'role',
                    align: 'center',
                  },
                  {
                    title: '이름',
                    dataIndex: 'loginId',
                    key: 'loginId',
                    align: 'center',
                  },
                ],
              },
              {
                title: '메모 내용',
                dataIndex: 'orderMemoContents',
                key: 'orderMemoContents',
                align: 'center',
              },
            ]}
          />
          <MemoForm />
        </Element>
      </div>
    </Modal>
  );
}

export default OrderDetailModal;
