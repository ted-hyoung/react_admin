// base
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// modules
import { Table, Row, Col, Button } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { utils, writeFile } from 'xlsx';

// store
import { StoreState } from 'store';
import { getShippingAsync } from 'store/reducer/shipping';

// uilts
import { ShippingStatus, PaymentMethod } from 'enums';
import { SearchShipping } from 'types/Shipping';
import { getNowYMD } from 'lib/utils';

// defines
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

interface Shipping {
  shippingId: number;
  paymentDate: string;
  orderNo: string;
  username: string;
  invoice: string;
  shippingFee: string;
  shippingCompany: string;
  orderItems: JSX.Element[];
  totalSalePrice: string;
  totalAmount: string;
  paymentMethod: string;
  memo: string;
  shippingStatus: ShippingStatus;
}

const Shipping = () => {
  const shipping = useSelector((state: StoreState) => state.shipping.shipping);
  const { size: pageSize } = shipping;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchShipping>();
  const dispatch = useDispatch();

  const getShipping = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchShipping) => {
      dispatch(
        getShippingAsync.request({
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
    getShipping(0);
  }, []);

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getShipping(currentPage - 1, pageSize, lastSearchCondition);
    },

    [getShipping, pageSize, lastSearchCondition],
  );

  const getShippingExcel = () => {
    const data = [
      [
        '결제일',
        '주문번호',
        '주문자',
        '운송장번호',
        '배송비',
        '택배사',
        '상품명 / 옵션 / 수량',
        '상품구매금액',
        '실 결제금액',
        '결제수단',
        '배송상태',
      ],
    ];

    if (shipping.content.length > 0) {
      shipping.content.forEach(item => {
        data.push([
          moment(item.order.payment.paymentDate).format(dateTimeFormat),
          item.order.orderNo.toString(),
          item.order.consumer.username,
          item.invoice,
          item.shippingFee.toLocaleString(),
          item.shippingCompany,
          item.order.orderItems[0].product.productName +
            ' / ' +
            item.order.orderItems[0].option.optionName +
            ' / ' +
            item.order.orderItems[0].quantity.toString(),
          (item.order.payment.totalAmount - item.shippingFee).toLocaleString(),
          item.order.payment.totalAmount.toLocaleString(),
          PaymentMethod[item.order.payment.paymentMethod],
          ShippingStatus[item.shippingStatus],
        ]);

        if (item.order.orderItems.length > 0) {
          const orderItemsAdd = [];
          for (let i = 1; i < item.order.orderItems.length; i++) {
            orderItemsAdd[i] =
              item.order.orderItems[i].product.productName +
              ' / ' +
              item.order.orderItems[i].option.optionName +
              ' / ' +
              item.order.orderItems[i].quantity;
          }

          orderItemsAdd.forEach(orderItem => {
            data.push(['', '', '', '', '', '', orderItem]);
          });
        }
      });

      const ws = utils.aoa_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'shipping');
      writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
    }
  };

  const columns: Array<ColumnProps<Shipping>> = [
    // { title: 'NO', dataIndex: 'shippingId', key: 'shippingId' },
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: '주문번호', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    { title: '운송장번호', dataIndex: 'invoice', key: 'invoice' },
    { title: '배송비', dataIndex: 'shippingFee', key: 'shippingFee' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
    { title: '상품명 / 옵션 / 수량', dataIndex: 'orderItems', key: 'orderItems' },
    { title: '상품구매금액', dataIndex: 'totalSalePrice', key: 'totalSalePrice' },
    { title: '실 결제금액', dataIndex: 'totalAmount', key: 'totalAmount' },
    { title: '결제수단', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: '메모', dataIndex: 'memo', key: 'memo' },
    { title: '배송상태', dataIndex: 'shippingStatus', key: 'shippingStatus' },
  ];

  const dataSource: Array<Shipping> = shipping.content.map(shipping => {
    return {
      shippingId: shipping.shippingId,
      paymentDate: moment(shipping.order.payment.paymentDate).format(dateTimeFormat),
      orderNo: shipping.order.orderNo,
      username: shipping.order.consumer.username,
      invoice: shipping.invoice,
      shippingFee: shipping.shippingFee.toLocaleString(),
      shippingCompany: shipping.shippingCompany,
      orderItems: shipping.order.orderItems.map(item => (
        <div key={item.orderItemId}>
          {item.product.productName} / {item.option.optionName} / {item.quantity}
        </div>
      )),
      totalSalePrice: (shipping.order.payment.totalAmount - shipping.shippingFee).toLocaleString(),
      totalAmount: shipping.order.payment.totalAmount.toLocaleString(),
      paymentMethod: PaymentMethod[shipping.order.payment.paymentMethod],
      memo: shipping.order.memo,
      shippingStatus: ShippingStatus[shipping.shippingStatus],
    };
  });

  return (
    <div className="shipping">
      <Table
        rowKey={record => record.shippingId.toString()}
        title={() => (
          <Row type="flex" justify="space-between">
            <Col>
              <p>검색결과 총 {shipping.totalElements}건</p>
            </Col>
            <Col>
              <Button type="primary" icon="download" onClick={getShippingExcel}>
                엑셀 다운로드
              </Button>
            </Col>
          </Row>
        )}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total: shipping.totalElements,
          pageSize: shipping.size,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
};

export default Shipping;
