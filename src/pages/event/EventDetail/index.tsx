// base
import React, { useCallback, useEffect, useMemo } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { getEventByIdAsync, clearEvent } from 'store/reducer/event';

// modules
import { Tabs } from 'antd';

// components
import { ProductDetail, EventForm } from 'components';

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

  useEffect(() => {
    getEvent(eventId);
  }, [eventId]);

  useEffect(() => {
    return () => {
      dispatch(clearEvent);
    };
  }, []);

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
          셀럽 리뷰
        </Tabs.TabPane>
        <Tabs.TabPane tab="긴급 공지" key="NOTICE" disabled={!event.eventId}>
          긴급 공지
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(EventDetail);
