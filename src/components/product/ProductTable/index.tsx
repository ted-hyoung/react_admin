// base
import React, { useCallback, useState } from 'react';

// modules
import { Button, Table } from 'antd';
import { ColumnProps, TableRowSelection } from 'antd/lib/table';

// components
import { ProductModal } from 'components';

// store
import { StoreState } from 'store';

// types
import { FileObject, ResponseOption, ResponseProduct } from 'types';

// enums
import { EventStatus, ProductSold } from 'enums';

// less
import './index.less';
import { useSelector } from 'react-redux';

interface Props {
  responseProducts: ResponseProduct[];
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
}

const columns : Array<ColumnProps<ProductList>> = [
  { title: 'NO', key: 'key', dataIndex: 'key', align: 'center' },
  { title: '제품명', key: 'productName', dataIndex: 'productName', align: 'center' },
  { title: '제품가격', key: 'discountSalesPrice', dataIndex: 'discountSalesPrice', align: 'center',
    render: (text, record) => {
      return <div>
        <span className="product-table-price-text">{record.normalSalesPrice.toLocaleString()}원<br /></span>
        <strong className="product-table-price-size">{record.discountSalesPrice.toLocaleString()}원</strong>
      </div>;
    }
  },
  { title: '사은품', key: 'freebie', dataIndex: 'freebie', align: 'center' },
  { title: '옵션', key: 'options', dataIndex: 'options', align: 'center',
    children: [
      { title: 'NO', key: 'optionNo', align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                colSpan: 3
              },
              children: <div><span>없음</span></div>
            }
          } else {
            const optionIndex: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              if (index === (record.options.length - 1)) {
                optionIndex.push(
                  <div key={index}>
                    <span>{index + 1}</span>
                  </div>
                );
              } else {
                optionIndex.push(
                  <div key={index} className="product-table-border-bottom">
                    <span>{index + 1}</span>
                  </div>)
                ;
              }
            });
            return {
              children: optionIndex
            };
          }
        }
      },
      { title: '옵션명', key: 'optionName', dataIndex: 'optionName', align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                style: { "display" : 'none' }
              }
            };
          } else {
            const optionName: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              if (index === (record.options.length - 1)) {
                optionName.push(
                  <div key={index}>
                    <span>{record.options[index].optionName}</span>
                  </div>);
              } else {
                optionName.push(
                  <div key={index} className="product-table-border-bottom">
                    <span>{record.options[index].optionName}</span>
                  </div>
                );
              }
            });
            return {
              props: {
                style: { "padding" : 0 }
              },
              children: optionName
            };
          }
        }
      },
      { title: '옵션 추가 금액', key: 'salePrice', dataIndex: 'salePrice', align: 'center',
        render: (text, record) => {
          if (record.options.length === 0) {
            return {
              props: {
                style: { "display" : 'none' }
              }
            };
          } else {
            const optionSalePrice: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              if (index === (record.options.length - 1)) {
                optionSalePrice.push(
                  <div key={index}>
                    <span>+ {record.options[index].salePrice.toLocaleString()}원</span>
                  </div>
                );
              } else {
                optionSalePrice.push(
                  <div key={index} className="product-table-border-bottom">
                    <span>+ {record.options[index].salePrice.toLocaleString()}원</span>
                  </div>
                );
              }
            });
            return {
              children: optionSalePrice
            };
          }
        }
      }
    ],
  },
  { title: '재고', key: 'stockInfo', dataIndex: 'stockInfo', align: 'center',
    children: [
      { title: '현 재고/총 재고', key: 'stock', dataIndex: 'stock', align: 'center',
        render: (text, record) => {
          if (record.enableOption) {
            const optionStock: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              if (index === (record.options.length - 1)) {
                optionStock.push(
                  <div key={index}>
                    <span>{record.options[index].stock.toLocaleString()} / {record.options[index].totalStock.toLocaleString()}</span>
                  </div>
                );
              } else {
                optionStock.push(
                  <div key={index} className="product-table-border-bottom">
                    <span>{record.options[index].stock.toLocaleString()} / {record.options[index].totalStock.toLocaleString()}</span>
                  </div>
                );
              }
            });
            return {
              children: optionStock
            };
          } else {
            return <div key={record.productId}>
              <span>{record.disabledOptionStock.toLocaleString()} / {record.disabledOptionTotalStock.toLocaleString()}</span>
            </div>;
          }
        }
      },
      { title: '안전 재고', key: 'safeStock', dataIndex: 'safeStock', align: 'center',
        render: (text, record) => {
          if (record.enableOption) {
            const optionSafeStock: JSX.Element[] = [];
            record.options.forEach((option, index) => {
              if (index === (record.options.length - 1)) {
                optionSafeStock.push(
                  <div key={index}>
                    <span>{record.options[index].safeStock.toLocaleString()}</span>
                  </div>
                );
              } else {
                optionSafeStock.push(
                  <div key={index} className="product-table-border-bottom">
                    <span>{record.options[index].safeStock.toLocaleString()}</span>
                  </div>
                );
              }
            });
            return {
              children: optionSafeStock
            };
          } else {
            return <div key={record.productId}>
              <span>{record.disabledOptionSafeStock.toLocaleString()}</span>
            </div>;
          }
        }
      }
    ],
  },
  { title: '상태', key: 'status', dataIndex: 'status', align: 'center' },
];

// todo : 현재 공구 상태에 따라 버튼 분기 처리 필요 (이종현)
function ProductTable(props: Props) {

  const { responseProducts } = props;
  const eventStatus = useSelector((state: StoreState) => state.event.event.eventStatus);

  const data: ProductList[] = responseProducts.map((product, index) => {
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
    }
  });

  const initProduct:ResponseProduct = {
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

  const [ product, setProduct ] = useState(initProduct);
  const [ selectedRowKeys, setSelectedRowKeys ] = useState<string[]>([]);
  const [ productModalVisible, setProductModalVisible ] = useState(false);

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
          options: record.options
        });
      }
    }
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
      options: [{
        optionId: 0,
        optionName: '',
        salePrice: 0,
        stock: 0,
        safeStock: 0,
        totalStock: 0
      }]
    });
  };

  const handleProductDelete = () => {
    // const selectedIds: number[] = [];
    //
    // selectedRowKeys.forEach(index => {
    //   const selectIndex = Number(index) - 1;
    //   selectedIds.push(products[selectIndex].productId);
    // });
    //
    // const data = {
    //   eventId,
    //   data: {
    //     productIds: selectedIds,
    //   },
    // };
    // dispatch(deleteProductsAsync.request(data));
    // setSelectedRowKeys([]);
  };

  const handleProductSoldOut = (productSold: ProductSold) => {
    // const selectedIds: number[] = [];
    //
    // selectedRowKeys.map(index => {
    //   return selectedIds.push(products[Number(index) - 1].productId);
    // });
    //
    // const data = {
    //   eventId,
    //   data: {
    //     productIds: selectedIds,
    //     soldOut: productSold === ProductSold.SOLD_OUT,
    //   },
    // };
    // dispatch(soldOutProductsAsync.request(data));
    // setSelectedRowKeys([]);
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
        onRow={handleRowProduct} />
      <div className="product-table-button">
        {eventStatus === EventStatus[EventStatus.READY] ?
          <>
            <Button type="primary" size="large" onClick={handleProductModalOpen}>제품 등록</Button>
            <Button type="danger" size="large" onClick={handleProductDelete}>선택 제품 삭제</Button>
          </>
          :
          <>
            <Button type="primary" size="large" onClick={() => handleProductSoldOut(ProductSold.SOLD_OUT)}>품절 처리</Button>
            <Button type="danger" size="large" onClick={() => handleProductSoldOut(ProductSold.SOLD_IN)}>품절 해제</Button>
          </>
        }
      </div>
      <ProductModal
        product={product}
        setProduct={setProduct}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}/>
    </div>
  )
}

export default ProductTable;