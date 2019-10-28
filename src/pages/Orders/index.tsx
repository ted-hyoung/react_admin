// base
import React, { useCallback, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';

// store
import { StoreState } from 'store';
import { getOrdersAsync, getOrdersExcelAsync, clearOrderExcel, getOrderByIdAsync, cancelPaymentVirtualAccountAsync } from 'store/reducer/order';
// modules
import { Table, Button, Row, Col, Select, Modal, message, Statistic } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// lib
import { payCancelHost } from 'lib/protocols';

// containers
import { OrderSearchBar, OrderDetailModal } from 'containers';

// utils
import { startDateFormat, endDateFormat, dateTimeFormat, createExcel } from 'lib/utils';
import { SearchOrder } from 'models/Order';
import {
  ShippingStatus,
  ShippingCompany,
  PaymentStatus,
  PAYMENT_STATUSES,
  PAYMENT_VIRTUAL_STATUSES,
  PaymentMethod,
} from 'enums';
import { ResponseOrderItem } from 'models/OrderItem';
import { getEventByIdAsync } from '../../store/reducer/event';

// defines
const { Option } = Select;
const { confirm } = Modal;
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};

interface Orders {
  orderId: number;
  paymentDate: string;
  orderNo: string;
  brandName: string;
  username: string;
  quantity: ResponseOrderItem[];
  orderItems: ResponseOrderItem[];
  totalAmount: string;
  paymentId: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingCompany: ShippingCompany;
  transactionId: string;
}

interface SelectedOrder {
  totalAmount: string;
  orderNo: string;
  transactionId: string;
  brandName: string;
  quantity: string;
  productName: string;
}

interface OrdersPaymentSelect {
  niceSubmitRef: React.RefObject<HTMLFormElement>;
  record: Orders;
  setSelectedOrder: Dispatch<SetStateAction<SelectedOrder | undefined>>;
  status: PaymentStatus;
  method: PaymentMethod;
}

const OrdersPaymentSelect = (props: OrdersPaymentSelect) => {
  const { niceSubmitRef, record, setSelectedOrder, status, method } = props;
  const paymentStatus = status;
  const paymentMethod = method;

  const dispatch = useDispatch();
  const [niceCancelPayment, setNiceCancelPayment] = useState(false);

  const handlePaymentStatusChange = useCallback(value => {
    showConfirm(value);
  }, []);

  useEffect(() => {
    console.log(record);
    if (niceCancelPayment && niceSubmitRef.current) {
        if(PaymentMethod[PaymentMethod.VIRTUAL_ACCOUNT] === method){
          dispatch(cancelPaymentVirtualAccountAsync.request({ orderNo: record.orderNo }));
        }else{
          niceSubmitRef.current.submit();
        }
    }
  }, [niceCancelPayment]);

  const showConfirm = useCallback(
    (status: PaymentStatus) => {

      confirm({
        title: `결제상태를 [${PaymentStatus[status]}]로 변경하시겠습니까?`,
        okText: '변경',
        cancelText: '취소',
        onOk() {
          // 결제 대기로 할때
          let quantity: number = 0;
          let productName: string = '';

          record.orderItems.forEach((item, index) => {
            quantity += item.quantity;
            productName += item.product.productName;
            if (item.option) {
              productName += item.option.optionName ? '/' + item.option.optionName : '/옵션없음';
            } else {
              productName += '/옵션없음';
            }
            if (record.orderItems.length - 1 > index) {
              productName += ', ';
            }
          });

          setSelectedOrder({
            totalAmount: record.totalAmount,
            orderNo: record.orderNo,
            transactionId: record.transactionId,
            brandName: record.brandName,
            quantity: quantity.toString(),
            productName,
          });
          if (PaymentMethod[PaymentMethod.VIRTUAL_ACCOUNT] === method) {
            if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_READY] === status) {
              message.error('관리자 홈페이지에서는 입금대기로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_COMPLETE] === status) {
              message.error('관리자 홈페이지에서는 입금완료로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.CANCEL] === status) {
              if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_COMPLETE] === paymentStatus) {
                setNiceCancelPayment(true);
              } else {
                message.error('입금완료인 경우에만 결제취소가 가능합니다.');
              }
            } else if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_REFUND_REQUEST] === status) {
              message.error('관리자 홈페이지에서는 취소요청으로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_REFUND_COMPLETE] === status) {
              if (PaymentStatus[PaymentStatus.VIRTUAL_ACCOUNT_REFUND_REQUEST] === paymentStatus) {
                setNiceCancelPayment(true);
              } else {
                message.error('취소요청인 경우에만 취소완료가 가능합니다.');
              }
            }
          } else {
            if (PaymentStatus[PaymentStatus.READY] === status) {
              message.error('관리자 홈페이지에서는 결제대기로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.COMPLETE] === status) {
              message.error('관리자 홈페이지에서는 결제완료로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.CANCEL] === status) {
              if (PaymentStatus[PaymentStatus.COMPLETE] === paymentStatus) {
                setNiceCancelPayment(true);
              } else {
                message.error('결제완료인 경우에만 결제취소가 가능합니다.');
              }
            } else if (PaymentStatus[PaymentStatus.REFUND_REQUEST] === status) {
              message.error('관리자 홈페이지에서는 환불요청으로 변경하실 수 없습니다.');
            } else if (PaymentStatus[PaymentStatus.REFUND_COMPLETE] === status) {
              if (PaymentStatus[PaymentStatus.REFUND_REQUEST] === paymentStatus) {
                setNiceCancelPayment(true);
              } else {
                message.error('환불요청인 경우에만 환불완료가 가능합니다.');
              }
            }
          }
        },
      });
    },
    [dispatch],
  );

  return (
    <>
      <Select value={paymentStatus} style={{ width: 120 }} onChange={handlePaymentStatusChange}>
        {paymentMethod === 'VIRTUAL_ACCOUNT'
          ? PAYMENT_VIRTUAL_STATUSES.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))
          : PAYMENT_STATUSES.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
      </Select>
    </>
  );
};

const Orders = () => {
  const { order, orders, ordersExcel } = useSelector((storeState: StoreState) => storeState.order);
  const { size: pageSize, totalElements } = orders;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchOrder>();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder>();
  const printRef = useRef<any>();
  const niceSubmitRef = useRef<HTMLFormElement>(null);

  const getOrders = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchOrder) => {
      dispatch(
        getOrdersAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  useEffect(() => {
    if (order.orderId) {
      setVisible(true);
    }
  }, [order]);

  useEffect(() => {
    getOrders(0, pageSize, defaultSearchCondition);
  }, [getOrders, pageSize]);

  useEffect(() => {
    if (ordersExcel.length !== 0) {
      createOrdersExcel();
      dispatch(clearOrderExcel);
    }
  }, [ordersExcel]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getOrders(currentPage - 1, pageSize, lastSearchCondition);
    },

    [getOrders, pageSize, lastSearchCondition],
  );

  const getOrdersExcel = useCallback(() => {
    dispatch(getOrdersExcelAsync.request({ lastSearchCondition }));
  }, [dispatch, lastSearchCondition]);

  const createOrdersExcel = () => {
    const data = [
      [
        'NO',
        '결제일',
        '공구명',
        '주문번호',
        '브랜드명',
        '주문자',
        '수량',
        '상품명 / 옵션',
        '실 결제금액',
        '결제상태',
        '배송상태',
        '택배사',
      ],
    ];

    if (ordersExcel.length > 0) {
      ordersExcel.forEach(item => {
        data.push([
          item.orderId.toString(),
          moment(item.payment.paymentDate).format(dateTimeFormat),
          item.event.name,
          item.orderNo,
          item.event.brand.brandName,
          item.consumer.username,
          item.orderItems[0].quantity.toLocaleString(),
          item.orderItems[0].product.productName +
            ' / ' +
            `${
              item.orderItems[0].option
                ? `${item.orderItems[0].option.optionName ? item.orderItems[0].option.optionName : '옵션없음'}`
                : '옵션없음'
            }`,
          item.payment.totalAmount.toLocaleString(),
          PaymentStatus[item.payment.paymentStatus],
          ShippingStatus[item.shipping.shippingStatus],
          ShippingCompany[item.shipping.shippingCompany],
        ]);

        if (item.orderItems.length > 0) {
          for (let i = 1; i < item.orderItems.length; i++) {
            data.push([
              item.orderId.toString(),
              '',
              '',
              '',
              '',
              '',
              item.orderItems[i].quantity.toLocaleString(),
              item.orderItems[i].product.productName +
                ' / ' +
                `${
                  item.orderItems[i].option
                    ? `${item.orderItems[i].option.optionName ? item.orderItems[i].option.optionName : '옵션없음'}`
                    : '옵션없음'
                }`,
            ]);
          }
        }
      });

      createExcel(data);
    }
  };

  const columns: Array<ColumnProps<Orders>> = [
    { title: 'NO', dataIndex: 'orderId', key: 'orderId' },
    {
      title: '결제일',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      key: 'orderNo',
      onCell: (record, rowIndex) => {
        return {
          onClick: () => {
            dispatch(getOrderByIdAsync.request({ id: record.orderId }));
          },
        };
      },
    },
    { title: '브랜드명', dataIndex: 'brandName', key: 'brandName' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => {
        const orderItemQuantity: JSX.Element[] = [];
        record.orderItems.forEach((item, index) => {
          orderItemQuantity.push(
            <div key={index}>
              <span>{item.quantity}</span>
            </div>,
          );
        });
        return {
          children: orderItemQuantity,
        };
      },
    },
    {
      title: '상품명 / 옵션',
      dataIndex: 'orderItems',
      key: 'orderItems',
      render: (text, record) => {
        const orderItemProdutName: JSX.Element[] = [];
        record.orderItems.forEach((item, index) => {
          orderItemProdutName.push(
            <div key={index}>
              <span>
                {item.product.productName}
                {item.option ? ` / ${item.option.optionName ? item.option.optionName : '옵션없음'}` : ' / 옵션없음'}
              </span>
            </div>,
          );
        });
        return {
          children: orderItemProdutName,
        };
      },
    },
    { title: '실 결제금액', dataIndex: 'totalAmount', key: 'totalAmount' },
    {
      title: '결제상태',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text, record: Orders) => {
        return (
          <OrdersPaymentSelect
            niceSubmitRef={niceSubmitRef}
            record={record}
            setSelectedOrder={setSelectedOrder}
            status={text}
            method={record.paymentMethod}
          />
        );
      },
    },
    { title: '배송상태', dataIndex: 'shippingStatus', key: 'shippingStatus' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
  ];

  const dataSource: Array<Orders> = orders.content.map(order => {
    return {
      orderId: order.orderId,
      paymentDate: moment(order.payment.paymentDate).format(dateTimeFormat),
      orderNo: order.orderNo,
      brandName: order.event.brand.brandName,
      username: order.consumer.username,
      quantity: order.orderItems,
      orderItems: order.orderItems,
      totalAmount: order.payment.totalAmount.toLocaleString(),
      paymentId: order.payment.paymentId,
      paymentStatus: order.payment.paymentStatus,
      shippingStatus: ShippingStatus[order.shipping.shippingStatus],
      shippingCompany: ShippingCompany[order.shipping.shippingCompany],
      transactionId: order.payment.nicePayment.transactionId,
      paymentMethod: order.payment.paymentMethod,
    };
  });

  return (
    <div className="order">
      <OrderSearchBar
        onSearch={value => getOrders(0, pageSize, value)}
        onReset={() => getOrders(0, pageSize, defaultSearchCondition)}
      />

      <Table
        rowKey={record => record.orderId.toString()}
        title={() => (
          <Row type="flex" justify="space-between">
            <Col>
              <p>검색결과 총 {totalElements}건</p>
            </Col>
            <Col>
              <Button type="primary" icon="download" onClick={getOrdersExcel}>
                엑셀 다운로드
              </Button>
              <ReactToPrint
                trigger={() => (
                  <Button style={{ marginLeft: 4 }} type="danger">
                    인쇄
                  </Button>
                )}
                content={() => printRef.current}
              />
            </Col>
          </Row>
        )}
        ref={printRef}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total: orders.totalElements,
          pageSize: orders.size,
          onChange: handlePaginationChange,
        }}
      />
      {selectedOrder && (
        <form
          id={'form'}
          action={payCancelHost}
          target="_self"
          method="POST"
          style={{ width: 0, height: 0, visibility: 'hidden' }}
          ref={niceSubmitRef}
        >
          <input type="hidden" name="cancelAmt" value={selectedOrder.totalAmount.toLocaleString()} />
          <input type="hidden" name="moid" value={selectedOrder.orderNo} />
          <input type="hidden" name="tid" value={selectedOrder.transactionId} />
          <input type="hidden" name="quantity" value={selectedOrder.quantity} />
          <input type="hidden" name="brandName" value={selectedOrder.brandName} />
          <input type="hidden" name="productName" value={selectedOrder.productName} />
        </form>
      )}
      <OrderDetailModal visible={visible} onCancel={handleCancel} />
    </div>
  );
};

export default Orders;
