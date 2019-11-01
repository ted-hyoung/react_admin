// base
import React, { useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Checkbox, Row, Col, Input, Modal, Select } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';

// store
import { StoreState } from 'store';
import { banksCode } from 'enums';
// assert
import './index.less';
import {
  cancelPaymentVirtualAccountAsync,
  checkRefundAccountAsync,
  resetRefundAccountStateReducer,
} from '../../store/reducer/order';
const { warning, info } = Modal;
const { Option } = Select;
// types

interface Props extends FormComponentProps {
  orderNo: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  totalAmount: number;
}
const OrderCancelForm = Form.create<Props>()((props: Props) => {
  const dispatch = useDispatch();
  const { order } = useSelector((state: StoreState) => state);
  const { refundAccountState } = order;
  const { form, orderNo, totalAmount, visible, setVisible } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll } = form;
  const onChangeBanksCode = (value: string) => {
    setFieldsValue({
      refundAccountBank: value,
    });
  };

  useEffect(() => {
    return () => {
      dispatch(resetRefundAccountStateReducer());
    };
  }, [visible]);

  const handleAuthenticationSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        dispatch(
          checkRefundAccountAsync.request({
            data: {
              orderNo,
              refundAccountBank: getFieldValue('refundAccountBank'),
              refundAccountDepositor: getFieldValue('refundAccountDepositor'),
              refundAccountNumber: getFieldValue('refundAccountNumber'),
            },
          }),
        );
      } else {
        Object.keys(error).map(key => {
          warning({
            title: error[key].errors[0].message,
            okText: '확인',
          });
        });
      }
    });
  };

  const handleCancelRequestVirtualAccount = useCallback(() => {
    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        dispatch(
          cancelPaymentVirtualAccountAsync.request({
            orderNo: values.orderNo,
            data: {
              refundAccountBank: getFieldValue('refundAccountBank'),
              refundAccountDepositor: getFieldValue('refundAccountDepositor'),
              refundAccountNumber: getFieldValue('refundAccountNumber'),
              refundVirtualAccountAgree: getFieldValue('isAgree'),
              totalAmount : values.totalAmount
            },
          }),
        );
        if (refundAccountState) {
          info({
            title: '주문취소 신청이 완료 되었습니다.',
            okText: '주문 취소 승인 후 입금까지 수분 소요되오니 참고해주시기 바랍니다.',
          });
        }
      } else {
        Object.keys(error).map(key => {
          warning({
            title: error[key].errors[0].message,
            okText: '확인',
          });
        });
      }
    });
  }, [dispatch]);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal
        destroyOnClose={true}
        width="460px"
        className="cancel-modal"
        style={{ borderRadius: 30 }}
        bodyStyle={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          whiteSpace: 'normal',
        }}
        // zIndex={1000}
        centered
        closable={false}
        visible={visible}
        footer={
          <div className="cancel-modal-footer cancel-modal-footer--confirm" style={{ justifyContent: 'space-around' }}>
            <Button
              className="animation--disabled"
              style={ refundAccountState ? ({ color:'#6a98f8',fontWeight: 700 }):({ color:'#d9d9d9' })}
              disabled={!refundAccountState}
              onClick={handleCancelRequestVirtualAccount}
            >
              결제 취소
            </Button>
            <Button className="animation--disabled" onClick={handleCancel}>
              닫기
            </Button>
          </div>
        }
      >
        <div className="cancel-modal-orders-cancel">
          <div>
            <div className="cancel-modal-orders-cancel-header-main">가상 계좌 결제 취소</div>
            <div className="cancel-modal-orders-cancel-header-sub">환불 받으실 계좌정보를 정확히 입력해주세요.</div>
          </div>
          <div className="cancel-modal-orders-cancel-form">
            <Form>
              <Row type="flex">
                <Col span={6}>
                  <span className="cancel-modal-orders-cancel-form-title">은행</span>
                </Col>
                <Col span={18}>
                  {getFieldDecorator('refundAccountBank', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '은행을 선택해 주세요!',
                      },
                    ],
                  })(
                    <Select
                      className="cancel-modal-orders-cancel-form-option"
                      disabled={refundAccountState}
                      onChange={onChangeBanksCode}
                    >
                      <Option value="" style={{ zIndex: 2050 }}>은행선택</Option>
                      {banksCode.banks.map((item, index) => {
                        return (
                          <Option key={index} value={item.code} style={{ zIndex: 2050 }}>
                            {console.log(item.key)}
                            {item.key}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </Col>
              </Row>
              <Row type="flex">
                <Col span={6}>
                  <span className="cancel-modal-orders-cancel-form-title">계좌번호</span>
                </Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('refundAccountNumber', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '계좌번호를 입력해주세요.',
                        },
                      ],
                    })(
                      <Input
                        className="cancel-modal-orders-cancel-form-input"
                        disabled={refundAccountState}
                        placeholder="계좌번호를 입력해주세요."
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex">
                <Col span={6}>
                  <span className="cancel-modal-orders-cancel-form-title">예금주 성명</span>
                </Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('refundAccountDepositor', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '계좌주의 성명을 입력해주세요.',
                        },
                      ],
                    })(
                      <Input
                        className="cancel-modal-orders-cancel-form-input"
                        disabled={refundAccountState}
                        placeholder="계좌주의 성명을 입력해주세요."
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex">
                <Col
                  span={24}
                  className="cancel-modal-orders-cancel-form-check"
                  style={{ margin: '20px 0' }}
                  onClick={handleAuthenticationSubmit}
                >
                  <Button className="cancel-modal-orders-cancel-form-button" type="primary" disabled={refundAccountState}>
                    {refundAccountState ? '계좌인증 인증되었습니다' : '계좌인증'}
                  </Button>
                </Col>
                <Col>
                  <Form.Item>
                    {getFieldDecorator('isAgree', {
                      valuePropName: 'checked',
                      rules: [{ required: true, message: '동의가 필요합니다..' }],
                    })(
                      <Checkbox disabled={refundAccountState} className="cancel-modal-orders-cancel-form-checkbox">
                        환불계좌 및 정보 제공 동의(필수)
                      </Checkbox>,
                    )}
                    <span className="cancel-modal-orders-cancel-form-checkbox">
                      환불계좌정보는 환불처리를 위해 수집 및 이용되며, 개인정보처리방침에 따라 보호됩니다.
                    </span>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                {getFieldDecorator('orderNo', {
                  initialValue: orderNo,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input type="hidden" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('totalAmount', {
                  initialValue: totalAmount,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input type="hidden" />)}
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default Form.create<Props>()(OrderCancelForm);
