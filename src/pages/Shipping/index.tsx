// base
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// modules
import { Table, Row, Col, Button, Input, Popconfirm } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { utils, writeFile } from 'xlsx';

// store
import { StoreState } from 'store';
import { getShippingAsync, updateShippingAsync } from 'store/reducer/shipping';

// components
import { ShippingSearchBar } from 'components';

// uilts
import { getNowYMD } from 'lib/utils';
import { SearchShipping } from 'types/Shipping';
import { ShippingStatus, PaymentMethod, ShippingCompany } from 'enums';

// defines
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

interface Shipping {
  shippingId: number;
  paymentDate: string;
  orderNo: string;
  username: string;
  invoice: string;
  shippingFee: string;
  shippingCompany: ShippingCompany;
  orderItems: string;
  totalSalePrice: string;
  totalAmount: string;
  paymentMethod: string;
  memo: string;
  shippingStatus: ShippingStatus;
}

interface ShippingInvoiceFormProps {
  text: string;
  shippingId: number;
}

const ShippingInvoiceForm = (props: ShippingInvoiceFormProps) => {
  const { text, shippingId } = props;
  const [invoice, setInvoice] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChangeInvoice = useCallback(e => {
    setInvoice(e.target.value);
  }, []);

  const handleChangeOpen = useCallback(() => {
    setOpen(false);
  }, []);

  const handleUpdateInvoice = useCallback(() => {
    dispatch(updateShippingAsync.request({ shippingId, invoice }));
  }, [dispatch, shippingId, invoice]);

  useEffect(() => {
    setInvoice(text);

    if (text) {
      setOpen(true);
    }
  }, [text]);

  return (
    <>
      <Input disabled={open} value={invoice} onChange={handleChangeInvoice} />

      {!open ? (
        <Popconfirm
          title="운송장번호를 등록하시겠습니까?"
          onConfirm={handleUpdateInvoice}
          okText="확인"
          cancelText="취소"
        >
          <Button type="primary" style={{ width: '100%' }}>
            등록
          </Button>
        </Popconfirm>
      ) : (
        <Button type="dashed" style={{ width: '100%' }} onClick={handleChangeOpen}>
          수정
        </Button>
      )}
    </>
  );
};

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
          ShippingCompany[item.shippingCompany],
          item.order.orderItems[0].product.productName +
            ' / ' +
            `${item.order.orderItems[0].option ? item.order.orderItems[0].option.optionName : '옵션없음'}` +
            ' / ' +
            item.order.orderItems[0].quantity.toString() +
            `${item.order.orderItems.length > 1 ? ` 외 ${item.order.orderItems.length - 1}건` : ''}`,
          (item.order.payment.totalAmount - item.shippingFee).toLocaleString(),
          item.order.payment.totalAmount.toLocaleString(),
          PaymentMethod[item.order.payment.paymentMethod],
          ShippingStatus[item.shippingStatus],
        ]);

        // 임시 소스
        // if (item.order.orderItems.length > 0) {
        //   const orderItemsAdd = [];
        //   for (let i = 1; i < item.order.orderItems.length; i++) {
        //     orderItemsAdd[i] =
        //       item.order.orderItems[i].product.productName +
        //       ' / ' +
        //       item.order.orderItems[i].option.optionName +
        //       ' / ' +
        //       item.order.orderItems[i].quantity;
        //   }

        //   orderItemsAdd.forEach(orderItem => {
        //     data.push(['', '', '', '', '', '', orderItem]);
        //   });
        // }
      });

      const ws = utils.aoa_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'shipping');
      writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
    }
  };

  const columns: Array<ColumnProps<Shipping>> = [
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: '주문번호', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '주문자', dataIndex: 'username', key: 'username' },
    {
      title: '운송장번호',
      dataIndex: 'invoice',
      key: 'invoice',
      width: '300px',
      render: (text, recoder) => <ShippingInvoiceForm text={text} shippingId={recoder.shippingId} />,
    },
    { title: '배송비', dataIndex: 'shippingFee', key: 'shippingFee' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
    { title: '상품명 / 옵션 / 수량', dataIndex: 'orderItems', key: 'orderItems', width: '250px' },
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
      shippingCompany: ShippingCompany[shipping.shippingCompany],
      orderItems:
        `${shipping.order.orderItems[0].product.productName} / ${
          shipping.order.orderItems[0].option ? `${shipping.order.orderItems[0].option.optionName}` : '옵션없음'
        } / ${shipping.order.orderItems[0].quantity}` +
        ` ${shipping.order.orderItems.length > 1 ? `외 ${shipping.order.orderItems.length - 1}건` : ''}`,
      totalSalePrice: (shipping.order.payment.totalAmount - shipping.shippingFee).toLocaleString(),
      totalAmount: shipping.order.payment.totalAmount.toLocaleString(),
      paymentMethod: PaymentMethod[shipping.order.payment.paymentMethod],
      memo: shipping.order.memo,
      shippingStatus: ShippingStatus[shipping.shippingStatus],
    };
  });

  return (
    <div className="shipping">
      <ShippingSearchBar onSearch={value => getShipping(0, pageSize, value)} onReset={() => getShipping(0, pageSize)} />

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
