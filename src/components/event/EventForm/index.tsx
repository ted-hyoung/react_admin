// base
import React, { useState, useEffect } from 'react';

// modules
import moment from 'moment';
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
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { calcStringByte } from 'lib/utils';
import { SelectOptionModal, FlexRow } from 'components';

import './index.less';
import { useDispatch } from 'react-redux';
import { createEventAsync, updateEventByIdAsync } from 'store/reducer/event';
import { CreateEvent, ResponseEvent, UpdateEvent } from 'types';
import { LabeledValue } from 'antd/lib/select';

// defines
const { TextArea } = Input;
const { Text } = Typography;
const TIME_FORMAT = 'HH:mm A';

interface Props extends FormComponentProps {
  event: ResponseEvent;
}

function EventForm(props: Props) {
  const { event, form } = props;
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    isFieldsTouched,
    resetFields,
    validateFieldsAndScroll,
  } = form;

  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values: CreateEvent) => {
      if (!error) {
        const { name, brandName, choiceReview, salesStarted, salesEnded, targetAmount, videoUrl } = values;

        if (event.eventId) {
          const data: UpdateEvent = {
            name,
            brandName,
            choiceReview,
            salesStarted: moment(salesStarted).format('YYYY-MM-DDTHH:mm'),
            salesEnded: moment(salesEnded).format('YYYY-MM-DDTHH:mm'),
            targetAmount,
            videoUrl,
          };

          dispatch(updateEventByIdAsync.request({ id: event.eventId, data }));
        } else {
          const data: CreateEvent = {
            name,
            brandName,
            choiceReview,
            salesStarted: moment(salesStarted).format('YYYY-MM-DDTHH:mm'),
            salesEnded: moment(salesEnded).format('YYYY-MM-DDTHH:mm'),
            targetAmount,
            videoUrl,
          };

          dispatch(createEventAsync.request({ data }));
        }
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });

    resetFields();
  };

  const handleSelectBrandName = (value: LabeledValue) => {
    setFieldsValue({ brandName: value.label });
    setVisible(false);
  };

  useEffect(() => {
    if (event.eventId) {
      setFieldsValue({
        name: event.name,
        brandName: event.brandName,
        choiceReview: event.choiceReview,
        salesStarted: moment(event.salesStarted),
        salesEnded: moment(event.salesEnded),
        targetAmount: event.targetAmount,
        videoUrl: event.videoUrl,
      });
    }

    return () => {
      if (isFieldsTouched()) {
        window.alert('현재 작성중인 데이터가 있습니다.');
      }
    };
  }, [event.eventId]);

  return (
    <>
      <Form className="event-form" onSubmit={handleSubmit}>
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
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
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
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
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
        <Form.Item style={{ textAlign: 'right', marginTop: 10 }}>
          <Button type="primary" htmlType="submit">
            {event.eventId ? '수정' : '등록'}
          </Button>
        </Form.Item>
      </Form>
      <SelectOptionModal
        placeholder="브랜드 선택"
        visible={visible}
        options={[{ key: '비클', label: '비클' }]}
        onSelect={handleSelectBrandName}
      />
    </>
  );
}

export default Form.create<Props>()(EventForm);
