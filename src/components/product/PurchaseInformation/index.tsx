// base
import React, { useState, useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  createEventAsync,
  createEventShippingAsync,
  updateEventByIdAsync,
  updateEventShippingAsync,
} from 'store/reducer/event';
import { CreateEvent, ResponseEvent, UpdateEvent, ResponseBrandForEvent } from 'models';
import { FileObject } from 'models/FileObject';

// modules
import moment, { Moment } from 'moment';
import {
  Form,
  Descriptions,
  Input,
  Row,
  Col,
  Button,
  DatePicker,
  TimePicker,
  Typography,
  InputNumber,
  message,
  Select, Checkbox, Modal,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import YouTube from 'react-youtube';

// components
import { SelectOptionModal, FlexRow, TextEditor, ImageUpload } from 'components';

// libs
import { calcStringByte, getAdminProfile } from 'lib/utils';

import './index.less';
import { DEFAULT_PAYMENT_STATUSES, EventStatus, PAYMENT_STATUSES, ShippingCompanies } from 'enums';
import { initialValue } from '../../searchForm/SearchKeyAndValue';
import { createProductNoticeAsync, updateProductNoticeAsync } from '../../../store/reducer/product';

// defines
const { TextArea } = Input;
const { Paragraph, Text } = Typography;
const TIME_FORMAT = 'HH:mm A';
const { Option } = Select;
const { confirm, info, warning} = Modal;

interface Props extends FormComponentProps {
  event: ResponseEvent;
}

function PurchaseInformation(props: Props) {
  const { event, form } = props;
  const [cancelExchangeReturnRegulationAgree, setCancelExchangeReturnRegulationAgree] = useState<boolean>(true);
  const [cancelExchangeReturnAgree, setCancelExchangeReturnAgree] = useState<boolean>(true);
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    isFieldsTouched,
    resetFields,
    validateFieldsAndScroll,
  } = form;

  useEffect(() => {
    setFieldsValue({
      shippingFeeInfo : {
        shippingFee : event.shippingFeeInfo.shippingFee,
      },
      shippingPeriod: event.shippingPeriod,
      cancellationExchangeReturnRegulationAgree:event.cancellationExchangeReturnRegulationAgree,
      cancellationExchangeReturnAgree:event.cancellationExchangeReturnAgree
    });
    setCancelExchangeReturnRegulationAgree(true);
    setCancelExchangeReturnAgree(true);

  }, [event, setFieldsValue]);


  const dispatch = useDispatch();

  // const onChange = (e:any) => {
  //   console.log(`checked = ${e.target.checked}`);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {

      if (!error) {
        if(!values.cancellationExchangeReturnRegulationAgree){
          message.info('취소/교환/반품 규정 안내 항목에 동의가 필요합니다.');
          return false;
        }
        if(!values.cancellationExchangeReturnAgree){
          message.info('취소/교환/반품비 안내 항목에 동의가 필요합니다.');
          return false;
        }
        if(values.shippingPeriod === '' || values.shippingPeriod === null){
          message.info('배송 안내의 배송기간을 입력해주세요.');
          return false;
        }
        if(values.shippingFeeInfo.shippingFee === undefined ){
          message.info('배송 안내의 배송비를 입력해주세요.');
          return false;
        }

        dispatch(updateEventShippingAsync.request({eventId : event.eventId, data: values }));
        // if (values.cancellationExchangeReturnRegulationAgree) {
        //    dispatch(updateEventShippingAsync.request({eventId : event.eventId, data: values }));
        // }else{
        //    dispatch(createProductNoticeAsync.request({eventId : event.eventId, data: values }));
        // }
      }else{
        Object.keys(error).map(key => {
          console.log(error[key].errors);
          warning({
            title: error[key].errors[0].message,
            okText: '확인',
            // onOk() {
            //   console.log("ok");
            // },
          });
        });
      }
    });
  };

  return (
    <>
      <Form className="PurchaseInformation-form" onSubmit={handleSubmit}>
        <Descriptions bordered title="구매안내" column={24}>
          <Descriptions.Item label="배송안내" span={24}>
            <FlexRow>
              <Paragraph>
                <strong># 주의 사항</strong>
                <br />
                - 배송비에 관한 사항을 기입해주시기 바라며, 배송비 및 도서산간지역 추가비용 등 정확한 비용을 입력해주세요.
                <br />
                - 배송비의 경우 제품 정보 등록 시 동일하게 입력해주세요.
              </Paragraph>

                  <table>
                    <tbody>
                    <tr>
                      <td className="PurchaseInformation-th">
                        배송 방법
                      </td>
                      <td className="PurchaseInformation-td">
                        택배
                      </td>
                    </tr>
                    <tr>
                      <td className="PurchaseInformation-th">
                        배송 지역
                      </td>
                      <td className="PurchaseInformation-td">
                        전국 지역
                      </td>
                    </tr>
                    <tr>
                      <td className="PurchaseInformation-th">
                        배송비
                      </td>
                      <td className="PurchaseInformation-td">
                        <Col span={6}>
                          <Form.Item>
                            {getFieldDecorator('shippingFeeInfo.shippingFee',{
                              rules: [{ required: true, message: '배송료를 입력 바랍니다.' }],
                              }
                            )(
                              <InputNumber
                                min={0}
                                step={500}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
                              />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col>
                          <span>원(\)</span>
                        </Col>
                        <Col>
                          <Text type="danger">※ 0원으로 기입할 경우 무료배송으로 대체 표기됩니다.</Text>
                        </Col>
                      </td>
                    </tr>
                    <tr>
                      <td className="PurchaseInformation-th">
                        도서산간지역
                      </td>
                      <td className="PurchaseInformation-td">
                        기본 배송비 외 도서산간지역 추가 배송비는 착불입니다.
                      </td>
                    </tr>
                    <tr>
                      <td className="PurchaseInformation-th">
                        배송기간
                      </td>
                      <td className="PurchaseInformation-td">
                          <Form.Item>
                            {getFieldDecorator('shippingPeriod', {
                              rules: [{ required: true, message: '배송기간을 입력 바랍니다.' }],
                            })(
                              <Input/>,
                            )}
                          </Form.Item>
                      </td>
                    </tr>
                    </tbody>
                </table>

            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="취소/교환/반품 규정 안내" span={24}>
            <FlexRow>
              <Paragraph>
                <strong># 주의 사항</strong>
                <br />
                - 판매 중/종료 후의 환불 및 교환, 반품 요청은 From C와 셀럽, 소비자가 함께 약속한 정책에 따릅니다.
                <br />
                - 하기 사항은 FROM C(프롬 C)의 취소/반품/교환 규정으로 반드시 지켜주시기 바랍니다.
                <br />
                - 하기 사항은 수정이 불가하며, 불가피하게 수정이 필요한 경우 공구 등록 후 고객센터로 문의해주시기 바랍니다.
              </Paragraph>
              <Col span={24}>
                <table >
                  <tbody>
                  <tr>
                    <td className="PurchaseInformation-td">
                      - 상품/판매/생산방식 특성상, 교환/반품 시, 판매자에게 회복할 수 없는 손해가 발생한 경우 (판매종료 후, 개별 생산, 맞춤 제작 등) 반품/교환 등이 불가합니다.
                      <br />
                      - 프롬 C에서 판매한 모든 상품은 주문기간 내에만 주문 취소가 가능합니다.
                      <br />
                      - 조기품절로 인하여 주문기간이 변경되면, 주문 취소 가능 기간 역시 변경됩니다.
                      <br />
                      - 일반 제품의 경우 주문 종료 후 제작 중/배송 준비 중/배송 중 상태에서는 주문 취소/교환/환불이 불가합니다.
                      <br />
                      - 일반 제품의 경우 단순변심으로 인한 교환/반품은 제품 수령일로부터 7일 이내 가능합니다.
                      <br />
                      - 수령하신 제품의 내용이 표시, 광고 내용과 다르거나 계약 내용과 다르게 이행된 때에는 당해 제품을 공급받은 날부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
                      <br />
                      - 단순변심 반품의 경우 추가 배송비가 부담되며, 제품의 상태는 재판매가 가능하여야 합니다.
                      <br />
                      - 수령하신 제품이 불량인 경우, 확인이 가능하도록 사진을 포함하여 고객센터(마이페이지>주문내역>1:1문의)로 연락주시면 확인 후 신속한 답변 드리겠습니다. 식품의 경우도 파손이나 변질로 인한 제품의 섭취가 어려운 경우 사진을 포함하여 고객센터로 문의바랍니다.
                      <br />
                      - 배송정보(연락처/주소)가 올바르게 기재되지 않을 경우 배송이 지연되거나 반송될 수 있으므로 정확한 정보를 기재해 주시기 바라며, 이로 인한 반송의 경우 배송비가 부과될 수 있습니다.
                      <br />
                      - 제품의 특성에 따라 제주 및 도서 산간 지역의 경우 배송이 불가할 수 있으며 결제 이후 자동 주문 취소 처리가 될 수 있습니다.
                      <br />
                      <br />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </Col>
              <Row>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('cancellationExchangeReturnRegulationAgree', {
                      initialValue : cancelExchangeReturnRegulationAgree,
                      rules: [{ required: true, message: '동의가 필요합니다..' }],
                    })(<Checkbox>본 공구 신청 시 상기 공구 규정 조항에 대해 숙지 하였으며,
                      본 규정에 따라 공구를 운영함에 동의합니다.
                    </Checkbox>)}

                  </Form.Item>
                </Col>
              </Row>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="취소/교환/반품비 안내" span={24}>
            <FlexRow>
              <Paragraph>
                <strong># 주의 사항</strong>
                <br />
                - 판매 중/종료 후의 환불 및 교환, 반품 요청은 FROM C와 셀럽, 소비자가 함께 약속한 정책에 따릅니다.
                <br />
                - 하기 사항은 FROM C(프롬 C)의 취소/반품/교환 규정으로 반드시 지켜주시기 바랍니다.
                <br />
                - 하기 사항은 수정이 불가하며, 불가피하게 수정이 필요한 경우 공구 등록 후 고객센터로 문의해주시기 바랍니다.
                <br />
                - 반품/교환 등으로 인한 배송비를 정확히 입력해주세요.
                <br />

              </Paragraph>
              <Col span={24}>
                <table >
                  <tbody>
                  <tr>
                    <td className="PurchaseInformation-td">
                      <strong>※ 취소/반품/교환 배송비</strong>
                      <br />
                      - 제품파손, 오배송 등의 제작사 귀책 사유로 교환/반품이 필요한 경우, 교환/반품 배송비는 판매자가 부담합니다.
                      <br />
                      - 사이즈, 색상 변경 등 구매자 변심 사유로 교환/반품이 가능한 경우, 구매하신 분께서 배송비를 부담하셔야 합니다.
                      <br />
                      - 교환 : 왕복 배송 실비 부담
                      <br />
                      - 반품(배송비 결제) : 편도 배송 실비 부담
                      <br />
                      - 반품(배송비 무료로 결제) : 왕복 배송 실비 부담
                      <br />
                      <br />
                    </td>
                  </tr>

                  </tbody>
                </table>
              </Col>
              <Row>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('cancellationExchangeReturnAgree', {
                      initialValue : cancelExchangeReturnAgree,
                      rules: [{ required: true, message: '동의가 필요합니다..' }],
                    })(<Checkbox>본 공구 신청 시 상기 공구 규정 조항에 대해 숙지 하였으며,
                      본 규정에 따라 공구를 운영함에 동의합니다.
                    </Checkbox>)}
                  </Form.Item>
                </Col>
              </Row>
            </FlexRow>
          </Descriptions.Item>
        </Descriptions>
        <Form.Item style={{ textAlign: 'right', marginTop: 10 }}>
          <Button type="primary" htmlType="submit">
            {event.eventId ? '수정' : '등록'}
          </Button>
        </Form.Item>
      </Form>
      <Prompt when={isFieldsTouched()} message={'현재 작성중인 내용이 있습니다. 뒤로 가시겠습니까?'} />
    </>
  );
}

export default Form.create<Props>()(PurchaseInformation);
