// base
import React, { useCallback, useEffect, useMemo } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { getEventByIdAsync, clearEvent, updateEventStatusAsync } from 'store/reducer/event';

// modules
import { Tabs, Button, message } from 'antd';

// components
import { ProductDetail, EventForm, EventNotice, CelebReviewDetail } from 'components';

import './index.less';
import { EventStatus } from 'enums';

function EventDetail(props: RouteComponentProps) {
  const { location } = props;
  const eventId = useMemo(() => Number(location.pathname.split('/')[3]), [location.pathname]);

  const { event } = useSelector((state: StoreState) => state.event);
  const dispatch = useDispatch();

  const getEvent = useCallback(
    (eventId: number) => {
      if (eventId) {
        dispatch(getEventByIdAsync.request({ id: eventId }));
      }
    },
    [eventId],
  );

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

  useEffect(() => {
    getEvent(eventId);
  }, [eventId, location.key]);

  useEffect(() => {
    return () => {
      dispatch(clearEvent);
    };
  }, []);

  const handleOpenPreview = () => {
    window.open(`/events/${event.eventId}/template`);
  };

  return (
    <div className="event-detail">
      <Tabs defaultActiveKey="EVENT">
        <Tabs.TabPane tab="공구 정보" key="EVENT">
          <EventForm event={event} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="제품 정보" key="PRODUCT" disabled={!event.eventId}>
          <ProductDetail
            eventId={event.eventId}
            responseProducts={event.products}
            responseShippingFeeInfo={event.shippingFeeInfo}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="셀럽 리뷰" key="CELUB" disabled={!event.eventId}>
          <CelebReviewDetail />
        </Tabs.TabPane>
        <Tabs.TabPane tab="긴급 공지" key="NOTICE" disabled={!event.eventId}>
          <EventNotice eventNotices={event.eventNotices} />
        </Tabs.TabPane>
      </Tabs>
      <Button className="btn-event-preview" type="primary" onClick={handleOpenPreview}>
        미리보기
      </Button>
      {event.celebReview.contents && event.products && (
        <Button className="btn-event-open" type="primary" onClick={handleOpenEvent}>
          오픈
        </Button>
      )}
    </div>
  );
}

export default withRouter(EventDetail);
