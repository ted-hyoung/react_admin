// base
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// module
import { Tabs } from 'antd';

// store
import { StoreState } from 'store';
import { getEventAsync } from 'store/reducer/product';

// components
import { ProductDetail }  from 'components';

// define
const TabPane = Tabs.TabPane;

function EventTab() {

  const { products, shippingFeeInfo } = useSelector((state: StoreState) => state.product);
  const dispatch = useDispatch();
  const eventStatus = true;

  // todo : 추후 공구 정보랑 취합 필요
  const eventId:any = 1;

  const getEvent = useCallback(() => {
    dispatch(
      getEventAsync.request(eventId),
    );
  }, [dispatch]);

  useEffect(() => {
    getEvent()
  }, [getEvent]);

  return (
    <Tabs defaultActiveKey="product">
      <TabPane tab="공구 정보" disabled={eventStatus} key="event">
        이 부분에다가 공구 정보 컴포넌트 넣기
      </TabPane>
      <TabPane tab="제품 정보" key="product">
        <ProductDetail
          responseProducts={products}
          responseShippingFeeInfo={shippingFeeInfo}
        />
      </TabPane>
      <TabPane tab="셀럽 리뷰" disabled={eventStatus} key="celeb">
        셀럽 리뷰
      </TabPane>
      <TabPane tab="긴급 공지" disabled={eventStatus} key="notice">
        긴급 공지
      </TabPane>
    </Tabs>
  )
}

export default EventTab;