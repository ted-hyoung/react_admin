// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Button, message, Popconfirm, Table } from 'antd';
import { ColumnProps, TableRowSelection } from 'antd/lib/table';

// components
import { ProductModal } from 'components';

// store
import { deleteProductsAsync, soldOutProductsAsync } from 'store/reducer/product';

// types
import { FileObject, ResponseEvent, ResponseOption, ResponseProduct } from 'models';

// enums
import { EventStatus, ProductSold, getEnumKeyByValue } from 'enums';

// less
import './index.less';

interface Props {
  products: ResponseProduct[];
  event: ResponseEvent;
}

export interface ProductList {
  key: number;
  productId: number;
  productName: string;
  discountSalesPrice: number;
  freebie: string;
  normalSalesPrice: number;
  soldOut: boolean;
  enableOption: boolean;
  disabledOptionStock: number;
  disabledOptionTotalStock: number;
  disabledOptionSafeStock: number;
  options: ResponseOption[];
  images: FileObject[];
  eventStatus: EventStatus;
}

const columns: Array<ColumnProps<ProductList>> = [
  { title: 'NO', key: 'key', dataIndex: 'key', align: 'center' },
  { title: '제품명', key: 'productName', dataIndex: 'productName', align: 'center' },
  {
    title: '제품가격',
    key: 'discountSalesPrice',
    dataIndex: 'discountSalesPrice',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <span className="product-table-price-text">
            {record.normalSalesPrice.toLocaleString()}원<br />
          </span>
          <strong className="product-table-price-size">{record.discountSalesPrice.toLocaleString()}원</strong>
        </div>
      );
    },
  },
  { title: '사은품', key: 'freebie', dataIndex: 'freebie', align: 'center' },
  {
    title: '옵션',
    key: 'options',
    dataIndex: 'options',
    align: 'center',
    children: [
      {
        title: 'NO',
        key: 'optionNo',
        align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                colSpan: 3,
              },
              children: (
                <div>
                  <span>없음</span>
                </div>
              ),
            };
          } else {
            const optionIndex: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              optionIndex.push(
                <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                  <span>{index + 1}</span>
                </div>,
              );
            });
            return {
              children: optionIndex,
            };
          }
        },
      },
      {
        title: '옵션명',
        key: 'optionName',
        dataIndex: 'optionName',
        align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                style: { display: 'none' },
              },
            };
          } else {
            const optionName: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              optionName.push(
                <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                  <span>{record.options[index].optionName}</span>
                </div>,
              );
            });
            return {
              props: {
                style: { padding: 0 },
              },
              children: optionName,
            };
          }
        },
      },
      {
        title: '옵션 추가 금액',
        key: 'salePrice',
        dataIndex: 'salePrice',
        align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                style: { display: 'none' },
              },
            };
          } else {
            const optionSalePrice: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              optionSalePrice.push(
                <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                  <span>+ {record.options[index].salePrice.toLocaleString()}원</span>
                </div>,
              );
            });
            return {
              children: optionSalePrice,
            };
          }
        },
      },
    ],
  },
  {
    title: '재고',
    key: 'stockInfo',
    dataIndex: 'stockInfo',
    align: 'center',
    children: [
      {
        title: '현 재고/총 재고',
        key: 'stock',
        dataIndex: 'stock',
        align: 'center',
        render: (text, record) => {
          if (record.enableOption) {
            const optionStock: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              optionStock.push(
                <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                  <span>
                    {record.options[index].stock.toLocaleString()} / {record.options[index].totalStock.toLocaleString()}
                  </span>
                </div>,
              );
            });
            return {
              children: optionStock,
            };
          } else {
            return (
              <div key={record.productId}>
                <span>
                  {record.disabledOptionStock.toLocaleString()} / {record.disabledOptionTotalStock.toLocaleString()}
                </span>
              </div>
            );
          }
        },
      },
      {
        title: '안전 재고',
        key: 'safeStock',
        dataIndex: 'safeStock',
        align: 'center',
        render: (text, record) => {
          if (record.enableOption) {
            const optionSafeStock: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              optionSafeStock.push(
                <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                  <span>{record.options[index].safeStock.toLocaleString()}</span>
                </div>,
              );
            });
            return {
              children: optionSafeStock,
            };
          } else {
            return (
              <div key={record.productId}>
                <span>{record.disabledOptionSafeStock.toLocaleString()}</span>
              </div>
            );
          }
        },
      },
    ],
  },
  {
    title: '상태',
    key: 'productStatus',
    dataIndex: 'productStatus',
    align: 'center',
    render: (text, record) => {
      const productStatus: JSX.Element[] = [];
      if (record.enableOption) {
        record.options.forEach((option, index) => {
          if (record.soldOut && record.eventStatus !== EventStatus[EventStatus.READY]) {
            productStatus.push(
              <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                <span>품절 처리</span>
              </div>,
            );
          } else if (!record.soldOut && option.stock === 0 && record.eventStatus !== EventStatus[EventStatus.READY]) {
            productStatus.push(
              <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                <span>판매 종료</span>
              </div>,
            );
          } else if (!record.soldOut && option.stock !== 0 && record.eventStatus !== EventStatus[EventStatus.READY]) {
            productStatus.push(
              <div key={index} className={index !== record.options.length - 1 ? 'product-table-border-bottom' : ''}>
                <span>판매중</span>
              </div>,
            );
          }
        });
        return {
          children: productStatus,
        };
      } else {
        const productStatus: JSX.Element[] = [];
        if (record.soldOut && record.eventStatus !== EventStatus[EventStatus.READY]) {
          productStatus.push(
            <div key={record.productId}>
              <span>품절 처리</span>
            </div>,
          );
        } else if (
          !record.soldOut &&
          record.disabledOptionStock === 0 &&
          record.eventStatus !== EventStatus[EventStatus.READY]
        ) {
          productStatus.push(
            <div key={record.productId}>
              <span>판매 종료</span>
            </div>,
          );
        } else if (
          !record.soldOut &&
          record.disabledOptionStock !== 0 &&
          record.eventStatus !== EventStatus[EventStatus.READY]
        ) {
          productStatus.push(
            <div key={record.productId}>
              <span>판매중</span>
            </div>,
          );
        }
        return {
          children: productStatus,
        };
      }
    },
  },
];

function ProductTable(props: Props) {
  const { products, event } = props;
  const { eventId, eventStatus } = event;

  const data: ProductList[] = products.map((product, index) => {
    return {
      key: index + 1,
      productId: product.productId,
      productName: product.productName,
      discountSalesPrice: product.discountSalesPrice,
      freebie: product.freebie,
      normalSalesPrice: product.normalSalesPrice,
      soldOut: product.soldOut,
      enableOption: product.enableOption,
      disabledOptionStock: product.disabledOptionStock,
      disabledOptionTotalStock: product.disabledOptionTotalStock,
      disabledOptionSafeStock: product.disabledOptionSafeStock,
      options: product.options,
      images: product.images,
      eventStatus,
    };
  });

  const initProduct: ResponseProduct = {
    productId: 0,
    productName: '',
    normalSalesPrice: 0,
    discountSalesPrice: 0,
    disabledOptionTotalStock: 0,
    disabledOptionStock: 0,
    disabledOptionSafeStock: 0,
    soldOut: false,
    freebie: '',
    enableOption: true,
    options: [],
    images: [],
  };

  const [product, setProduct] = useState(initProduct);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const dispatch = useDispatch();

  const rowSelection: TableRowSelection<ProductList> = {
    selectedRowKeys,
    onChange: useCallback(selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }, []),
  };

  const handleRowProduct = (record: ProductList) => {
    return {
      onClick: () => {
        setProductModalVisible(true);
        if (eventStatus === EventStatus[EventStatus.READY]) {
          setProduct({
            ...product,
            productId: record.productId,
            productName: record.productName,
            normalSalesPrice: record.normalSalesPrice,
            discountSalesPrice: record.discountSalesPrice,
            disabledOptionTotalStock: record.disabledOptionTotalStock,
            disabledOptionStock: record.disabledOptionStock,
            disabledOptionSafeStock: record.disabledOptionSafeStock,
            soldOut: record.soldOut,
            freebie: record.freebie,
            enableOption: record.enableOption,
            options: record.options.concat({
              optionId: 0,
              optionName: '',
              salePrice: 0,
              stock: 0,
              safeStock: 0,
              totalStock: 0,
            }),
            images: record.images,
          });
        } else {
          setProduct({
            ...product,
            productId: record.productId,
            productName: record.productName,
            normalSalesPrice: record.normalSalesPrice,
            discountSalesPrice: record.discountSalesPrice,
            disabledOptionTotalStock: record.disabledOptionTotalStock,
            disabledOptionStock: record.disabledOptionStock,
            disabledOptionSafeStock: record.disabledOptionSafeStock,
            soldOut: record.soldOut,
            freebie: record.freebie,
            enableOption: record.enableOption,
            options: record.options,
            images: record.images,
          });
        }
      },
    };
  };

  const handleProductModalOpen = () => {
    setProductModalVisible(true);
    setProduct({
      ...product,
      productId: 0,
      productName: '',
      normalSalesPrice: 0,
      discountSalesPrice: 0,
      disabledOptionTotalStock: 0,
      disabledOptionStock: 0,
      disabledOptionSafeStock: 0,
      soldOut: false,
      freebie: '',
      enableOption: true,
      options: [
        {
          optionId: 0,
          optionName: '',
          salePrice: 0,
          stock: 0,
          safeStock: 0,
          totalStock: 0,
        },
      ],
    });
  };

  const handleProductDelete = () => {
    const selectedIds: number[] = [];
    selectedRowKeys.forEach(item => {
      selectedIds.push(Number(item));
    });

    if (selectedIds.length === 0) {
      return message.error('삭제할 상품을 선택해주세요.');
    } else {
      const data = {
        eventId,
        data: {
          productIds: selectedIds,
        },
      };
      dispatch(deleteProductsAsync.request(data));
      setSelectedRowKeys([]);
    }
  };

  const handleProductSoldOutConfirm = (productSold: ProductSold) => {
    const selectedIds: number[] = [];
    selectedRowKeys.forEach(item => {
      selectedIds.push(Number(item));
    });

    if (selectedIds.length === 0) {
      return message.error('품절 처리할 상품을 선택해주세요.');
    } else {
      const data = {
        eventId,
        data: {
          productIds: selectedIds,
          soldOut: productSold === ProductSold.SOLD_OUT,
        },
      };
      dispatch(soldOutProductsAsync.request(data));
      setSelectedRowKeys([]);
    }
  };

  return (
    <div className="product-table">
      <Table
        columns={columns}
        rowSelection={rowSelection}
        rowKey={record => String(record.productId)}
        bordered
        dataSource={data}
        pagination={false}
        size="middle"
        onRow={handleRowProduct}
      />
      <div className="product-table-button">
        {eventStatus === getEnumKeyByValue(EventStatus, EventStatus.READY) ? (
          <>
            <Button type="primary" size="large" onClick={handleProductModalOpen}>
              제품 등록
            </Button>
            <Popconfirm
              title="해당 제품을 삭제처리 하시겠습니까?"
              onConfirm={handleProductDelete}
              okText="확인"
              cancelText="취소"
            >
              <Button type="danger" size="large">
                선택 제품 삭제
              </Button>
            </Popconfirm>
          </>
        ) : (
          <>
            <Popconfirm
              title="해당 제품을 품절 처리 하시겠습니까?"
              onConfirm={() => handleProductSoldOutConfirm(ProductSold.SOLD_OUT)}
              okText="확인"
              cancelText="취소"
            >
              <Button type="primary" size="large">
                품절 처리
              </Button>
            </Popconfirm>
            <Popconfirm
              title="해당 제품을 품절 해제 하시겠습니까?"
              onConfirm={() => handleProductSoldOutConfirm(ProductSold.SOLD_IN)}
              okText="확인"
              cancelText="취소"
            >
              <Button type="danger" size="large">
                품절 해제
              </Button>
            </Popconfirm>
          </>
        )}
      </div>
      <ProductModal
        product={product}
        setProduct={setProduct}
        event={event}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
      />
    </div>
  );
}

export default ProductTable;
