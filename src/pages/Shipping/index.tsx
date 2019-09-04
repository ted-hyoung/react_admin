// base
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// modules
import { Table, Row, Col, Button, Input, Popconfirm, Select, Modal, Upload, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import * as XLSX from 'xlsx';

// store
import { StoreState } from 'store';
import {
  getShippingAsync,
  updateShippingAsync,
  updateShippingStatusAsync,
  updateExcelInvoiceAsync,
} from 'store/reducer/shipping';

// components
import { ShippingSearchBar } from 'components';

// uilts
import { getNowYMD } from 'lib/utils';
import { SearchShipping } from 'types/Shipping';
import { ShippingStatus, PaymentMethod, ShippingCompany, SHIPPING_STATUSES } from 'enums';
import { UploadFile } from 'antd/lib/upload/interface';

// defines
const EXTENSION_XLSX = 'xlsx';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const regInvoice = /^(\d{10}(\d{2})?)?$/; // 숫자만, 길이 10~12 check
const { confirm } = Modal;
const { Option } = Select;

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

interface ShippingStatusSelet {
  shippingId: number;
  status: ShippingStatus;
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
    if (!regInvoice.test(invoice)) {
      Modal.error({ title: '운송장 번호는 숫자로 최소 10자리 ~ 최대 12자리까지 등록가능합니다.' });
      return false;
    }

    dispatch(updateShippingAsync.request({ shippingId, invoice }));
  }, [dispatch, shippingId, invoice]);

  useEffect(() => {
    setInvoice(text);
    setOpen(false);
    if (text) {
      setOpen(true);
    }
  }, [text]);

  return (
    <div style={{ width: 150 }}>
      <Input disabled={open} value={invoice} onChange={handleChangeInvoice} />

      {!open ? (
        <Popconfirm
          title={
            <div>
              운송장 번호를 등록하시겠습니까?
              <br />* 입력 값 존재시 알림톡이 발송됩니다.
            </div>
          }
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
    </div>
  );
};

const ShippingStatusSelect = (props: ShippingStatusSelet) => {
  const { shippingId, status } = props;
  const [shippingStatus, setShippingStatus] = useState<ShippingStatus>(status);
  const dispatch = useDispatch();

  useEffect(() => {
    setShippingStatus(status);
  }, [status]);

  const handlePaymentStatusChange = useCallback(value => {
    showConfirm(value);
  }, []);

  const showConfirm = useCallback(
    (status: ShippingStatus) => {
      confirm({
        title: `배송상태를 [${ShippingStatus[status]}]로 변경하시겠습니까?`,
        okText: '변경',
        cancelText: '취소',
        onOk() {
          setShippingStatus(status);
          dispatch(updateShippingStatusAsync.request({ shippingId, shippingStatus: status }));
        },
      });
    },
    [dispatch],
  );

  return (
    <Select value={shippingStatus} style={{ width: 120 }} onChange={handlePaymentStatusChange}>
      {SHIPPING_STATUSES.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

const Shipping = () => {
  const { shipping, shippingExcel } = useSelector((state: StoreState) => state.shipping);
  const { size: pageSize } = shipping;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchShipping>();
  const [excelData, setExcelData] = useState<any>();
  const [excelUploaded, setExcelUploaded] = useState(false);
  const [excelFileList, setExcelFileList] = useState<UploadFile[]>();
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

  const handleUpdateExcelInvoice = useCallback(() => {
    const orderNoList: any = {};
    const excelDataLength = excelData.length;

    for (let i = 0; i < excelDataLength; i++) {
      const orderNo = excelData[i]['주문번호'];

      if (orderNo) {
        if (orderNoList[orderNo]) {
          orderNoList[orderNo].push(excelData[i]['운송장번호']);
        } else {
          orderNoList[orderNo] = [excelData[i]['운송장번호']];
        }
      }
    }

    Object.keys(orderNoList).forEach(item => {
      const items = orderNoList[item];
      dispatch(updateExcelInvoiceAsync.request({ invoice: items[0], orderNo: item }));
    });

    message.success('운송장번호가 등록되었습니다.');
    setExcelUploaded(false);
    getShipping(0);
  }, [dispatch, excelData, getShipping]);

  const handleChangeExeclUpload = useCallback(info => {
    const filename = info.file.name;
    const extension = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();

    if (extension !== EXTENSION_XLSX) {
      Modal.error({ title: '엑셀파일만 업로드가 가능합니다.' });
      return false;
    }

    const f: any = info.fileList[0].originFileObj;
    const reader = new FileReader();
    const readAsBinaryString = Boolean(reader.readAsBinaryString);

    reader.onload = (e: any) => {
      const _data = [];

      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: readAsBinaryString ? 'binary' : 'array' });

      /* Get worksheet */
      const title = wb.SheetNames[0];
      const ws = wb.Sheets[title];

      /* Convert array of arrays */
      const data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const dataLength = data.length;

      for (let i = 1; i < dataLength; i++) {
        const orderNo = data[i][1];
        const invoice = data[i][3];

        if (!moment(orderNo, 'YYYYMMDDhhmmssSS').isValid()) {
          Modal.error({ title: '주문번호가 형식에 맞지 않습니다.' });
          return false;
        }

        if (invoice && !regInvoice.test(invoice)) {
          Modal.error({ title: '운송장 번호는 숫자로 최소 10자리 ~ 최대 12자리까지 등록가능합니다.' });
          return false;
        }

        _data.push({
          key: i,
          결제일: data[i][0],
          주문번호: data[i][1],
          주문자: data[i][2],
          운송장번호: data[i][3],
          배송비: data[i][4],
          택배사: data[i][5],
          '상품명 / 옵션 / 수량': data[i][6],
          상품구매금액: data[i][7],
          '실 결제금액': data[i][8],
          결제수단: data[i][9],
          메모: data[i][10],
          배송상태: data[i][11],
        });
      }

      /* Update state */
      setExcelData(_data);
      setExcelUploaded(true);
    };
    if (readAsBinaryString) {
      reader.readAsBinaryString(f);
    } else {
      reader.readAsArrayBuffer(f);
    }
  }, []);

  const getShippingExcel = () => {
    const data = [
      [
        'NO',
        '공구명',
        '브랜드',
        '결제일',
        '주문번호',
        '주문인',
        '주문인 연락처',
        '상품명 / 옵션 / 수량',
        '총 상품구매금액',
        '배송비',
        '총 결제금액',
        '받는분',
        '받는분 연락처',
        '우편번호',
        '배송지',
        '메모',
        '택배사',
        '운송장번호',
      ],
    ];

    if (shippingExcel.length > 0) {
      shippingExcel.forEach((item, index) => {
        data.push([
          String(index + 1),
          item.order.event.name,
          item.order.event.brand.brandName,
          moment(item.order.payment.paymentDate).format(dateTimeFormat),
          item.order.orderNo,
          item.order.consumer.username,
          item.order.consumer.phone,
          item.order.orderItems[0].product.productName +
            ' / ' +
            `${
              item.order.orderItems[0].option
                ? `${
                    item.order.orderItems[0].option.optionName ? item.order.orderItems[0].option.optionName : '옵션없음'
                  }`
                : '옵션없음'
            }` +
            ' / ' +
            item.order.orderItems[0].quantity.toString() +
            `${item.order.orderItems.length > 1 ? ` 외 ${item.order.orderItems.length - 1}건` : ''}`,
          (item.order.payment.totalAmount - item.shippingFee).toString(),
          item.shippingFee.toString(),
          item.order.payment.totalAmount.toString(),
          item.order.shippingDestination.recipient,
          item.order.shippingDestination.recipientPhone,
          item.order.shippingDestination.recipientZipCode,
          item.order.shippingDestination.recipientAddress.concat(
            ' ' + item.order.shippingDestination.recipientAddressDetail,
          ),
          item.order.memo,
          ShippingCompany[item.shippingCompany],
          item.invoice ? item.invoice.toString() : '',
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

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'shipping');
      XLSX.writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
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
      render: (text, recoder) => <ShippingInvoiceForm text={text} shippingId={recoder.shippingId} />,
    },
    { title: '배송비', dataIndex: 'shippingFee', key: 'shippingFee' },
    { title: '택배사', dataIndex: 'shippingCompany', key: 'shippingCompany' },
    { title: '상품명 / 옵션 / 수량', dataIndex: 'orderItems', key: 'orderItems' },
    { title: '상품구매금액', dataIndex: 'totalSalePrice', key: 'totalSalePrice' },
    { title: '실 결제금액', dataIndex: 'totalAmount', key: 'totalAmount' },
    { title: '결제수단', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: '메모', dataIndex: 'memo', key: 'memo' },
    {
      title: '배송상태',
      dataIndex: 'shippingStatus',
      key: 'shippingStatus',
      fixed: 'right',
      render: (text, recoder) => {
        return <ShippingStatusSelect shippingId={recoder.shippingId} status={text} />;
      },
    },
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
      shippingStatus: shipping.shippingStatus,
    };
  });

  return (
    <div className="shipping">
      <Modal
        width={1400}
        title="송장 업데이트"
        visible={excelUploaded}
        footer={
          <>
            <Button onClick={() => setExcelUploaded(false)}>취소</Button>
            <Popconfirm
              placement="topRight"
              title={
                <div>
                  운송장 번호를 등록하시겠습니까?
                  <br />* 입력 값 존재시 알림톡이 발송됩니다.
                </div>
              }
              onConfirm={handleUpdateExcelInvoice}
              okText="확인"
              cancelText="취소"
            >
              <Button type="primary">입력</Button>
            </Popconfirm>
          </>
        }
      >
        <Table
          size="small"
          columns={[
            {
              title: '결제일',
              dataIndex: '결제일',
              key: '결제일',
            },
            {
              title: '주문번호',
              dataIndex: '주문번호',
              key: '주문번호',
            },
            {
              title: '주문자',
              dataIndex: '주문자',
              key: '주문자',
            },
            {
              title: '운송장번호',
              dataIndex: '운송장번호',
              key: '운송장번호',
              width: '250px',
            },
            {
              title: '배송비',
              dataIndex: '배송비',
              key: '배송비',
            },
            {
              title: '택배사',
              dataIndex: '택배사',
              key: '택배사',
            },
            {
              title: '상품명 / 옵션 / 수량',
              dataIndex: '상품명 / 옵션 / 수량',
              key: '상품명 / 옵션 / 수량',
              width: '250px',
            },
            {
              title: '상품구매금액',
              dataIndex: '상품구매금액',
              key: '상품구매금액',
            },
            {
              title: '실 결제금액',
              dataIndex: '실 결제금액',
              key: '실 결제금액',
            },
            {
              title: '결제수단',
              dataIndex: '결제수단',
              key: '결제수단',
            },
            {
              title: '메모',
              dataIndex: '메모',
              key: '메모',
            },
            {
              title: '배송상태',
              dataIndex: '배송상태',
              key: '배송상태',
            },
          ]}
          dataSource={excelData}
        />
      </Modal>

      <ShippingSearchBar onSearch={value => getShipping(0, pageSize, value)} onReset={() => getShipping(0, pageSize)} />

      <Table
        rowKey={record => record.shippingId.toString()}
        title={() => (
          <Row type="flex" justify="space-between">
            <Col>
              <p>검색결과 총 {shipping.totalElements}건</p>
            </Col>
            <Col>
              <Button type="primary" icon="download" onClick={getShippingExcel} style={{ marginRight: 5 }}>
                엑셀 다운로드
              </Button>

              <Upload
                name="invoiceFile"
                action=""
                listType="text"
                showUploadList={false}
                fileList={excelFileList}
                beforeUpload={() => {
                  return false;
                }}
                onChange={handleChangeExeclUpload}
              >
                <Button type="primary" icon="upload" ghost>
                  송장번호 엑셀로 입력
                </Button>
              </Upload>
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
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default Shipping;
