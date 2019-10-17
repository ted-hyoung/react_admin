// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { FlexRow, MultiSelect } from 'components';

// store
import { StoreState } from 'store';

// types
import { ResponseEvent } from 'models';

// less
import './index.less';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Descriptions, Form, Input, message, Modal, Row, Typography } from 'antd';


// enums
import { productNoticeType, productProvision, productProvisionData  } from 'enums';
import { createProductNoticeAsync, updateProductNoticeAsync } from '../../../store/reducer/product';

export interface OptionModel {
  "text" : string;
  "value" : string;
}

// defines
const { TextArea } = Input;
const { Paragraph } = Typography;
const { confirm, info, warning} = Modal;

interface Props extends FormComponentProps{
  event: ResponseEvent;
}

function ProductNotice(props: Props) {

  const { event ,form} = props;
  const dispatch = useDispatch();
  const productJson: any = productProvision;
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
  } = form;

  const [ selected, setSelected ] = useState<string[]>([]);
  const [ multiSelected, setMultiSelected ] = useState<string[]>([]);
  const [ selectedTypes, setSelectedTypes ] = useState<OptionModel[]>([]);
  const [ noticeData, setNoticeData ] = useState <any[]>([]);
  const productProvisionDataTemp: any[] = [];

  const handleSetProductNoticeType = useCallback(value => {
    const selectTemp: OptionModel[] = [];
    setMultiSelected(value);
    productProvisionDataTemp.length = 0;
    value.map((selectedItem: string) => {

      productProvisionDataTemp.push({ "productProvisionType" : selectedItem, ...productProvisionData });
      productNoticeType.map((item, index) => {
        if(item.value === selectedItem){
          selectTemp.push(item);
        }
      });
    });
    setSelectedTypes(selectTemp);

    if (event.productProvisions.length > 0) {

      productProvisionDataTemp.map((selectedItem , i) => {
        event.productProvisions.map((item, index) => {
          if(selectedItem.productProvisionType === item[`productProvisionType`]){
            productProvisionDataTemp[i]= item;
          }
        });
      });
    }
    setNoticeData(productProvisionDataTemp);
  }, [setSelectedTypes ,productProvisionDataTemp]);

  useEffect(() => {

    if (event.productProvisions.length > 0) {
      event.productProvisions.map((item, index) => {
        productProvisionDataTemp.push({
          item
        });
      });

      const init = event.productProvisions.map(value => value[`productProvisionType`]);
      handleSetProductNoticeType(init);
      setSelected(init);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {

    e.preventDefault();

    if(selectedTypes.length === 0){
      message.error('상품 정보 고시 대상을 선택해주세요.');
      return false;
    }

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {

      if (!error) {
        const productProvisions:object[] = [];
        Object.keys(values).forEach(key => {
          if (values[key] === undefined) {
            delete values[key];
            return;
          }
          productProvisions.push({ "productProvisionType" : key, ...values[key] });
        });
        productProvisions.map((item: any, index: number) => {
          Object.keys(item).forEach(key => {

            if(item[`productProvisionId`] === null){
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
          dispatch(updateProductNoticeAsync.request({eventId : event.eventId, data: productProvisions }));
        }else{
          dispatch(createProductNoticeAsync.request({eventId : event.eventId, data: productProvisions }));
        }
      }else{
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

  return (
    <>
      <Form className="product-notice" onSubmit={handleSubmit}>
        <Descriptions.Item label="*상품 정보 제공 고시" span={24}>
          <FlexRow>
            <Col span={24}>
              <Paragraph>
                <strong># 상품 정보 제공 고시</strong>
                <br />
                - 전자상거래 등에서의 상품 등의 정보제공에 관한 고시법에 따라 구매자에게 상품을 판매하기 위해서는 상품 정보 제공 고시를 필수로 기입 및 노출하여야 판매가 가능합니다.
                <br />
                - 판매할 상품의 제품군을 선택한 후 각 제품의 상품 정보 제공 고시를 입력해주세요.
                <br />
                - 판매하고자하는 모든 상품의 각 상품 정보 제공 고시를 입력해주셔야합니다.
                <br />
                - 공란 없이 모든 사항을 입력해야하며, 알수 없는 정보일 경우 ＇해당 정보 없음＂ 또는 “OOO으로 인하여 해당 정보를 알 수 없음＂ 등을 기입해주시기 바랍니다.
                <br />
                - 제품 상세(PRODUCT)에 해당 내용이 있을 경우 각 입력란에 “상세페이지 참고”로 기입해 주시기 바랍니다.
                <br />
                <Col>
                  <a>※상품 정보 제공 고시 자세히 알아보기.</a>
                </Col>
              </Paragraph>
            </Col>
            <div style={{ width: '100%', padding: '0 5px' }}  >

              <Row style={{ marginBottom: 20 }}>
                <Col span={4}> 상품 정보 제공 고시 </Col>
                <Col span={20} style={{ display: 'flex' }}>
                  <MultiSelect selectData={productNoticeType} selected={selected} setSelected={setSelected} onChange={handleSetProductNoticeType}/>
                  <Button type="primary" htmlType="submit" style={{marginLeft: '10px'}}> 등록 </Button>
                  <Button type="dashed" onClick={handleResetNotice} style={{marginLeft: '10px'}}> 초기화 </Button>
                </Col>
              </Row>
              <Col span ={24}>
                {selectedTypes.length > 0 && (
                <div >
                  {selectedTypes.map((selectedItem, i: number) => {
                    return (
                      <div key={selectedItem.value}>
                        <h1 className='notice-product-title'>{selectedItem.text}</h1>
                        <table  style={{ width: '98%',border : '1px solid #e7e7e7' ,backgroundColor: '#f3f3f2', marginBottom: 20 }}>
                          <tbody>
                            {
                              productJson[selectedItem.value].map((item:any , index: number) => {
                                if(item.key === 'productProvisionId'){
                                  return (
                                    <tr key={index} style={{ width: '100%' }}>
                                      <td>
                                        <Form.Item>
                                          {getFieldDecorator(`${selectedItem.value}.${item.key}`, {
                                            initialValue: noticeData[i] === undefined ? 0 : noticeData[i][item.key],
                                          })(
                                            <TextArea hidden={true}/>,
                                          )}
                                        </Form.Item>
                                        <span>{item.desc}</span>
                                      </td>
                                    </tr>
                                  )
                                }
                                if(item.key !== 'productProvisionId'){
                                  return (
                                    <tr key={index} style={{ width: '100%' }}>
                                      <td style={{ width: '20%' }}>{item.title}</td>
                                      <td>
                                        <Form.Item>
                                          {getFieldDecorator(`${selectedItem.value}.${item.key}`, {
                                            initialValue: noticeData[i] === undefined ? '' : noticeData[i][item.key],
                                            rules: [{ required: true, message: item.title+' 을 입력 바랍니다.' }],
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
                                  )
                                }
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                      )
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
