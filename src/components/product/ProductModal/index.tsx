// base
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

// modules
import { Button, Col, Input, message, Modal as AntModal, Row, Select, Table, Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ImageUpload from 'components/ImageUpload';
import { FileObject } from 'types/FileObject';
import { calcStringByte, checkInputNumber } from 'lib/utils';
import Form, { FormComponentProps } from 'antd/lib/form';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { createProductAsync } from 'store/reducer/product';

// enums
import { EventStatus } from 'enums';

// types
import { CreateProduct, ResponseOption, ResponseProduct } from 'types';

// less
import './index.less';

// defines
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface ProductModalForm extends FormComponentProps {
  product: ResponseProduct;
  setProduct: Dispatch<SetStateAction<ResponseProduct>>;
  productModalVisible: boolean;
  setProductModalVisible: Dispatch<SetStateAction<boolean>>;
  fileObjectList: FileObject[];
  setFileObjectList: Dispatch<SetStateAction<FileObject[]>>;
}

const ProductModalForm = Form.create<ProductModalForm>()((props: ProductModalForm) => {

  const dispatch = useDispatch();
  const prevProps = useRef<Props>(props);

  const { eventId, eventStatus } = useSelector((state: StoreState) => state.event.event);
  const { product, setProduct, productModalVisible, setProductModalVisible, fileObjectList, setFileObjectList, form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll } = form;

  useEffect(() => {
    if (prevProps.current.product !== props.product) {
      setProduct(product);
    }
  }, [props]);

  useEffect(() => {
    prevProps.current = props;
  }, [props]);

  useEffect(() => {
    if (product.productId) {
      // const newOptions:ResponseOption[] = [];
      // setFieldsValue({
      //   productName: product.productName,
      //   normalSalesPrice: product.normalSalesPrice,
      //   discountSalesPrice: product.discountSalesPrice,
      //   freebie: product.freebie,
      //   enableOption: product.enableOption ? 0 : 1,
      //   options: product.options.forEach((item) => {
      //     newOptions.push({
      //       optionId: item.optionId,
      //       optionName: item.optionName,
      //       salePrice: item.salePrice,
      //       stock: item.stock,
      //       safeStock: item.safeStock,
      //       totalStock: item.totalStock
      //     })
      //   })
      // });
      // setFileObjectList(product.images);
      // if (!product.enableOption) {
      //   setFieldsValue({
      //     disabledOptionStock: product.disabledOptionStock,
      //     disabledOptionSafeStock: product.disabledOptionSafeStock,
      //   })
      // }
    }
  }, [product]);

  const addOptionRow = () => {
    setProduct({
      ...product,
      options: product.options.concat({
          optionId: 0,
          optionName: '',
          salePrice: 0,
          stock: 0,
          safeStock: 0,
          totalStock: 0
      })
    })
  };

  const removeOptionRow = (index: number) => {
    setProduct({
      ...product,
      options: product.options.filter((option, i) => i !== index)
    });

    setFieldsValue({
      options: getFieldValue("options").filter((option: ResponseOption, i: number) => i !== index),
    });
  };

  const onChangeEnableOption = (value: number) => {
    setFieldsValue({
      enableOption: value
    });

    if (value === 0) { // 옵션 사용
      setProduct({
        ...product,
        options: product.options.concat({
          optionId: 0,
          optionName: '',
          salePrice: 0,
          stock: 0,
          safeStock: 0,
          totalStock: 0
        })
      })
    } else if (value === 1) { // 옵션 미사용
      setProduct({
        ...product,
        options: []
      })
    }
  };

  const handleProductModalClose = () => {
    form.resetFields();
    setProductModalVisible(false)
  };

  const columns: Array<ColumnProps<ResponseOption>> = [
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
          render: (text: string, record: ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Form.Item>
                  {getFieldDecorator(`options[${index}].optionId`, {
                    initialValue: record.optionId === undefined ? null : record.optionId
                  })(<div>{index + 1}</div>)}
                </Form.Item>
              </div>
            )
          },
        },
        {
          title: '옵션명',
          key: 'optionName',
          dataIndex: 'optionName',
          align: 'center',
          render: (text: string, record, index: number) => {
            return (
              <div key={index}>
                <Form.Item>
                  {getFieldDecorator(`options[${index}].optionName`, {
                    initialValue: record.optionName
                  })(<Input name="optionName" />)}
                </Form.Item>
              </div>
            );
          },
        },
        {
          title: '옵션 추가 금액',
          key: 'salePrice',
          dataIndex: 'salePrice',
          align: 'center',
          render: (text: string, record, index: number) => {
            return (
              <div key={index}>
                <Form.Item>
                  {getFieldDecorator(`options[${index}].salePrice`, {
                    initialValue: record.salePrice,
                    normalize: (value, prevValue)=> {
                      return checkInputNumber(value, prevValue);
                    }
                  })(<Input name="salePrice" className="product-modal-input" />)}
                </Form.Item>
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
          render: (text: string, record, index: number) => {
            return index + 1;
          },
        },
        {
          title: '총 재고',
          key: 'stock',
          dataIndex: 'stock',
          align: 'center',
          render: (text: string, record, index: number) => {
            return (
              <div key={index}>
                <Form.Item>
                  {getFieldDecorator(`options[${index}].stock`, {
                    initialValue: record.stock,
                    normalize: (value, prevValue)=> {
                      return checkInputNumber(value, prevValue);
                    }
                  })(<Input name="salePrice" className="product-modal-input" />)}
                </Form.Item>
              </div>
            );
          },
        },
        {
          title: '안전 재고',
          key: 'safeStock',
          dataIndex: 'safeStock',
          align: 'center',
          render: (text: string, record: ResponseOption, index: number) => {
            return (
              <div key={index}>
                <Form.Item>
                  {getFieldDecorator(`options[${index}].safeStock`, {
                    initialValue: record.safeStock,
                    normalize: (value, prevValue)=> {
                      return checkInputNumber(value, prevValue);
                    }
                  })(<Input name="salePrice" className="product-modal-input" />)}
                </Form.Item>
              </div>
            );
          },
        },
        {
          title: '추가/삭제',
          key: 'button',
          dataIndex: 'button',
          align: 'center',
          render: (text: string, record: ResponseOption, index: number) => {
            const button: JSX.Element[] = [];
            if (index === product.options.length - 1) {
              button.push(
                <div key={index}>
                  <div>
                    <Button type="primary" onClick={addOptionRow}>
                      추가
                    </Button>
                  </div>
                </div>
              );
            } else {
              button.push(
                <div key={index}>
                  <div>
                    <Button type="danger" onClick={() => removeOptionRow(index)}>
                      삭제
                    </Button>
                  </div>
                </div>
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

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values: CreateProduct) => {
      if (!error) {
        const {
          productName,
          normalSalesPrice,
          discountSalesPrice,
          disabledOptionStock,
          disabledOptionSafeStock,
          enableOption,
          freebie,
          options
        } = values;
        const newOptions = options.slice(0, options.length -1);
        if (product.productId === 0) {
          const createProduct:CreateProduct = {
            productName,
            normalSalesPrice: Number(normalSalesPrice),
            discountSalesPrice: Number(discountSalesPrice),
            disabledOptionStock: 0,
            disabledOptionTotalStock: 0,
            disabledOptionSafeStock: 0,
            enableOption: true,
            options: [],
            freebie,
            images: fileObjectList
          };
          if (enableOption === 0) { // 옵션 사용
            newOptions.map((item) => {
              createProduct.options.push({
                optionName: item.optionName,
                salePrice: Number(item.salePrice),
                stock: Number(item.stock),
                safeStock: Number(item.safeStock),
                totalStock: Number(item.stock)
              })
            });
          } else if (enableOption === 1) { // 옵션 미사용
            createProduct.disabledOptionStock = Number(disabledOptionStock);
            createProduct.disabledOptionTotalStock = Number(disabledOptionStock);
            createProduct.disabledOptionSafeStock = Number(disabledOptionSafeStock);
            createProduct.enableOption = false;
          }
          dispatch(createProductAsync.request({eventId, data: createProduct}));
        } else {

        }
      } else {
        Object.keys(error).map((key) => {message.error(error[key].errors[0].message);});
      }
    });
  };

  return (
    <>
      <div className="product-modal" >
        <AntModal title={product.productId === 0 ? '제품 등록' : '제품 수정'} visible={productModalVisible} footer={false} width={1200} destroyOnClose onCancel={handleProductModalClose}>
          <Form onSubmit={handleSubmit}>
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
                <Form.Item>
                  {getFieldDecorator('productName', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '상품명을 입력해주세요.'
                      }
                    ]
                  })(<Input name="productName" placeholder="텍스트 입력" maxLength={20} />)}
                </Form.Item>
              </Col>
              <Col span={3} className="product-modal-explanation">
                <span>{calcStringByte(getFieldValue("productName"))}/20자</span>
              </Col>
            </Row>
            <Row>
              <Col span={3} className="product-modal-col-3">
                <Text type="danger">* 판매가</Text>
              </Col>
              <Col span={8} className="product-modal-col-8">
                <Form.Item>
                  {getFieldDecorator('normalSalesPrice', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                        message: '판매가를 입력해주세요.',
                        validator: (rule, value, callback) => {
                          if (Number(value) === 0) {
                            callback(rule.message);
                          }
                          callback();
                        }
                      }
                    ],
                    normalize: (value, prevValue)=> {
                      return checkInputNumber(value, prevValue);
                    }
                  })(<Input className="product-modal-input" name="normalSalesPrice" />)}
                </Form.Item>
              </Col>
              <Col span={1} className="product-modal-explanation">
                원
              </Col>
              <Col span={3} className="product-modal-col-3">
                <Text>* 정상가</Text>
              </Col>
              <Col span={8} className="product-modal-col-8">
                <Form.Item>
                  {getFieldDecorator('discountSalesPrice', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                        message: '정상가를 입력해주세요.',
                        validator: (rule, value, callback) => {
                          if (Number(value) === 0) {
                            callback(rule.message);
                          }
                          callback();
                        }
                      },
                      {
                        required: true,
                        message: '정상가는 판매가 보다 클수 없습니다.',
                        validator: (rule, value, callback) => {
                          if (Number(value) > getFieldValue("normalSalesPrice")) {
                            callback(rule.message);
                          }
                          callback();
                        }
                      }
                    ],
                    normalize: (value, prevValue)=> {
                      return checkInputNumber(value, prevValue);
                    }
                  })(<Input className="product-modal-input" name="discountSalesPrice" />)}
                </Form.Item>
              </Col>
              <Col span={1} className="product-modal-explanation">
                원
              </Col>
            </Row>
            <Row>
              <Col span={3} className="product-modal-col-3">
                <Text>사은품</Text>
              </Col>
              <Col span={20} style={{ height: 52 }}>
                <Form.Item>
                  {getFieldDecorator('freebie', {
                    initialValue: ''
                  })(<TextArea name="freebie" />) }
                </Form.Item>
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
            <Row>
              <Col span={3} className="product-modal-col-3">
                <Text>옵션</Text>
              </Col>
              <Col span={8} className="product-modal-col-8">
                <Form.Item>
                  {getFieldDecorator('enableOption', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                        message: '옵션 사용여부를 선택해주세요.'
                      }
                    ]
                  })(<Select style={{ width: 100 }} onChange={onChangeEnableOption}>
                    <Option value={0}>사용함</Option>
                    <Option value={1}>사용안함</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            {getFieldValue("enableOption") === 0 ? (
              <Row>
                <Col>
                  <Table
                    columns={columns}
                    rowKey={(recode, index) => index.toString()}
                    bordered
                    pagination={false}
                    dataSource={product.options}
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
                  <Form.Item>
                    {getFieldDecorator('disabledOptionStock', {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          message: '총 재고를 입력해주세요.'
                        }
                      ],
                      normalize: (value, prevValue)=> {
                        return checkInputNumber(value, prevValue);
                      }
                    })(<Input className="product-modal-input" name="disabledOptionStock" />)}
                  </Form.Item>
                </Col>
                <Col span={3} className="product-modal-col-3">
                  <Text>안전 재고</Text>
                </Col>
                <Col span={8} className="product-modal-col-8">
                  <Form.Item>
                    {getFieldDecorator('disabledOptionSafeStock', {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          message: '안전 재고를 입력해주세요.'
                        }
                      ],
                      normalize: (value, prevValue)=> {
                        return checkInputNumber(value, prevValue);
                      }
                    })(<Input className="product-modal-input" name="disabledOptionSafeStock" />)}
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row>
              <div className="product-modal-button">
                {eventStatus === EventStatus[EventStatus.READY] && <Button type="primary" size="large" htmlType="submit">등록</Button>}
                <Button type="danger" size="large" onClick={handleProductModalClose} >취소</Button>
              </div>
            </Row>
          </Form>
        </AntModal>
      </div>
    </>
  )
});

interface Props {
  product: ResponseProduct;
  setProduct: Dispatch<SetStateAction<ResponseProduct>>;
  productModalVisible: boolean;
  setProductModalVisible: Dispatch<SetStateAction<boolean>>;
}

function ProductModal(props: Props) {
  const { product, setProduct, productModalVisible, setProductModalVisible } = props;
  const [ fileObjectList, setFileObjectList ] = useState<FileObject[]>([]);

  return (
    <>
      <ProductModalForm
        product={product}
        setProduct={setProduct}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        fileObjectList={fileObjectList}
        setFileObjectList={setFileObjectList} />
    </>
  );
}

export default ProductModal;