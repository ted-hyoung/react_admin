// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Icon, Row, Col, Descriptions } from 'antd';


// store


// components
import { EventSearch } from 'components';

// utils


// types
import { ResponseProduct, SearchProductForOrder } from 'types';

// less
import './index.less';
import Form, { FormComponentProps } from 'antd/lib/form';
import { clearEvents } from '../../../store/reducer/event';
import EventSearchModal from '../../event/EventSearch/EventSearchModal';
import moment from 'moment';
import { defaultDateTimeFormat } from '../../../lib/utils';

export interface EventList {
  key: number;
  sales: string;
  name: string;
  eventStatus: string;
  products: ResponseProduct[];
}

export interface SearchEventForOrder {
  name: string;
  product: SearchProductForOrder;
}

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

  const ProductSalesSearchBar = Form.create<Props>()((props: Props) => {
    const { form, onSearch, onReset } = props;
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields } = form;

    const dispatch = useDispatch();
    const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);
    const [eventsData, setEventsData] = useState<EventList[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);


    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        validateFields((errors, values) => {

          if (!errors) {
            Object.keys(values).forEach(key => {
              if (values[key] === undefined) {
                delete values[key];
                return;
              }
            });
            // console.log("events", values.events);
            // console.log("selectedEvents", eventsData);

             // onSearch({
             //   eventsData
             // });
            onSearch(values);
          }else{
            console.error(errors);
          }
        });
      },
      [ onSearch, eventsData ],
    );



    const handleReset = useCallback(() => {
      console.log("handleReset");
      resetFields();
      onReset();
    },
      [onReset]
    );

    const handleEventSearchModal = (visable: boolean) => {
      setEventSearchModal(visable);
      // setEventsData([]);
      // dispatch(clearEvents());
    };

    return (
      <>
        <Form className="product-search-bar" onSubmit={handleSubmit}>
          <Descriptions title="제품 매출 조회" bordered column={24}>
            <Descriptions.Item label="공구명" span={24}>
              <Row>
                <Col span={24} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <Button type="primary" onClick={() => handleEventSearchModal(true)} style={{ width: 150 }}>
                    공구 검색
                  </Button>
                  <Icon type="search" style={{ fontSize: 20, marginLeft: 10 }} />
                </Col>
                <Col span={24}>{getFieldDecorator('events')(<EventSearch selectedEvents={selectedEvents} />)}</Col>
              </Row>
            </Descriptions.Item>
          </Descriptions>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ marginRight: 5 }}>
              검색
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              초기화
            </Button>
          </Form.Item>
        </Form>
        <EventSearchModal
          eventSearchModal={eventSearchModal}
          handleEventSearchModal={handleEventSearchModal}
          eventsData={eventsData}
          setEventsData={setEventsData}
          setSelectedEvents={setSelectedEvents}
        />
      </>
    );
  });

export default ProductSalesSearchBar;
