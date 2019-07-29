// base
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// store
import { StoreState } from 'store';
import { getOrdersAsync } from 'store/reducer/order';

// modules
import { Table, Button, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { utils, writeFile } from 'xlsx';
import moment from 'moment';

// components
import { OrderSearchBar } from 'components';

// utils
import { getNowYMD, startDateFormat, endDateFormat, dateTimeFormat } from 'lib/utils';

// types
import { SearchOrder } from 'types/Order';

// enums
import { ShippingStatus } from 'enums';

// defines
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};

interface Orders {
  orderId: number;
  paymentDate: string;
  orderNumber: number;
  brandName: string;
  username: string;
  orderItems: JSX.Element[];
  totalAmount: number;
  shippingStatus: ShippingStatus;
  shippingCompany: string;
}

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
      ['NO', '결제일', '주문번호', '브랜드명', '주문자', '상품명 / 옵션 / 수량', '실 결제금액', '배송상태', '택배사'],
    ];

    if (orders.content.length > 0) {
      orders.content.forEach(item => {
        data.push([
          item.orderId.toString(),
          moment(item.payment.paymentDate).format(dateTimeFormat),
          item.orderId.toString(),
          item.event.brandName,
          item.consumer.username,
          item.orderItems[0].product.productName +
            ' / ' +
            item.orderItems[0].option.optionName +
            ' / ' +
            item.orderItems[0].quantity.toString(),
          item.payment.totalAmount.toString(),
          ShippingStatus[item.shipping.shippingStatus],
          item.shipping.shippingCompany,
        ]);

        if (item.orderItems.length > 0) {
          const orderItemsAdd = [];
          for (let i = 1; i < item.orderItems.length; i++) {
            orderItemsAdd[i] =
              item.orderItems[i].product.productName +
              ' / ' +
              item.orderItems[i].option.optionName +
              ' / ' +
              item.orderItems[i].quantity;
          }

          orderItemsAdd.forEach(orderItem => {
            data.push(['', '', '', '', '', orderItem]);
          });
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
    { title: '주문번호', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: '브랜드명', dataIndex: 'brandName', key: 'brandName' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    { title: '상품명 / 옵션 / 수량', dataIndex: 'orderItems', key: 'orderItems' },
    { title: '실 결제금액', dataIndex: 'totalAmount', key: 'totalAmount' },
    { title: '배송상태', dataIndex: 'shippingStatus', key: 'shippingStatus' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
  ];

  const dataSource: Array<Orders> = orders.content.map(order => {
    return {
      orderId: order.orderId,
      paymentDate: moment(order.payment.paymentDate).format(dateTimeFormat),
      orderNumber: order.orderId,
      brandName: order.event.brandName,
      username: order.consumer.username,
      orderItems: order.orderItems.map(item => (
        <div key={item.orderItemId}>
          {item.product.productName}
          {item.option && <>/ {item.option.optionName}</>}/ {item.quantity}
        </div>
      )),
      totalAmount: order.payment.totalAmount,
      shippingStatus: ShippingStatus[order.shipping.shippingStatus],
      shippingCompany: order.shipping.shippingCompany,
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
