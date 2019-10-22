// base
import React, { useEffect } from 'react';

// modules
import moment from 'moment';
import { Form, Descriptions, Input, Col, Row, DatePicker, TimePicker, Typography, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

// components
import { ImageUpload, FlexRow, TextEditor } from 'components/common';

// models
import { CreateExperienceGroup, ResponseExperienceGroup } from 'models';

// lib
import { getBytes } from 'lib/utils';
import { LOCAL_DATE_TIME_FORMAT, TIME_FORMAT } from 'lib/constants';

// defines
const { Paragraph } = Typography;

interface ExpGroupFormProps extends FormComponentProps {
  initailValues?: ResponseExperienceGroup;
  onSubmit?: (values: CreateExperienceGroup) => void;
}

function ExpGroupForm(props: ExpGroupFormProps) {
  const { form, initailValues, onSubmit } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (errors, values) => {
      if (!errors) {
        const data = {
          ...values,
          recruitmentStarted: initailValues
            ? initailValues.recruitmentStarted
            : moment().format(LOCAL_DATE_TIME_FORMAT),
          recruitmentEnded: moment(values.recruitmentEnded).format(LOCAL_DATE_TIME_FORMAT),
          prizeDate: moment(values.prizeDate).format(LOCAL_DATE_TIME_FORMAT),
          shippingStarted: moment(values.shippingStarted).format(LOCAL_DATE_TIME_FORMAT),
          reviewDeadline: moment(values.reviewDeadline).format(LOCAL_DATE_TIME_FORMAT),
        };

        if (onSubmit) {
          onSubmit(data);
        }
      } else {
        Object.keys(errors).forEach(key => message.error(errors[key].errors[0].message));
      }
    });
  };

  useEffect(() => {
    if (initailValues) {
      setFieldsValue({
        recruitmentEnded: moment(initailValues.recruitmentEnded),
        prizeDate: moment(initailValues.prizeDate),
        shippingStarted: moment(initailValues.shippingStarted),
        reviewDeadline: moment(initailValues.reviewDeadline),
      });
    }
  }, [initailValues]);

  return (
    <Form onSubmit={handleSubmit}>
      <Descriptions bordered column={24}>
        <Descriptions.Item label="* 체험단 후기명" span={24}>
          <Row type="flex" align="middle" gutter={10}>
            <Col>
              <strong>[체험단]</strong>
            </Col>
            <Col span={8}>
              {getFieldDecorator('experienceGroupName', {
                initialValue: initailValues ? initailValues.experienceGroupName : undefined,
                rules: [
                  {
                    required: true,
                    message: '체험단 후기명을 입력해주세요.',
                  },
                ],
              })(<Input maxLength={15} placeholder="텍스트를 입력해주세요." />)}
            </Col>
            <Col>{getBytes(getFieldValue('experienceGroupName'))}/15</Col>
          </Row>
        </Descriptions.Item>
        <Descriptions.Item label="* 썸네일" span={24}>
          <Row type="flex">
            <Col>
              {getFieldDecorator(`images`, {
                initialValue: initailValues ? initailValues.images : undefined,
                rules: [
                  {
                    required: true,
                    message: '썸네일을 업로드 해주세요.',
                  },
                ],
              })(<ImageUpload options={{ fileListLimit: 1, accept: 'image/png, image/jpeg' }} disabled={false} />)}
            </Col>
            <Col style={{ marginLeft: 20 }}>
              <Paragraph>
                <strong># 썸네일 이미지 업로드 시 주의 사항</strong>
                <br />
                1. 이미지 1개만 등록 가능
                <br />
                2. 이미지는 JPG, PNG 확장자만 가능
                <br />
                3. 권장 이미지 사이즈 - 가로 540px / 세로540px
                <br />
                4. 이미지 파일 용량 제한: 한 파일 당 5MB 이하
                <br />
              </Paragraph>
            </Col>
          </Row>
        </Descriptions.Item>
        <Descriptions.Item label="* 체험단 후기 상세" span={24}>
          <FlexRow type="flex" align="middle">
            <Col span={4}>
              <span>제목</span>
            </Col>
            <Col span={8}>
              {getFieldDecorator('title', {
                initialValue: initailValues ? initailValues.title : undefined,
                rules: [
                  {
                    required: true,
                    message: '제목을 입력해주세요.',
                  },
                ],
              })(<Input placeholder="텍스트를 입력해주세요." />)}
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>모집 인원</span>
            </Col>
            <Col span={8}>
              {getFieldDecorator('recruitmentPersonnelCount', {
                initialValue: initailValues ? initailValues.recruitmentPersonnelCount : undefined,
                rules: [
                  {
                    required: true,
                    message: '모집 인원을 입력해주세요.',
                  },
                ],
              })(<Input placeholder="숫자 입력" />)}
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>모집 기간</span>
            </Col>
            <Col>{getFieldDecorator('recruitmentEnded')(<DatePicker placeholder="종료일" />)}</Col>
            <Col>
              {getFieldDecorator('recruitmentEnded', {
                rules: [
                  {
                    required: true,
                    message: '모집 기간 종료일을 입력해주세요.',
                  },
                  {
                    message: '모집 기간 종료일은 현재 시간 이후여야 합니다.',
                    validator: (rule, value, callback) => {
                      if (value && moment(value).isBefore(moment())) {
                        callback(rule.message);
                      }

                      callback();
                    },
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
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>제공 혜택</span>
            </Col>
            <Col span={8}>
              {getFieldDecorator('benefit', {
                initialValue: initailValues ? initailValues.benefit : undefined,
                rules: [
                  {
                    required: true,
                    message: '제공 혜택을 입력해주세요.',
                  },
                ],
              })(<Input placeholder="텍스트를 입력해주세요." />)}
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>당첨 결과일</span>
            </Col>
            <Col>{getFieldDecorator('prizeDate')(<DatePicker placeholder="종료일" />)}</Col>
            <Col>
              {getFieldDecorator('prizeDate', {
                rules: [
                  {
                    required: true,
                    message: '당첨 결과일을 입력해주세요.',
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
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>배송 시작일</span>
            </Col>
            <Col>{getFieldDecorator('shippingStarted')(<DatePicker placeholder="종료일" />)}</Col>
            <Col>
              {getFieldDecorator('shippingStarted', {
                rules: [
                  {
                    required: true,
                    message: '배송 시작일을 입력해주세요.',
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
            </Col>
          </FlexRow>
          <FlexRow>
            <Col span={4}>
              <span>리뷰 마감일</span>
            </Col>
            <Col>{getFieldDecorator('reviewDeadline')(<DatePicker placeholder="종료일" />)}</Col>
            <Col>
              {getFieldDecorator('reviewDeadline', {
                rules: [
                  {
                    required: true,
                    message: '리뷰 마감일을 입력해주세요.',
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
            </Col>
          </FlexRow>
        </Descriptions.Item>
        <Descriptions.Item label="* 체험단 후기 제품 상세" span={24}>
          {getFieldDecorator('detail', {
            // initialValue: initailValues ? initailValues.detail : undefined,
          })(<TextEditor initialValue={initailValues ? initailValues.detail : undefined} name="exp-form-editor" />)}
        </Descriptions.Item>
        <Descriptions.Item label="* 체험단 후기 안내" span={24}>
          {getFieldDecorator('experienceGroupNoticeImages', {
            initialValue: initailValues ? initailValues.experienceGroupNoticeImages : undefined,
          })(<ImageUpload options={{ fileListLimit: 1, accept: 'image/png, image/jpeg' }} />)}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          {initailValues ? '수정' : '등록'}
        </Button>
      </div>
    </Form>
  );
}

export default Form.create<ExpGroupFormProps>()(ExpGroupForm);
