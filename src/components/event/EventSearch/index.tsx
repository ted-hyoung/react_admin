// base
import React, { useState, useEffect } from 'react';

// modules
import { Row, Col, Select, Button } from 'antd';

// components
import { EventList } from 'components/order/OrderSearchBar';
import { SearchEventForOrder, ResponseOption } from 'models';

import './index.less';

// defines
const { Option } = Select;

interface EventSearchProps {
  selectedEvents?: EventList[];
  value?: SearchEventForOrder[];
  onChange?: (value: SearchEventForOrder[]) => undefined;
}

const EventSearch = React.forwardRef<HTMLDivElement, EventSearchProps>((props, ref) => {
  const { selectedEvents = [], onChange } = props;

  const [events, setEvents] = useState<EventList[]>(selectedEvents);
  const [searchEvents, setSearchEvents] = useState<SearchEventForOrder[]>([]);

  const handleChangeSearchEvent = (value: string, name: string, selctedIndex: number) => {
    const changedSearchEvents = searchEvents.map<SearchEventForOrder>((searchEvent, index) => {
      return {
        ...searchEvent,
        product: {
          productId: name === 'product' && selctedIndex === index ? Number(value) : searchEvent.product.productId,
          option: {
            optionId: name === 'option' && selctedIndex === index ? Number(value) : searchEvent.product.option.optionId,
          },
        },
      };
    });

    setSearchEvents(changedSearchEvents);
  };

  const handleRemoveSelectedEventItem = (selctedIndex: number) => {
    const removedEvents = events.filter((event, index) => index !== selctedIndex);

    setEvents(removedEvents);
  };

  useEffect(() => {
    if (onChange) {
      onChange(searchEvents);
    }
  }, [searchEvents]);

  useEffect(() => {
    const searchEvents = events.map(selectedEvent => {
      return {
        name: selectedEvent.name,
        product: {
          productId: 0,
          option: {
            optionId: 0,
          },
        },
      };
    });

    setSearchEvents(searchEvents);
  }, [events]);

  useEffect(() => {
    setEvents(selectedEvents);
  }, [selectedEvents]);

  return (
    <div className="event-search">
      {events.length > 0
        ? events.map((selectedEvent, index) => {
            const { key, name, products } = selectedEvent;

            const options = searchEvents.reduce((ac: ResponseOption[], searchEvent) => {
              const product = products.find(product => product.productId === searchEvent.product.productId);

              if (product) {
                ac = ac.concat(product.options);
              }

              return ac;
            }, []);

            return (
              <div key={key} className="selected-event-item">
                <Row type="flex" align="middle">
                  <Col span={1}>
                    <Button type="danger" icon="minus" onClick={() => handleRemoveSelectedEventItem(index)} />
                  </Col>
                  <Col span={4}>
                    <span className="selected-event-title">{name}</span>
                  </Col>
                  {products.length > 0 ? (
                    <>
                      <Col span={4}>
                        <Select
                          defaultValue="0"
                          onSelect={(value: string) => handleChangeSearchEvent(value, 'product', index)}
                        >
                          <Option value="0">전체</Option>
                          {products.map(product => (
                            <Option key={product.productId} value={product.productId}>
                              {product.productName}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      {options.length > 0 ? (
                        <Col span={4}>
                          <Select
                            defaultValue="0"
                            onSelect={(value: string) => handleChangeSearchEvent(value, 'option', index)}
                          >
                            <Option value="0">전체</Option>
                            {options.map(option => (
                              <Option key={option.optionId} value={option.optionId}>
                                {option.optionName}
                              </Option>
                            ))}
                          </Select>
                        </Col>
                      ) : null}
                    </>
                  ) : null}
                </Row>
              </div>
            );
          })
        : null}
    </div>
  );
});

export default EventSearch;
