// base
import React from 'react';

// modules
import { Button, Table } from 'antd';

// components
import { ProductModal } from 'components';

// types
import { CreateProduct, ResponseProduct } from 'types';

// enums
import { ProductMode } from 'enums';

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
  setProductValue: any;
  changeEnableOption: (value:number) => void;
  addOptionRow: () => void;
  removeOptionRow: (index:number) => void;
  rowSelection: any;
}

function ProductTable(props: Props) {

  const {
    productMode,
    product,
    productModalVisible,
    onClickProductModalOpen,
    onClickProductModalClose,
    onClickProductModalOk,
    setProductValue,
    changeEnableOption,
    addOptionRow,
    removeOptionRow,
    rowSelection
  } = props;

  return (
    <div className="product-table">
      <Table
        columns={[
          { title: 'NO', key: 'productNo', align: 'center',
            render: (text, record, index) => {
              return index + 1;
            }
          },
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
                    const optionIndex:any = [];
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
                    const optionName:any = [];
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
                    const optionSalePrice:any = [];
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
                    const optionStock:any = [];
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
                    const optionSafeStock:any = [];
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
        ]}
        rowSelection={rowSelection}
        rowKey={record => String(record.productId)}
        bordered
        dataSource={props.products}
        pagination={false}
        size="middle"
      />
      <div className="product-table-button">
        <Button type="primary" size="large" onClick={onClickProductModalOpen}>제품 등록</Button>
        <Button type="danger" size="large">선택 제품 삭제</Button>
      </div>
      <ProductModal
        productMode={productMode}
        product={product}
        productModalVisible={productModalVisible}
        onClickProductModalOpen={onClickProductModalOpen}
        onClickProductModalClose={onClickProductModalClose}
        onClickProductModalOk={onClickProductModalOk}
        setProductValue={setProductValue}
        changeEnableOption={changeEnableOption}
        addOptionRow={addOptionRow}
        removeOptionRow={removeOptionRow}
      />
    </div>
  )
}

export default ProductTable;