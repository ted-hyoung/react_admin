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

// types
import { SearchOrder } from 'types/Order';

// enums
import { ShippingStatus } from 'enums';

// utils
import { getNowYMD } from 'lib/utils';

// defines
const defaultSearchCondition = {
  startDate: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
  endDate: moment(new Date()).format('YYYY-MM-DDT23:59:59'),
};

interface Orders {
  key: number;
  paymentDate: string;
  orderNumber: number;
  brandName: string;
  username: string;
  quantity: number;
  product: string;
  totalSalePrice: number;
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

  const getOrdersExcel = () => {
    const data = [
      ['NO', '결제일', '주문번호', '브랜드명', '주문자', '수량', '상품명/옵션', '실 결제금액', '배송상태', '택배사'],
    ];

    if (orders.content.length > 0) {
      orders.content.forEach(item => {
        data.push([
          item.orderId.toString(),
          moment(item.payment.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
          item.orderId.toString(),
          item.event.brandName,
          item.account.username,
          item.orderItems[0].quantity.toString(),
          item.orderItems[0].product.productName + '/' + item.orderItems[0].option.optionName,
          item.payment.amount.toString(),
          ShippingStatus[item.shipping.shippingStatus],
          item.shipping.shippingCompany,
        ]);
      });

      const ws = utils.aoa_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'orders');
      writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
    }
  };

  const columns: Array<ColumnProps<Orders>> = [
    { title: 'NO', dataIndex: 'key', key: 'key' },
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: '주문번호', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: '브랜드명', dataIndex: 'brandName', key: 'brandName' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    { title: '수량', dataIndex: 'quantity', key: 'quantity' },
    { title: '상품명 / 옵션', dataIndex: 'product', key: 'product' },
    { title: '실 결제금액', dataIndex: 'totalSalePrice', key: 'totalSalePrice' },
    { title: '배송상태', dataIndex: 'shippingStatus', key: 'shippingStatus' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
  ];

  const dataSource: Array<Orders> = orders.content.map((order, i) => {
    return {
      key: i + 1,
      paymentDate: moment(order.payment.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
      orderNumber: order.orderId,
      brandName: order.event.brandName,
      username: order.account.username,
      quantity: order.orderItems[0].quantity,
      product: `${order.orderItems[0].product.productName} / ${order.orderItems[0].option.optionName}`,
      totalSalePrice: order.payment.amount,
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
      />
    </div>
  );
};

export default Orders;
