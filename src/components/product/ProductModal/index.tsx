// base
import React from 'react';

// modules
import { Button, Col, Input, Modal as AntModal, Row, Select, Table, Typography } from 'antd';

// types
import { CreateProduct, ResponseProduct } from 'types';

// enums
import { ProductMode } from 'enums';

// less
import './index.less';

// defines
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface Props {
  productMode: ProductMode;
  product: CreateProduct | ResponseProduct;
  productModalVisible: boolean;
  onClickProductModalOpen: () => void;
  onClickProductModalClose: () => void;
  onClickProductModalOk: () => void;
  setProductValue: any;
  changeEnableOption: (value:number) => void;
  addOptionRow: () => void;
  removeOptionRow: (index:number) => void;
}

function ProductModal(props: Props) {

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
    removeOptionRow
  } = props;

  return (
    <div className="product-modal" onClick={() => onClickProductModalOpen}>
      <AntModal
        title={ "제품 " + productMode }
        visible={productModalVisible}
        onOk={onClickProductModalOk}
        onCancel={onClickProductModalClose}
        width="1200px"
      >
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text type="danger">* 제품명</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input name="productName" value={product.productName} placeholder="텍스트 입력" onChange={e => setProductValue(e, 'product', null)} maxLength={20} />
          </Col>
          <Col span={3} className="product-modal-explanation">
            {product.productName.length}/20자
          </Col>
        </Row>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text type="danger">* 판매가</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input className="product-modal-input"  name="normalSalesPrice" type="Number" value={product.normalSalesPrice} onChange={e => setProductValue(e, 'product', null)} />
          </Col>
          <Col span={1} className="product-modal-explanation">
            원
          </Col>
          <Col span={3} className="product-modal-col-3">
            <Text>* 정상가</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input className="product-modal-input"  name="discountSalesPrice" type="Number" value={product.discountSalesPrice} onChange={e => setProductValue(e, 'product', null)} />
          </Col>
          <Col span={1} className="product-modal-explanation">
            원
          </Col>
        </Row>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text>사은품</Text>
          </Col>
          <Col span={20} style={{ padding: 3 }}>
            <TextArea name="freebie" value={product.freebie} onChange={e => setProductValue(e, 'product', null)} />
          </Col>
        </Row>
        <Row>
          <Col span={3} className="product-modal-col-3" />
          <Col span={10}>
            <Text type="danger">※ ","(쉼표)를 기입하여 사은품 종류를 구별해 주세요.</Text>
          </Col>
        </Row>
        <Row>
          <Col span={23} className="product-modal-col-23">
            <hr style={{ backgroundColor: '#e8e8e8' }} />
          </Col>
        </Row>
        <div>
          {product.enableOption}</div>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text>옵션</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Select defaultValue={product.enableOption ? 0 : 1} value={product.enableOption ? 0 : 1} onChange={changeEnableOption} style={{ width: 100 }}>
              <Option value={0}>사용</Option>
              <Option value={1}>사용안함</Option>
            </Select>
          </Col>
        </Row>
        {product.enableOption ?
          <Row>
            <Table
              columns={[
                { title: '옵션', key: 'options', dataIndex: 'options', align: 'center',
                  children: [
                    { title: 'NO', key: 'optionNo', align: 'center',
                      render: (text, record, index) => {
                        return index + 1;
                      }
                    },
                    { title: '옵션명', key: 'optionName', dataIndex: 'optionName', align: 'center',
                      render: (text, record, index) => {
                        return <div key={index}><Input name="optionName" value={record.optionName} onChange={e => setProductValue(e, 'option', index)} /></div>
                      }
                    },
                    { title: '옵션 추가 금액', key: 'salePrice', dataIndex: 'salePrice', align: 'center',
                      render: (text, record, index) => {
                        return <div key={index}>
                          <Input name="salePrice" className="product-modal-input"  type="Number" value={record.salePrice} onChange={e => setProductValue(e, 'option', index)} />
                        </div>
                      }
                    }
                  ]
                },
                { title: '재고', key: 'stock', dataIndex: 'stock', align: 'center',
                  children: [
                    { title: 'NO', key: 'stockNo', align: 'center',
                      render: (text, record, index) => {
                        return index + 1;
                      }
                    },
                    { title: '총 재고', key: 'stock', dataIndex: 'stock', align: 'center',
                      render: (text, record, index) => {
                        return <div key={index}>
                          <Input name="stock"  className="product-modal-input" type="Number" value={record.stock} onChange={e => setProductValue(e, 'option', index)} />
                        </div>
                      }
                    },
                    { title: '안전 재고', key: 'safeStock', dataIndex: 'safeStock', align: 'center',
                      render: (text, record, index) => {
                        return <div key={index}>
                          <Input name="safeStock" className="product-modal-input"  type="Number" value={record.safeStock} onChange={e => setProductValue(e, 'option', index)} /></div>
                      }
                    },
                    { title: '삭제/추가', key: 'button', dataIndex: 'button', align: 'center',
                      render: (text, record, index) => {
                        const button:any = [];
                        if (index === (product.options.length - 1)) {
                          button.push(
                            <div key={index}>
                              <div>
                                <Button type="primary" onClick={addOptionRow}>추가</Button> &nbsp;
                                <Button type="danger" onClick={() => removeOptionRow(index)}>삭제</Button>
                              </div>
                            </div>
                          )
                        } else {
                          button.push(
                            <div key={index}>
                              <div>
                                <Button type="danger" onClick={() => removeOptionRow(index)}>삭제</Button>
                              </div>
                            </div>
                          );
                        }
                        return {
                          children: button
                        }
                      }
                    }
                  ]
                },
              ]}
              rowKey="options"
              bordered
              pagination={false}
              dataSource={product.options}
              size="middle"
            />
          </Row>
          :
          <Row>
            <Col span={3} className="product-modal-col-3">
              <Text type="danger">* 총 재고</Text>
            </Col>
            <Col span={8} className="product-modal-col-8">
              <Input name="disabledOptionStock" type="Number" value={product.disabledOptionStock} onChange={e => setProductValue(e, 'product', null)} />
            </Col>
            <Col span={3} className="product-modal-col-3">
              <Text>안전 재고</Text>
            </Col>
            <Col span={8} className="product-modal-col-8">
              <Input name="disabledOptionSafeStock" type="Number" value={product.disabledOptionSafeStock} onChange={e => setProductValue(e, 'product', null)} />
            </Col>
          </Row>
        }
      </AntModal>
    </div>
  )
}

export default ProductModal;