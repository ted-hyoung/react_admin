// base
import React, { useState, useEffect, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearEventByUrl,
  clearEvents,
  getEventByUrlAsync,
} from 'store/reducer/event';
import { ResponseBrandForEvent, CreateBanner } from 'models';

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
  message,
  Select,
  Radio
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import YouTube from 'react-youtube';

// components
import { FlexRow, ImageUpload } from 'components';

// libs
import { getBytes } from 'lib/utils';

import './index.less';

import { BannerType } from '../../enums/Banner';

import { BannerEventList } from '../OrderSearchBar';
import BannerEventSearchModal from '../BannerEventSearchModal';
import { StoreState } from '../../store';
import { createBannerAsync } from '../../store/action/banner.action';

// defines
const { TextArea } = Input;
const { Paragraph } = Typography;
const TIME_FORMAT = 'HH:mm A';

interface Props extends FormComponentProps {
  brands: ResponseBrandForEvent[];
}

export const startDateFormat = 'YYYY-MM-DDT00:00:00';
export const endDateFormat = 'YYYY-MM-DDT23:59:59';

function BannerForm(props: Props) {
  const dispatch = useDispatch();
  const {  brands, form } = props;
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    validateFieldsAndScroll,
  } = form;
  const { eventByUrl } = useSelector((state: StoreState) => state.event);
  const [selectedBannerType, setSelectedBannerType] = useState<BannerType>(BannerType[BannerType.EVENT]);
  const [selectedBrand, setSelectedBrand] = useState<ResponseBrandForEvent>({ brandId: 0, brandName: ''});
  const [isUrlLink, setUrlLink] = useState<boolean>(true);
  const [bannerEventSearchModal, setBannerEventSearchModal] = useState<boolean>(false);
  const [isPeriodEnable, setPeriodEnable] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [eventsData, setEventsData] = useState<BannerEventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<BannerEventList[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((err, val) => {
      if (!err) {
        val.exposeStarted = moment(val.salesStarted).format('YYYY-MM-DDT00:00:00');
        val.exposeEnded = moment(val.salesEnded).format('YYYY-MM-DDT23:59:59');
        const {
          salesStarted,
          salesEnded,
          bannerType,
          periodEnable,
          title,
          eventUrl,
          videoUrl,
          images,
        } = val;

        if(isUrlLink){
          val.eventUrl =  eventByUrl.eventUrl;
        }else{
          val.eventUrl =  selectedEvents[0].eventUrl;
        }

        if(!title){
          message.error('입력되지 않는 정보가 있어 배너 등록이 불가합니다. 배너명을 확인 부탁드립니다.');
          return false;
        }

        if(!val.eventUrl){
          message.error('입력되지 않는 정보가 있어 배너 등록이 불가합니다. 링크 확인 부탁드립니다.');
         return false;
        }

        if(bannerType !== 'EVENT'){
          if(images === undefined){
            message.error('입력되지 않는 정보가 있어 배너 등록이 불가합니다. 배너이미지 확인 부탁드립니다.');
            return false;
          }
        }

        const data: CreateBanner = {
          exposeStarted: periodEnable ? moment(salesStarted).format('YYYY-MM-DDTHH:mm'):'',
          exposeEnded: periodEnable ? moment(salesEnded).format('YYYY-MM-DDTHH:mm'): '',
          bannerType,
          periodEnable,
          title,
          url: val.eventUrl,
          videoUrl: bannerType === 'EVENT' ? null : videoUrl,
          image: bannerType === 'EVENT' ? null : images[0],
          eventId:eventByUrl.eventId,
        };

        if(!periodEnable){
          delete data.exposeEnded;
          delete data.exposeStarted;
        }

        dispatch(createBannerAsync.request(data));
      }else{
        console.log(err);
        resetFields();
      }
    });

  };

  const handleUpdateVideoUrl = () => {
    const videoUrl = getFieldValue('videoUrl');
    setVideoUrl(videoUrl);
  };

  const handleRemoveVideoUrl = () => {
    setVideoUrl('');
  };

  const handleRadioUrlLinkChange = (e:any) => {
    setUrlLink(e.target.value);
    setSelectedEvents([]);
    dispatch(clearEventByUrl());
    if(e.target.value === false){
      setBannerEventSearchModal(true);
      setEventsData([]);
      dispatch(clearEvents());
    }
  };

  const handlePeriodEnable = (e:any) => {
    setPeriodEnable(e.target.value);
  };

  const handleBannerType = (value:BannerType) => {
    setSelectedBannerType(BannerType[BannerType[value]]);
  };

  const getEventUrlLink = useCallback(
    (eventUrl: string) => {
      if (eventUrl) {
        dispatch(getEventByUrlAsync.request({ eventUrl }));
      }
    },
    [],
  );

  const checkUrlLink = () => {
    const eventUrl = getFieldValue('eventUrl');
    if(typeof eventUrl === 'undefined'){
      message.error('연결하실 링크 정보를 입력바랍니다.');
    }

    getEventUrlLink(eventUrl);
  };

  const handleReset = () => {
    resetFields();
    setSelectedEvents([]);
    dispatch(clearEventByUrl());
  };

  const handleBannerEventSearchModal = (visable: boolean) => {
    setBannerEventSearchModal(visable);
    setEventsData([]);
    dispatch(clearEvents());
  };

  const handleExposeBannerForm = (value:boolean) => {

    if(selectedBannerType === BannerType[BannerType.EVENT]) {
      return (
        <Descriptions.Item label="링크연결" span={24}>
          <FlexRow>
            <Form.Item>
              {getFieldDecorator('isLink', {
                initialValue: isUrlLink,
                rules: [
                  {
                    required: false,
                    message: '연결할 링크를 선택해주시기 바랍니다.',
                  },
                ],
              })(
                <Radio.Group onChange={handleRadioUrlLinkChange}>
                  <Radio value={true}>링크로 연결하기</Radio>
                  <Radio value={false}>공구 선택하여 연결하기</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </FlexRow>
          {value ? (
            <FlexRow>
              <Col span={5} style={{ textAlign: 'right' }}>
                <span>
                  https://from-c.co.kr
                </span>
              </Col>
              <Col span={14}>
                <Form.Item>
                  {getFieldDecorator('eventUrl', {
                    rules: [
                      {
                        required: false,
                        message: '연결될 링크를 입력해주세요.',
                      },
                    ],
                  })(
                    <Input
                      spellCheck={false} placeholder='/seller/xxxxx/events/0'
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button type='primary' onClick={() => checkUrlLink()}>확인</Button>
              </Col>
              {eventByUrl.eventUrl && (
                <div>
                  <p>
                    셀럽1 : {eventByUrl.creator.username}
                  </p>
                  <p>
                    브랜드 : {eventByUrl.brand.brandName}
                  </p>
                  <p>
                    공구명 : {eventByUrl.name}
                  </p>
                  <p>
                    공구기간
                    : {moment(eventByUrl.salesStarted).format(startDateFormat)} ~ {moment(eventByUrl.salesEnded).format(endDateFormat)}
                  </p>
                  <p>
                    링크: http://fromc-c.co.kr{eventByUrl.eventUrl}
                  </p>
                </div>
              )}
            </FlexRow>
          ) : (
            selectedEvents.length > 0 && (
              <div>
                <p>
                  셀럽2 : {selectedEvents[0].username}
                </p>
                <p>
                  브랜드 : {selectedEvents[0].brandName}
                </p>
                <p>
                  공구명 : {selectedEvents[0].name}
                </p>
                <p>
                  공구기간 : {selectedEvents[0].sales}
                </p>
                <p>
                  링크: http://fromc-c.co.kr{selectedEvents[0].eventUrl}
                </p>
              </div>
            )
          )
          }
        </Descriptions.Item>
      )

    }else {
      return (
        <Descriptions.Item label="링크연결" span={24}>
          <FlexRow>
            <Col span={5} style={{textAlign: 'right'}}>
                <span>
                  https://from-c.co.kr/
                </span>
            </Col>
            <Col span={14}>
              <Form.Item>
                {getFieldDecorator('eventUrl', {
                  rules: [
                    {
                      required: false,
                      message: '연결될 링크를 입력해주세요.',
                    },
                  ],
                })(
                  <Input
                    spellCheck={false} placeholder='/seller/xxxxx/events/0'
                  />,
                )}
              </Form.Item>
            </Col>
            <Col>
              <Button type='primary' onClick={() => checkUrlLink()}>확인</Button>
            </Col>
            {eventByUrl.eventUrl && (
              <div>
                <p>
                  셀럽3 : {eventByUrl.creator.username}
                </p>
                <p>
                  브랜드 : {eventByUrl.brand.brandName}
                </p>
                <p>
                  공구명 : {eventByUrl.name}
                </p>
                <p>
                  공구기간
                  : {moment(eventByUrl.salesStarted).format(startDateFormat)} ~ {moment(eventByUrl.salesEnded).format(endDateFormat)}
                </p>
                <p>
                  링크: http://fromc-c.co.kr{eventByUrl.eventUrl}
                </p>
              </div>
            )}
          </FlexRow>
        </Descriptions.Item>
      )
    }
  };

  return (
    <>
      <Form className="event-form" onSubmit={handleSubmit}>
        <Descriptions bordered title="배너 신규 등록" column={24}>
          <Descriptions.Item label="분류" span={24}>
            <FlexRow>
              <Col span={18}>
                <Form.Item>
                  {getFieldDecorator('bannerType', {
                    initialValue: selectedBannerType,
                  })(
                    <Select style={{ width: 120 }} onChange={handleBannerType}>
                      <Select.Option value="EVENT_PROGRESS">이벤트</Select.Option>
                      <Select.Option value="NOTICE">공지</Select.Option>
                      <Select.Option value="EVENT">공구</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="배너명" span={24}>
            <FlexRow>
              <Col span={18}>
                <Form.Item>
                  {getFieldDecorator('title')(
                    <TextArea
                      spellCheck={false}
                      maxLength={30}
                      autosize={{ minRows: 1, maxRows: 1 }}
                      style={{ resize: 'none' }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col style={{ alignSelf: 'flex-end' }}>
                <span>{getBytes(getFieldValue('title'))}/30</span>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label="노출기간" span={24}>
            <Form.Item>
              {getFieldDecorator('periodEnable', {
                initialValue: isPeriodEnable,
                rules: [
                  {
                    required: false,
                    message: '마케팅 동의여부를 선택해주세요',
                  },
                ],
              })(
                <Radio.Group onChange={handlePeriodEnable}>
                  <Radio value={true}>기간 사용함</Radio>
                  <Radio value={false}>기간 사용 안함</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <FlexRow>
              <Col>
                <span>시작일</span>
              </Col>
              <Col>
                <Form.Item>{getFieldDecorator('salesStarted')(<DatePicker placeholder="시작일" disabled={!isPeriodEnable}/>)}</Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesStarted', {
                    rules: [
                      {
                        required: false,
                        message: '시작일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="시작시간"
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
                      disabled={!isPeriodEnable}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col>
                <span> ~ 종료일</span>
              </Col>
              <Col>
                <Form.Item>{getFieldDecorator('salesEnded')(<DatePicker placeholder="종료일" disabled={!isPeriodEnable}/>)}</Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesEnded', {
                    rules: [
                      {
                        required: false,
                        message: '종료일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="종료시간"
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
                      disabled={!isPeriodEnable}
                    />,
                  )}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          { handleExposeBannerForm(isUrlLink)}
          {selectedBannerType !== BannerType[BannerType.EVENT] &&
            <Descriptions.Item label="배너이미지" span={24}>
              <FlexRow>
                <Col span={24}>
                  <span>*이미지</span>
                  <Row type="flex">
                    <Col span={24}>
                      <Form.Item>
                        {getFieldDecorator(`images`, {

                        })(<ImageUpload disabled={false} options={{fileListLimit: 1}}/>)}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Paragraph>
                        <strong># 배너 이미지 업로드 시 주의 사항</strong>
                        <br />
                        1. 이미지 최소 1개 업로드
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
          }
          {selectedBannerType !== BannerType[BannerType.EVENT] &&
            <Descriptions.Item label="동영상(유튜브)" span={24}>
              <FlexRow>
                <Col span={24}>
                  <span>동영상(유튜브)</span>
                  <Row type="flex" justify="start" align="middle" gutter={10}>
                    <Col span={18}>
                      <Form.Item>
                        {getFieldDecorator('videoUrl', {
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
              </FlexRow>
            </Descriptions.Item>
          }
          </Descriptions>
        <Row type="flex" justify="center" gutter={15} style={{ marginTop: 30 }}>
          <Col>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </Col>
          <Col>
            <Button onClick={() => handleReset()}>취소</Button>
          </Col>
        </Row>
      </Form>
      <BannerEventSearchModal
        eventSearchModal={bannerEventSearchModal}
        handleEventSearchModal={handleBannerEventSearchModal}
        eventsData={eventsData}
        setEventsData={setEventsData}
        setSelectedEvents={setSelectedEvents}
        brands={brands}
        setSelectedBrand={setSelectedBrand}
      />
      {/* <Prompt when={isFieldsTouched()} message={'현재 작성중인 내용이 있습니다. 뒤로 가시겠습니까?'} /> */}
    </>
  );
}

export default Form.create<Props>()(BannerForm);
