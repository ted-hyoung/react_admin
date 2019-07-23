// base
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

// modules
import { Button, Col, Input, Modal as AntModal, Row, Select, Table, Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ImageUpload from 'components/ImageUpload';
import { FileObject } from 'types/FileObject';

// types
import { CreateOption, CreateProduct, ResponseOption, ResponseProduct } from 'types';

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
  selectedProduct: CreateProduct | ResponseProduct;
  productModalVisible: boolean;
  onClickProductModalOpen: () => void;
  onClickProductModalClose: () => void;
  onClickProductModalOk: () => void;
  onChangeProductValue: (e: ChangeEvent) => void;
  onChangeOptionValue: (e: ChangeEvent, index: number) => void;
  onChangeEnableOption: (value: number) => void;
  addOptionRow: () => void;
  removeOptionRow: (value: number) => void;
  fileObjectList: FileObject[];
  setFileObjectList: Dispatch<SetStateAction<FileObject[]>>;
}

function ProductModal(props: Props) {
  const {
    productMode,
    selectedProduct,
    productModalVisible,
    onClickProductModalOpen,
    onClickProductModalClose,
    onClickProductModalOk,
    onChangeProductValue,
    onChangeOptionValue,
    onChangeEnableOption,
    addOptionRow,
    removeOptionRow,
    fileObjectList,
    setFileObjectList
  } = props;

  const columns: Array<ColumnProps<CreateOption | ResponseOption>> = [
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
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return index + 1;
          },
        },
        {
          title: '옵션명',
          key: 'optionName',
          dataIndex: 'optionName',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Input name="optionName" value={record.optionName} onChange={e => onChangeOptionValue(e, index)} />
              </div>
            );
          },
        },
        {
          title: '옵션 추가 금액',
          key: 'salePrice',
          dataIndex: 'salePrice',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Input
                  name="salePrice"
                  className="product-modal-input"
                  type="Number"
                  value={record.salePrice}
                  onChange={e => onChangeOptionValue(e, index)}
                />
              </div>
            );
          },
        },
      ],
    },
    {
      title: '재고',
      key: 'stock',
      dataIndex: 'stock',
      align: 'center',
      children: [
        {
          title: 'NO',
          key: 'stockNo',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return index + 1;
          },
        },
        {
          title: '총 재고',
          key: 'totalStock',
          dataIndex: 'totalStock',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Input
                  name="stock"
                  className="product-modal-input"
                  type="Number"
                  value={record.stock}
                  onChange={e => onChangeOptionValue(e, index)}
                />
              </div>
            );
          },
        },
        {
          title: '안전 재고',
          key: 'safeStock',
          dataIndex: 'safeStock',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Input
                  name="safeStock"
                  className="product-modal-input"
                  type="Number"
                  value={record.safeStock}
                  onChange={e => onChangeOptionValue(e, index)}
                />
              </div>
            );
          },
        },
        {
          title: '삭제/추가',
          key: 'button',
          dataIndex: 'button',
          align: 'center',
          render: (text: string, record: CreateOption | ResponseOption, index: number) => {
            const button: JSX.Element[] = [];
            if (index === selectedProduct.options.length - 1) {
              button.push(
                <div key={index}>
                  <div>
                    <Button type="primary" onClick={addOptionRow}>
                      추가
                    </Button>{' '}
                    &nbsp;
                    <Button type="danger" onClick={() => removeOptionRow(index)}>
                      삭제
                    </Button>
                  </div>
                </div>,
              );
            } else {
              button.push(
                <div key={index}>
                  <div>
                    <Button type="danger" onClick={() => removeOptionRow(index)}>
                      삭제
                    </Button>
                  </div>
                </div>,
              );
            }
            return {
              children: button,
            };
          },
        },
      ],
    },
  ];

  return (
    <div className="product-modal" onClick={() => onClickProductModalOpen}>
      <AntModal
        title={'제품 ' + productMode}
        visible={productModalVisible}
        onOk={onClickProductModalOk}
        onCancel={onClickProductModalClose}
        width="1200px"
      >
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text type="danger">* 제품 이미지</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <ImageUpload fileObjectList={fileObjectList} setFileObjectList={setFileObjectList} />
          </Col>
        </Row>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text type="danger">* 제품명</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input
              name="productName"
              value={selectedProduct.productName}
              placeholder="텍스트 입력"
              onChange={e => onChangeProductValue(e)}
              maxLength={20}
            />
          </Col>
          <Col span={3} className="product-modal-explanation">
            {selectedProduct.productName.length}/20자
          </Col>
        </Row>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text type="danger">* 판매가</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input
              className="product-modal-input"
              name="normalSalesPrice"
              type="Number"
              value={selectedProduct.normalSalesPrice}
              onChange={e => onChangeProductValue(e)}
            />
          </Col>
          <Col span={1} className="product-modal-explanation">
            원
          </Col>
          <Col span={3} className="product-modal-col-3">
            <Text>* 정상가</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Input
              className="product-modal-input"
              name="discountSalesPrice"
              type="Number"
              value={selectedProduct.discountSalesPrice}
              onChange={e => onChangeProductValue(e)}
            />
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
            <TextArea name="freebie" value={selectedProduct.freebie} onChange={e => onChangeProductValue(e)} />
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
        <div>{selectedProduct.enableOption}</div>
        <Row>
          <Col span={3} className="product-modal-col-3">
            <Text>옵션</Text>
          </Col>
          <Col span={8} className="product-modal-col-8">
            <Select
              defaultValue={selectedProduct.enableOption ? 0 : 1}
              value={selectedProduct.enableOption ? 0 : 1}
              onChange={onChangeEnableOption}
              style={{ width: 100 }}
            >
              <Option value={0}>사용</Option>
              <Option value={1}>사용안함</Option>
            </Select>
          </Col>
        </Row>
        {selectedProduct.enableOption ? (
          <Row>
            <Col>
              <Table
                columns={columns}
                rowKey={(recode, index) => index.toString()}
                bordered
                pagination={false}
                dataSource={selectedProduct.options}
                size="middle"
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={3} className="product-modal-col-3">
              <Text type="danger">* 총 재고</Text>
            </Col>
            <Col span={8} className="product-modal-col-8">
              <Input
                name="disabledOptionStock"
                className="product-modal-input"
                type="Number"
                value={selectedProduct.disabledOptionStock}
                onChange={e => onChangeProductValue(e)}
              />
            </Col>
            <Col span={3} className="product-modal-col-3">
              <Text>안전 재고</Text>
            </Col>
            <Col span={8} className="product-modal-col-8">
              <Input
                name="disabledOptionSafeStock"
                className="product-modal-input"
                type="Number"
                value={selectedProduct.disabledOptionSafeStock}
                onChange={e => onChangeProductValue(e)}
              />
            </Col>
          </Row>
        )}
      </AntModal>
    </div>
  );
}

export default ProductModal;
