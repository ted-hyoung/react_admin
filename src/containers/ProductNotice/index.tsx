// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { FlexRow, MultiSelect } from 'components';

// store
import { createProductNoticeAsync, updateProductNoticeAsync } from 'store/reducer/product';

// types
import { ResponseEvent, ResponseEventNotice } from 'models';

// less
import './index.less';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Descriptions, Form, Input, message, Modal, Row, Select, Typography } from 'antd';

// enums
import { PAYMENT_STATUSES, productNoticeType, productProvision, productProvisionData } from 'enums';
import { getBytes } from '../../lib/utils';

export interface OptionModel {
  text: string;
  value: string;
}
export interface ProductNoticeSelected {
  noticeId: number;
  contents: string;
}

// defines
const { Option } = Select;
const { TextArea } = Input;
const { Paragraph } = Typography;
const { confirm, info, warning } = Modal;
const MAX_LENGTH = 5;

interface Props extends FormComponentProps {
  event: ResponseEvent;
}

function ProductNotice(props: Props) {
  const { event, form } = props;
  const dispatch = useDispatch();
  const productJson: any = productProvision;
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;

  const [selected, setSelected] = useState<string[]>([""]);
  const [initState, setInitState] = useState<boolean>(false);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  // const [notices, setNotices] = useState<ProductNoticeSelected>({});
  const [selectedTypes, setSelectedTypes] = useState<OptionModel[]>([]);
  const [noticeData, setNoticeData] = useState<any[]>([]);
  const productProvisionDataTemp: any[] = [];

  const handleInitSetProductNoticeType = useCallback(
    value => {
      const selectTemp: OptionModel[] = [];
      setMultiSelected(value);
      productProvisionDataTemp.length = 0;
      value.map((selectedItem: string) => {
        productProvisionDataTemp.push({ productProvisionType: selectedItem, ...productProvisionData });
        productNoticeType.map((item, index) => {
          if (item.value === selectedItem) {
            selectTemp.push(item);
          }
        });
      });
      setSelectedTypes(selectTemp);

      console.log(event.productProvisions);

      if (event.productProvisions.length > 0) {
        productProvisionDataTemp.map((selectedItem, i) => {
          event.productProvisions.map((item, index) => {
            if (i === index) {
              if (selectedItem.productProvisionType === item[`productProvisionType`]) {
                productProvisionDataTemp[i] = item;
              }
            }
          });
        });
      }
      setNoticeData(productProvisionDataTemp);
    },
    [setSelectedTypes, productProvisionDataTemp],
  );

  const handleDeleteSetProductNoticeType = useCallback(

    value => {
      const selectTemp: OptionModel[] = [];
      setMultiSelected(value);
      productProvisionDataTemp.length = 0;

      console.log(value);
      value.map((selectedItem: string) => {
        productProvisionDataTemp.push({ productProvisionType: selectedItem, ...productProvisionData });
        productNoticeType.map((item, index) => {
          if (item.value === selectedItem) {
            selectTemp.push(item);
          }
        });
      });
      setSelectedTypes(selectTemp);

      console.log(event.productProvisions);

      if (event.productProvisions.length > 0) {
        productProvisionDataTemp.map((selectedItem, i) => {
          event.productProvisions.map((item, index) => {
            if (i === index) {
              if (selectedItem.productProvisionType === item[`productProvisionType`]) {
                productProvisionDataTemp[i] = item;
              }
            }
          });
        });
      }
      setNoticeData(productProvisionDataTemp);
    },
    [setSelectedTypes, productProvisionDataTemp],
  );

  const handleSetProductNoticeType = useCallback(
    (value) => {

      console.log('handleSetProductNoticeType', value);
      const selectTemp: OptionModel[] = [];
     // setMultiSelected(value);
      console.log('handleSetProductNoticeType', selected.length);

      selected.splice(selected.length-1,selected.length,value);

      const tem:string[] = [];
      tem.push(...selected);
      setSelected(tem);
      console.log('handleSetProductNoticeType', selected);
      productProvisionDataTemp.length = 0;


      console.log(productProvisionData);
      selected.map((selectedItem: string) => {

        // 타입별 빈 배열 데이터 생성
        productProvisionDataTemp.push({ productProvisionType: selectedItem, ...productProvisionData });

        console.log(productNoticeType);
        productNoticeType.map((item, index) => {
          if (item.value === selectedItem) {
            selectTemp.push(item);
          }
        });
      });
      console.log(selectTemp);

      setSelectedTypes(selectTemp);
      console.log(productProvisionDataTemp);
      console.log(event.productProvisions);
      if (event.productProvisions.length > 0) {


        productProvisionDataTemp.map((selectedItem, i) => {
          event.productProvisions.map((item, index) => {

            if (i === index) {
              if (selectedItem.productProvisionType === item[`productProvisionType`]) {
                productProvisionDataTemp[i] = item;
              }
            }
          });
        });
      }

      setNoticeData(productProvisionDataTemp);
    },
    [setSelectedTypes, productProvisionDataTemp,selected],
  );

  const handleSetProductNotice = useCallback(
    value => {
      console.log(value);

    },
    [setSelectedTypes, productProvisionDataTemp],
  );

  useEffect(() => {
    if (event.productProvisions.length > 0) {
      event.productProvisions.map((item, index) => {
        productProvisionDataTemp.push({
          item,
        });
      });

      const init = event.productProvisions.map(value => value[`productProvisionType`]);
      setSelected(init);
      handleInitSetProductNoticeType(init);
    }
  }, [event,setSelected]);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (selectedTypes.length === 0) {
      message.error('상품 정보 고시 대상을 선택해주세요.');
      return false;
    }

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        const productProvisions: object[] = [];
        Object.keys(values).forEach(key => {

          if (values[key] === undefined) {
            delete values[key];
            return;
          }
          productProvisions.push({ productProvisionType: key.split('_')[0], ...values[key] });
        });

        productProvisions.map((item: any, index: number) => {

          Object.keys(item).forEach(key => {

            // 신규 등록 정보
            if (item[`productProvisionId`] === null) {
              delete item[`productProvisionId`];
            }

            if (item[key] === null || item[key] === '') {

              warning({
                title: `입력하지 않은 정보가 있습니다.\n모든 정보를 입력해주세요.`,
                okText: '확인',
                // onOk() {
                //   console.log("ok");
                // },
              });
              return false;
            }
          });
        });

        if (event.productProvisions.length > 0) {
          dispatch(updateProductNoticeAsync.request({ eventId: event.eventId, data: productProvisions }));
        } else {
          dispatch(createProductNoticeAsync.request({ eventId: event.eventId, data: productProvisions }));
        }
      } else {
        Object.keys(error).map(keys => {
          Object.keys(error[keys]).map(key => {
            warning({
              title: error[keys][key].errors[0].message,
              okText: '확인',
              // onOk() {
              //   console.log("ok");
              // },
            });
          });
        });
      }
    });
  };

  const handleResetNotice = () => {
    setSelected([]);
    setSelectedTypes([]);
  };

  const handleAddNotice = (index:number,notice:string) => {
    if(selected[index] === ""){
      message.error("고시정보 선택후 추가 가능합니다.");
      return false;
    }

    selected.splice(selected.length,0,"");
    const tem:string[] = [];
    tem.push(...selected);
    setSelected(tem);
  };

  const handleRemoveNotice = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const index = Number(e.currentTarget.dataset.index);
    const dataSelected = selected.filter((item, i) => i !== index);
    setSelected(selected.filter((item, i) => i !== index));

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        Object.keys(values).forEach(key => {

          if (values[key] === undefined) {
            delete values[key];
            return;
          }
          delete values[`${selected[index]}_${index}`];
        });
      }
    });

    const dataProductProvisions = event.productProvisions.filter((item, i) => i !== index);
    const selectTemp: OptionModel[] = [];

    setMultiSelected(dataSelected);
    productProvisionDataTemp.length = 0;

    dataSelected.map((selectedItem: string) => {
      productProvisionDataTemp.push({ productProvisionType: selectedItem, ...productProvisionData });
      productNoticeType.map((item, index) => {
        if (item.value === selectedItem) {
          selectTemp.push(item);
        }
      });
    });
    setSelectedTypes(selectTemp);

    if (dataProductProvisions.length > 0) {
      productProvisionDataTemp.map((selectedItem, i) => {
        dataProductProvisions.map((item, index) => {
          if (i === index) {
            if (selectedItem.productProvisionType === item[`productProvisionType`]) {
              productProvisionDataTemp[i] = item;
            }
          }
        });
      });
    }
    setNoticeData(productProvisionDataTemp);
  };

  const formSelectItems = selected.map((item: string, index: number) => (

    <FlexRow key={index}>
      <Col span={4}> 상품 정보 제공 고시 {index+1}</Col>
      <Col>
        {selected.length - 1 === index && <Button type="primary" icon="plus" onClick={() => handleAddNotice(index,item)} />}
        {selected.length !== 1 && (
          <Button
            style={{ marginLeft: 10 }}
            data-index={index}
            type="primary"
            icon="minus"
            onClick={handleRemoveNotice}
          />
        )}
      </Col>
      <Col span={16}>
        <Form.Item>
            <Select
              key={index}
              value={item}
              style={{ width: 120 }}
              onChange={handleSetProductNoticeType}
            >
              {productNoticeType.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
        </Form.Item>
      </Col>
    </FlexRow>
  ));

  return (
    <>
      <Form className="product-notice" onSubmit={handleSubmit}>
        <Descriptions.Item label="*상품 정보 제공 고시" span={24}>
          <FlexRow>
            <Col span={24}>
              <Paragraph>
                <strong># 상품 정보 제공 고시</strong>
                <br />
                - 전자상거래 등에서의 상품 등의 정보제공에 관한 고시법에 따라 구매자에게 상품을 판매하기 위해서는 상품
                정보 제공 고시를 필수로 기입 및 노출하여야 판매가 가능합니다.
                <br />
                - 판매할 상품의 제품군을 선택한 후 각 제품의 상품 정보 제공 고시를 입력해주세요.
                <br />
                - 판매하고자하는 모든 상품의 각 상품 정보 제공 고시를 입력해주셔야합니다.
                <br />
                - 공란 없이 모든 사항을 입력해야하며, 알수 없는 정보일 경우 ＇해당 정보 없음＂ 또는 “OOO으로 인하여 해당
                정보를 알 수 없음＂ 등을 기입해주시기 바랍니다.
                <br />
                - 제품 상세(PRODUCT)에 해당 내용이 있을 경우 각 입력란에 “상세페이지 참고”로 기입해 주시기 바랍니다.
                <br />
                <Col>
                  <a>※상품 정보 제공 고시 자세히 알아보기.</a>
                </Col>
              </Paragraph>
            </Col>
            <div style={{ width: '100%', padding: '0 5px' }}>
              {formSelectItems}
              <Col span={24}>
                {selectedTypes.length > 0 && (
                  <div>
                    {selectedTypes.map((selectedItem, i: number) => {
                      return (
                        <div  key={selectedItem.value + '-' + i}>
                          <h1 className="notice-product-title">{selectedItem.text}</h1>
                          <table
                            style={{
                              width: '98%',
                              border: '1px solid #e7e7e7',
                              backgroundColor: '#f3f3f2',
                              marginBottom: 20,
                            }}
                          >
                            <tbody>
                              {productJson[selectedItem.value].map((item: any, index: number) => {
                                if (item.key === 'productProvisionId') {
                                  return (
                                    <tr key={index} style={{ width: '100%' }}>
                                      <td>
                                        <Form.Item>
                                          {getFieldDecorator(`${selectedItem.value}_${i}.${item.key}`, {
                                            initialValue: noticeData[i] === undefined ? 0 : noticeData[i][item.key],
                                          })(<TextArea hidden={true} />)}
                                        </Form.Item>
                                        <span>{item.desc}</span>
                                      </td>
                                    </tr>
                                  );
                                }
                                if (item.key !== 'productProvisionId') {
                                  return (
                                    <tr key={index} style={{ width: '100%' }}>
                                      <td style={{ width: '20%' }}>{item.title}</td>
                                      <td>
                                        <Form.Item>
                                          {getFieldDecorator(`${selectedItem.value}_${i}.${item.key}`, {
                                            initialValue: noticeData[i] === undefined ? '' : noticeData[i][item.key],
                                            rules: [{ required: true, message: item.title + ' 을 입력 바랍니다.' }],
                                          })(
                                            <TextArea
                                              spellCheck={false}
                                              autosize={{ minRows: 4 }}
                                              style={{ resize: 'none' }}
                                            />,
                                          )}
                                        </Form.Item>
                                        <span>{item.desc}</span>
                                      </td>
                                    </tr>
                                  );
                                }
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Col>
              <Col span={24}>
                <Button type="primary" htmlType="submit">
                  등록
                </Button>
              </Col>
            </div>
          </FlexRow>
        </Descriptions.Item>
      </Form>
    </>
  );
}

export default Form.create<Props>()(ProductNotice);
