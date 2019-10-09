// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { FlexRow, MultiSelect } from 'components';

// store
import { StoreState } from 'store';

// types
import { CreateEvent, ResponseEvent } from 'models';

// less
import './index.less';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Descriptions, Form, Input, message, Modal, Row, Typography } from 'antd';


// enums
import { PaymentStatus, productNoticeType, productProvision } from 'enums';
import moment from 'moment';
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
  const tests: {} = event;
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
  } = form;

  const [ selected, setSelected ] = useState<string[]>([]);
  const [ selectedTypes, setSelectedTypes ] = useState<OptionModel[]>([]);
  const [ noticeData, setNoticeData ] = useState <object[]>([]);
  const productProvisionDataTemp: object[] = [];

  const handleSetProductNoticeType = useCallback(value => {
    const selectTemp: OptionModel[] = [];

    value.map((selectedItem: string) => {
      productNoticeType.map((item, index) => {
        if(item.value === selectedItem){
          selectTemp.push(item);
        }
      });
    });
    setSelectedTypes(selectTemp);
  }, [setSelectedTypes]);

  useEffect(() => {
    if (event.eventId) {
      const init = ["ETC","MEDICAL_APPLIANCES"];
      handleSetProductNoticeType(init);
      setSelected(init);

      productProvisionDataTemp.push(productProvisionData.productProvisions);
      setNoticeData(productProvisionDataTemp);
      // setFieldsValue(ETC:{
      //   name: event.name,
      //   brandName: event.brand.brandName,
      //   choiceReview: event.choiceReview,
      //   salesStarted: moment(event.salesStarted),
      //   salesEnded: moment(event.salesEnded),
      //   targetAmount: event.targetAmount,
      //   videoUrl: event.videoUrl,
      //   shippingCompeny: event.shippingCompany,
      // });
    }
  }, [event]);

  const productProvisionData : any = {
    productProvisions:[
      {
        legalCertification: "법에 의한 인증 허가 받았음을 확인할 수 있는 내용",
        manufacturer: "제조국",
        manufacturerCountry: "제조자(수입자)",
        modelName: "품목 및 모델명",
        productProvisionType: "ETC",
        serviceManagerNumber: "A/S 책임자와 전화번호",
      },
      {
        handlingSafetyPrecautions: "취급시 주의 사항",
        kcCertified: "KC 인증 필 유무",
        manufacturer: "제조자(수입자)",
        manufacturerCountry: "제조국",
        medicalPermissionReportNumber: "의료기기 법상 허가, 신고 번호 및 광고사전심의필 유무",
        modelName: "품목 및 모델명",
        productProvisionType: "MEDICAL_APPLIANCES",
        qualityAssuranceCriteria: "품질보증기준",
        sameModelLaunchDate: "동일 모델 출시년월",
        serviceManagerNumber: "A/S 책임자와 전화번호",
        usePurposeHow: "제품의 사용목적 및 사용 방법",
        voltagePowerConsumption: "정격전압, 소비전력",
      }
    ]
  };

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
          productProvisions.push([{ "productProvisionType" : key, ...values[key] }]);
        });

        productProvisions.map((item: any, index: number) => {
          Object.keys(item[0]).forEach(key => {
            if (item[0][key] === null || item[0][key] === '') {
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

        if (event.eventId) {
          console.log("이벤트 아이디 있다");
          console.log('updateProductNoticeAsync: ' ,productProvisions);
          dispatch(updateProductNoticeAsync.request({eventId : event.eventId, data: productProvisions }));
        }else{
          console.log("이벤트 아이디 없다");
          console.log('createProductNoticeAsync: ' ,productProvisions);
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
      <Form className="event-notice" onSubmit={handleSubmit}>
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
            <div style={{ width: '100%' }}  >

                <Col span={4}> 상품 정보 제공 고시 </Col>
                <Col span={15}>
                  <MultiSelect selectData={productNoticeType} selected={selected} setSelected={setSelected} onChange={handleSetProductNoticeType}/>
                </Col>
                <Col span={5}>
                  <Button type="primary" htmlType="submit"> 등록 </Button>
                  <Button type="dashed" onClick={handleResetNotice} style={{marginLeft: '10px'}}> 초기화 </Button>
                </Col>

              <Col span ={24}>
                {selectedTypes.length > 0 && (
                <div >
                  {selectedTypes.map((selectedItem:any, i:number) => {
                    console.log(i);
                    return (
                      <div key={selectedItem.value}>
                        <h2>{selectedItem.text}</h2>
                        <table  style={{ width: '98%',border : '1px solid #e7e7e7' ,backgroundColor: '#f3f3f2' }}>
                          <tbody>
                            {
                              productJson[selectedItem.value].map((item:any, index:number) => {
                                return (
                                  <tr key={index} style={{ width: '100%' }}>
                                    <td style={{ width: '20%' }}>
                                      {index} : {item.title}
                                    </td>
                                    <td>
                                      <Form.Item>
                                        {getFieldDecorator(`${selectedItem.value}.${item.key}`, {
                                          initialValue:productProvisionData.productProvisions[i][item.key],
                                          rules: [{ required: true, message: item.title+' 을 입력 바랍니다.' }],
                                        })(
                                          <TextArea
                                            spellCheck={false}
                                            maxLength={100}
                                            autosize={{ minRows: 3, maxRows: 3 }}
                                            style={{ resize: 'none', marginBottom: '10px' }}
                                          />,
                                        )}
                                      </Form.Item>
                                      <span>{item.desc}</span>
                                    </td>
                                  </tr>
                                )
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
