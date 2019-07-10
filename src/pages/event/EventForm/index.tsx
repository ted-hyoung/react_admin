// base
import React, { useState } from 'react';

// modules
import moment from 'moment';
import {
  Form,
  Descriptions,
  Input,
  Row,
  Col,
  Mentions,
  Button,
  DatePicker,
  TimePicker,
  Typography,
  InputNumber,
  Modal,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RowProps } from 'antd/lib/row';
import { calcStringByte } from 'lib/utils';
import { SelectOptionModal } from 'components';

import './index.less';
import { useDispatch } from 'react-redux';
import { createEventAsync } from 'store/reducer/event';
import { CreateEvent } from 'types';
import { OptionProps } from 'rc-mentions/lib/Option';
import { LabeledValue } from 'antd/lib/select';

// defines
const { TextArea } = Input;
const { Text } = Typography;
const format = 'HH:mm A';

function FlexRow(props: RowProps) {
  return (
    <Row type="flex" align="middle" gutter={10} {...props}>
      {props.children}
    </Row>
  );
}

function CreateEventForm(props: FormComponentProps) {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll } = form;

  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values: CreateEvent) => {
      if (!error) {
        const data: CreateEvent = {
          name: values.name,
          brandName: values.brandName,
          choiceReview: values.choiceReview,
          detail: values.detail,
          salesStarted: moment(values.salesStarted).format('YYYY-MM-DDTHH:mm'),
          salesEnded: moment(values.salesEnded).format('YYYY-MM-DDTHH:mm'),
          targetAmount: values.targetAmount,
          videoUrl: values.videoUrl,
        };

        dispatch(createEventAsync.request({ data }));
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  const handleSelectBrandName = (value: LabeledValue) => {
    setFieldsValue({ brandName: value.label });
    setVisible(false);
  };

  return (
    <>
      <Form className="create-event" onSubmit={handleSubmit}>
        <button type="submit">등록</button>
        <Descriptions bordered title="공구 정보" column={24}>
          <Descriptions.Item label="*공구명" span={24}>
            <FlexRow>
              <Col>
                <span>1차</span>
              </Col>
              <Col span={18}>
                <Form.Item>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '공구명을 입력해주세요.',
                      },
                    ],
                  })(<Input maxLength={100} size="large" />)}
                </Form.Item>
              </Col>
              <Col style={{ alignSelf: 'flex-end' }}>
                <span>{calcStringByte(getFieldValue('name'))}/100</span>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="*초이스리뷰" span={24}>
            <FlexRow>
              <Col span={20}>
                <Form.Item>
                  {getFieldDecorator('choiceReview', {
                    rules: [
                      {
                        required: true,
                        message: '초이스리뷰를 입력해주세요.',
                      },
                    ],
                  })(<TextArea maxLength={500} autosize={{ minRows: 3, maxRows: 5 }} style={{ resize: 'none' }} />)}
                </Form.Item>
              </Col>
              <Col style={{ alignSelf: 'flex-end' }}>
                <span>{calcStringByte(getFieldValue('choiceReview'))}/500</span>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="*브랜드명" span={24}>
            <FlexRow>
              <Col>
                <Form.Item>
                  {getFieldDecorator('brandName', {
                    rules: [
                      {
                        required: true,
                        message: '브랜드명을 입력해주세요.',
                      },
                    ],
                  })(<Input readOnly />)}
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" shape="circle" icon="search" onClick={() => setVisible(true)} />
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="*공구 가능 기간" span={24}>
            <FlexRow>
              <Col>
                <span>시작일</span>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesStarted', {
                    rules: [
                      {
                        required: true,
                        message: '시작일을 입력해주세요.',
                      },
                    ],
                  })(<DatePicker placeholder="시작일" />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesStarted', {
                    rules: [
                      {
                        required: true,
                        message: '시작일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="시작시간"
                      defaultOpenValue={moment('00:00 AM', format)}
                      format={format}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col>
                <span> ~ 종료일</span>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesEnded', {
                    rules: [
                      {
                        required: true,
                        message: '종료일을 입력해주세요.',
                      },
                    ],
                  })(<DatePicker placeholder="종료일" />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesEnded', {
                    rules: [
                      {
                        required: true,
                        message: '종료일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="종료시간"
                      defaultOpenValue={moment('00:00 AM', format)}
                      format={format}
                    />,
                  )}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="목표 구매액" span={24}>
            <FlexRow>
              <Col span={4}>
                <Form.Item>
                  {getFieldDecorator('targetAmount')(
                    <InputNumber
                      min={0}
                      step={10000}
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
                <Text type="danger">※ 주의: 미 입력 시 1원으로 자동 기입됩니다.</Text>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="*썸네일" span={24}>
            <Form.Item>{getFieldDecorator('videoUrl')(<Input />)}</Form.Item>
          </Descriptions.Item>
        </Descriptions>
      </Form>
      <SelectOptionModal
        placeholder="브랜드 선택"
        visible={visible}
        options={[{ key: 'test', label: 'test' }]}
        onSelect={handleSelectBrandName}
      />
    </>
  );
}

export default Form.create()(CreateEventForm);
