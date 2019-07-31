// base
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// store
import { StoreState } from 'store';
import { getOrdersAsync, updateOrdersPaymentStatusAsync } from 'store/reducer/order';

// modules
import { Table, Button, Row, Col, Select, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { utils, writeFile } from 'xlsx';
import moment from 'moment';

// components
import { OrderSearchBar } from 'components';

// utils
import { getNowYMD, startDateFormat, endDateFormat, dateTimeFormat } from 'lib/utils';
import { SearchOrder } from 'types/Order';
import { ShippingStatus, ShippingCompany, PaymentStatus, PAYMENT_STATUSES } from 'enums';

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
  quantity: JSX.Element[];
  orderItems: JSX.Element[];
  totalAmount: number;
  paymentId: number;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingCompany: ShippingCompany;
}

interface OrdersPaymentSelet {
  paymentId: number;
  status: PaymentStatus;
}

const OrdersPaymentSelet = (props: OrdersPaymentSelet) => {
  const { paymentId, status } = props;

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(status);
  const dispatch = useDispatch();

  const handlePaymentStatusChange = useCallback(value => {
    showConfirm(value);
  }, []);

  const showConfirm = useCallback(
    (status: PaymentStatus) => {
      confirm({
        title: `결제상태를 [${PaymentStatus[status]}]로 변경하시겠습니까?`,
        okText: '변경',
        cancelText: '취소',
        onOk() {
          setPaymentStatus(status);
          dispatch(updateOrdersPaymentStatusAsync.request({ paymentId, paymentStatus: status }));
        },
      });
    },
    [dispatch],
  );

  return (
    <Select value={paymentStatus} style={{ width: 120 }} onChange={handlePaymentStatusChange}>
      {PAYMENT_STATUSES.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

const Orders = () => {
  const { orders } = useSelector((storeState: StoreState) => storeState.order);
  const { size: pageSize, totalElements } = orders;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchOrder>();
  const dispatch = useDispatch();

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
    getOrders(0, pageSize, defaultSearchCondition);
  }, []);

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getOrders(currentPage - 1, pageSize, lastSearchCondition);
    },

    [getOrders, pageSize, lastSearchCondition],
  );

  const getOrdersExcel = () => {
    const data = [
      [
        'NO',
        '결제일',
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

    if (orders.content.length > 0) {
      orders.content.forEach(item => {
        data.push([
          item.orderId.toString(),
          moment(item.payment.paymentDate).format(dateTimeFormat),
          item.orderNo,
          item.event.brand.brandName,
          item.consumer.username,
          item.orderItems[0].quantity.toString(),
          item.orderItems[0].product.productName +
            ' / ' +
            `${
              item.orderItems[0].option
                ? `${item.orderItems[0].option.optionName ? item.orderItems[0].option.optionName : '옵션없음'}`
                : '옵션없음'
            }`,
          item.payment.totalAmount.toString(),
          PaymentStatus[item.payment.paymentStatus],
          ShippingStatus[item.shipping.shippingStatus],
          ShippingCompany[item.shipping.shippingCompany],
        ]);

        if (item.orderItems.length > 0) {
          for (let i = 1; i < item.orderItems.length; i++) {
            data.push([
              '',
              '',
              '',
              '',
              '',
              item.orderItems[i].quantity.toString(),
              item.orderItems[i].product.productName + ' / ' + item.orderItems[i].option.optionName,
            ]);
          }
        }
      });

      const ws = utils.aoa_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'orders');
      writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
    }
  };

  const columns: Array<ColumnProps<Orders>> = [
    { title: 'NO', dataIndex: 'orderId', key: 'orderId' },
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: '주문번호', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '브랜드명', dataIndex: 'brandName', key: 'brandName' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    { title: '수량', dataIndex: 'quantity', key: 'quantity' },
    { title: '상품명 / 옵션', dataIndex: 'orderItems', key: 'orderItems' },
    { title: '실 결제금액', dataIndex: 'totalAmount', key: 'totalAmount' },
    {
      title: '결제상태',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text, record) => {
        return <OrdersPaymentSelet paymentId={record.paymentId} status={text} />;
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
      quantity: order.orderItems.map(item => <div key={item.orderItemId}>{item.quantity}</div>),
      orderItems: order.orderItems.map(item => (
        <div key={item.orderItemId}>
          {item.product.productName}
          {item.option ? ` / ${item.option.optionName ? item.option.optionName : '옵션없음'}` : ' / 옵션없음'}
        </div>
      )),
      totalAmount: order.payment.totalAmount,
      paymentId: order.payment.paymentId,
      paymentStatus: order.payment.paymentStatus,
      shippingStatus: ShippingStatus[order.shipping.shippingStatus],
      shippingCompany: ShippingCompany[order.shipping.shippingCompany],
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
            </Col>
          </Row>
        )}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total: orders.totalElements,
          pageSize: orders.size,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
};

export default Orders;
