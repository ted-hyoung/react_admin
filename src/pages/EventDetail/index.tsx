// base
import React, { useCallback, useEffect, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { getEventByIdAsync, updateEventStatusAsync, deleteEventAsync, clearEvent } from 'store/reducer/event';

// modules
import { Tabs, Button, message, Row, Col, Popconfirm } from 'antd';

// store
import { getBrandsAsync } from 'store/reducer/brand';

// enums
import { EventStatus } from 'enums';

// components
import {
  ProductDetail,
  EventForm,
  EventNotice,
  CelebReviewDetail,
  ProductNotice,
  PurchaseInformation,
  EventExpGroup,
} from 'components';

import './index.less';

interface Params {
  id: string;
}

function EventDetail(props: RouteComponentProps<Params>) {
  const { match } = props;

  const eventId = Number(match.params.id);

  const { event } = useSelector((state: StoreState) => state.event);
  const { brand } = useSelector((state: StoreState) => state.brand);
  const dispatch = useDispatch();

  const getEvent = useCallback(
    (eventId: number) => {
      if (eventId) {
        dispatch(getEventByIdAsync.request({ id: eventId }));
      }
    },
    [eventId],
  );

  const getBrands = useCallback(() => {
    dispatch(getBrandsAsync.request({}));
  }, [dispatch]);

  const handleOpenEvent = () => {
    if (event.eventStatus === EventStatus[EventStatus.IN_PROGRESS]) {
      message.info('해당 공구는 현재 오픈중입니다.');

      return false;
    }

    const data = {
      eventStatus: EventStatus[EventStatus.IN_PROGRESS],
    };

    dispatch(updateEventStatusAsync.request({ id: eventId, data }));
  };

  const handleOpenTemplate = () => {
    window.open(`${process.env.REACT_APP_CLIENT_URL}/${event.creator.loginId}/events/${eventId}`);
  };

  const handleDeleteEvent = () => {
    dispatch(deleteEventAsync.request({ eventId: event.eventId }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearEvent());
    };
  }, []);

  useEffect(() => {
    getEvent(eventId);
    getBrands();
  }, [getBrands]);

  const isCreatedEvent = !event.eventId;

  return (
    <div className="event-detail">
      <Tabs defaultActiveKey="EVENT">
        <Tabs.TabPane tab="공구 정보" key="EVENT">
          <EventForm event={event} brands={brand} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="제품 정보" key="PRODUCT" disabled={isCreatedEvent}>
          <ProductDetail event={event} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="상품 정보" key="PRODUCT_NOTICE" disabled={isCreatedEvent}>
          <ProductNotice event={event} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="구매 안내" key="PURCHASE_INFORMATION" disabled={isCreatedEvent}>
          <PurchaseInformation event={event} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="셀럽 리뷰" key="CELUB" disabled={isCreatedEvent}>
          <CelebReviewDetail />
        </Tabs.TabPane>
        <Tabs.TabPane tab="긴급 공지" key="NOTICE" disabled={isCreatedEvent}>
          <EventNotice eventNotices={event.eventNotices} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="후기 불러오기" key="EXP_GROUP" disabled={isCreatedEvent}>
          <EventExpGroup />
        </Tabs.TabPane>
      </Tabs>

      <Row type="flex" align="middle" gutter={10} style={{ position: 'absolute', top: 6, right: 0 }}>
        {event.eventId !== 0 && event.eventStatus === EventStatus[EventStatus.READY] && (
          <Col>
            <Popconfirm
              title="해당 공구를 삭제하시겠습니까?"
              onConfirm={handleDeleteEvent}
              okText="확인"
              cancelText="닫기"
            >
              <Button type="danger">공구 삭제</Button>
            </Popconfirm>
          </Col>
        )}
        {event.eventId !== 0 && (
          <Col>
            <Button className="btn-event-template" type="primary" onClick={handleOpenTemplate}>
              미리보기
            </Button>
          </Col>
        )}
        {event.celebReview.contents && event.products.length > 0 && (
          <Col>
            <Button type="primary" onClick={handleOpenEvent}>
              오픈
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default withRouter(EventDetail);
