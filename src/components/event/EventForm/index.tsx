// base
import React, { useState, useEffect, useRef } from 'react';
import { Prompt } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEventAsync, updateEventByIdAsync } from 'store/reducer/event';
import { CreateEvent, ResponseEvent, UpdateEvent } from 'types';
import { FileObject } from 'types/FileObject';

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
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import YouTube from 'react-youtube';

// components
import { SelectOptionModal, FlexRow, TextEditor, ImageUpload } from 'components';

// libs
import { calcStringByte } from 'lib/utils';

import './index.less';
import { EventStatus } from 'enums';

// defines
const { TextArea } = Input;
const { Paragraph, Text } = Typography;
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
  const [videoUrl, setVideoUrl] = useState('');
  const [detail, setDetail] = useState('');
  const [fileObjectList, setFileObjectList] = useState<FileObject[]>([]);

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
            detail,
            images: fileObjectList,
          };

          dispatch(updateEventByIdAsync.request({ id: event.eventId, data }));
        } else {
          if (fileObjectList.length < 3) {
            message.error('이미지는 최소 3개 이상 등록해주세요.');

            return false;
          }

          const data: CreateEvent = {
            name,
            brandName,
            choiceReview,
            salesStarted: moment(salesStarted).format('YYYY-MM-DDTHH:mm'),
            salesEnded: moment(salesEnded).format('YYYY-MM-DDTHH:mm'),
            targetAmount,
            videoUrl,
            detail,
            images: fileObjectList,
          };

          dispatch(createEventAsync.request({ data }));
        }

        resetFields();
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  const handleSelectBrandName = (value: LabeledValue) => {
    setFieldsValue({ brandName: value.label });
    setVisible(false);
  };

  const handleUpdateVideoUrl = () => {
    const videoUrl = getFieldValue('videoUrl');

    setVideoUrl(videoUrl);
  };

  const handleRemoveVideoUrl = () => {
    setVideoUrl('');
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
      setVideoUrl(event.videoUrl);
      setFileObjectList(event.images);
    }
  }, [event]);

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
                  })(
                    <TextArea
                      spellCheck={false}
                      maxLength={100}
                      autosize={{ minRows: 3, maxRows: 3 }}
                      style={{ resize: 'none' }}
                    />,
                  )}
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
                  })(
                    <TextArea
                      spellCheck={false}
                      maxLength={500}
                      autosize={{ minRows: 3, maxRows: 5 }}
                      style={{ resize: 'none' }}
                    />,
                  )}
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
                <Form.Item>{getFieldDecorator('salesStarted')(<DatePicker placeholder="시작일" />)}</Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesStarted', {
                    rules: [
                      {
                        required: true,
                        message: '시작일을 입력해주세요.',
                      },
                      {
                        validator: (rule, value: Moment, callback) => {
                          if (value.isBefore(moment())) {
                            return callback('공구 시작일은 현재 시간보다 이후여야 합니다.');
                          }

                          if (value.isAfter(getFieldValue('salesEnded'))) {
                            return callback('공구 시작일은 종료일보다 이전이여야 합니다.');
                          }

                          return callback();
                        },
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
                <Form.Item>{getFieldDecorator('salesEnded')(<DatePicker placeholder="종료일" />)}</Form.Item>
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
              <Col span={6}>
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
            <FlexRow align="top">
              <Col span={12}>
                <span>동영상(유튜브)</span>
                <Row type="flex" justify="start" align="middle" gutter={10}>
                  <Col span={18}>
                    <Form.Item>
                      {getFieldDecorator('videoUrl', {
                        initialValue: event.videoUrl,
                      })(<Input placeholder="유튜브 동영상 ID" />)}
                    </Form.Item>
                  </Col>
                  <Col>
                    {videoUrl ? (
                      <Button onClick={handleRemoveVideoUrl}>영상삭제</Button>
                    ) : (
                      <Button onClick={handleUpdateVideoUrl}>영상등록</Button>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {videoUrl && (
                      <YouTube
                        videoId={videoUrl}
                        id={videoUrl}
                        opts={{
                          height: '300px',
                          width: '100%',
                          playerVars: {
                            autoplay: 0,
                            controls: 1,
                            showinfo: 0,
                            fs: 0,
                            modestbranding: 1,
                            listType: 'user_uploads',
                            origin: 'https://www.youtube.com',
                          },
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <span>*이미지</span>
                <Row type="flex">
                  <Col span={24}>
                    <Form.Item>
                      {getFieldDecorator(`images`)(
                        <ImageUpload
                          fileObjectList={fileObjectList}
                          setFileObjectList={setFileObjectList}
                          disabled={event.eventStatus !== EventStatus[EventStatus.READY]}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Paragraph>
                      <strong># 썸네일 이미지 업로드 시 주의 사항</strong>
                      <br />
                      1. 이미지 최소 3개 ~ 최대 5개 업로드
                      <br />
                      2. 이미지는 JPG, PNG, GIF, BMP 확장자만 가능
                      <br />
                      3. 권장 이미지 사이즈 - 가로 500px / 세로 400px
                      <br />
                      4. 이미지 파일 용량 제한: 한 파일 당 5MB 이하
                      <br />
                    </Paragraph>
                  </Col>
                </Row>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="제품 상세" span={24}>
            <TextEditor
              name="event-editor"
              onChange={value => setDetail(value)}
              defaultValue={event.detail || undefined}
              instagramTool={false}
            />
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
      <Prompt when={isFieldsTouched()} message={'현재 작성중인 내용이 있습니다. 뒤로 가시겠습니까?'} />
    </>
  );
}

export default Form.create<Props>()(EventForm);
