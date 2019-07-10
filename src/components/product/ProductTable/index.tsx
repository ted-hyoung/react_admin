// base
import React, { ChangeEvent } from 'react';

// modules
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

// components
import { ProductModal } from 'components';

// types
import { CreateProduct, ResponseOption, ResponseProduct } from 'types';

// enums
import { ProductMode, ProductSold } from 'enums';

// less
import './index.less';

interface Props {
  products: ResponseProduct[];
  productModalVisible: boolean;
  productMode: ProductMode;
  product: CreateProduct | ResponseProduct;
  onClickProductModalOpen: () => void;
  onClickProductModalClose: () => void;
  onClickProductModalOk: () => void;
  onChangeProductValue: (e: ChangeEvent) => void;
  onChangeOptionValue: (e: ChangeEvent, index:number) => void;
  onChangeEnableOption: (value:number) => void;
  addOptionRow: () => void;
  removeOptionRow: (value:number) => void;
  rowSelection: object;
  handleSelectedRow: (value:ProductList) => void;
  onClickProductDelete: () => void;
  onClickProductSoldOut: (productSold:ProductSold) => void;
}

export interface ProductList {
  key: number;
  productId: number;
  productName: string;
  discountSalesPrice: number;
  freebie: string;
  normalSalesPrice: number;
  enableOption: boolean;
  disabledOptionStock: number;
  disabledOptionTotalStock: number;
  disabledOptionSafeStock: number;
  options: ResponseOption[];
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
                  <div key={record.options[index].optionId}>
                    <span>{index + 1}</span>
                  </div>
                );
              } else {
                optionIndex.push(
                  <div key={record.options[index].optionId} className="product-table-border-bottom">
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
                  <div key={record.options[index].optionId}>
                    <span>{record.options[index].optionName}</span>
                  </div>);
              } else {
                optionName.push(
                  <div key={record.options[index].optionId} className="product-table-border-bottom">
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
                  <div key={record.options[index].optionId}>
                    <span>+ {record.options[index].salePrice.toLocaleString()}원</span>
                  </div>
                );
              } else {
                optionSalePrice.push(
                  <div key={record.options[index].optionId} className="product-table-border-bottom">
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
                  <div key={record.options[index].optionId}>
                    <span>{record.options[index].stock.toLocaleString()} / {record.options[index].totalStock.toLocaleString()}</span>
                  </div>
                );
              } else {
                optionStock.push(
                  <div key={record.options[index].optionId} className="product-table-border-bottom">
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
                  <div key={record.options[index].optionId}>
                    <span>{record.options[index].safeStock.toLocaleString()}</span>
                  </div>
                );
              } else {
                optionSafeStock.push(
                  <div key={record.options[index].optionId} className="product-table-border-bottom">
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

  const {
    products,
    product,
    productModalVisible,
    productMode,
    onClickProductModalOpen,
    onClickProductModalClose,
    onClickProductModalOk,
    onChangeProductValue,
    onChangeOptionValue,
    onChangeEnableOption,
    addOptionRow,
    removeOptionRow,
    rowSelection,
    handleSelectedRow,
    onClickProductDelete,
    onClickProductSoldOut
  } = props;

  const data: ProductList[] = products.map((product, i) => {
    return {
      key: i + 1,
      productId: product.productId,
      productName: product.productName,
      discountSalesPrice: product.discountSalesPrice,
      freebie: product.freebie,
      normalSalesPrice: product.normalSalesPrice,
      enableOption: product.enableOption,
      disabledOptionStock: product.disabledOptionStock,
      disabledOptionTotalStock: product.disabledOptionTotalStock,
      disabledOptionSafeStock: product.disabledOptionSafeStock,
      options: product.options
    }
  });

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
        onRow={(record) => {
            return {
              onClick: () => {
                handleSelectedRow(record);
              }
            }
          }
        }
      />
      <div className="product-table-button">
        <Button type="primary" size="large" onClick={onClickProductModalOpen}>제품 등록</Button>
        <Button type="danger" size="large" onClick={onClickProductDelete}>선택 제품 삭제</Button>
        <Button type="primary" size="large" onClick={() => onClickProductSoldOut(ProductSold.SOLD_OUT)}>품절 처리</Button>
        <Button type="danger" size="large" onClick={() => onClickProductSoldOut(ProductSold.SOLD_IN)}>품절 해제</Button>
      </div>
      <ProductModal
        productMode={productMode}
        selectedProduct={product}
        productModalVisible={productModalVisible}
        onClickProductModalOpen={onClickProductModalOpen}
        onClickProductModalClose={onClickProductModalClose}
        onClickProductModalOk={onClickProductModalOk}
        onChangeProductValue={onChangeProductValue}
        onChangeOptionValue={onChangeOptionValue}
        onChangeEnableOption={onChangeEnableOption}
        addOptionRow={addOptionRow}
        removeOptionRow={removeOptionRow}
      />
    </div>
  )
}

export default ProductTable;