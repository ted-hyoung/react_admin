// base
import React, { useEffect, useState, useCallback } from 'react';

// modules
import { Table } from 'antd';
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';

// components
import { PaginationTable } from 'components';

// types
import { EventStatus } from 'enums';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store';
import { getEventsAsync } from 'store/reducer/event';
import { SearchEvent } from 'types';

interface EventList {
  key: number;
  period: string;
  name: string;
  turn: number;
  brand: string;
  created: string;
  eventStatus: string;
}

const colums: ColumnProps<EventList>[] = [
  {
    title: 'NO',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '공구기간',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: '공구명',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '회차',
    dataIndex: 'turn',
    key: 'turn',
  },
  {
    title: '브랜드',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '등록일',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: '상태',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
  },
  {
    title: '복사',
    dataIndex: 'copy',
    key: 'copy',
  },
];

function EventList() {
  const [page, setPage] = useState(0);
  const [searchCondition, setSearchCondition] = useState({});

  const { events } = useSelector((state: StoreState) => state.event);
  const dispatch = useDispatch();

  const { size: pageSize } = events;

  const data: EventList[] = events.content.map((event, i) => {
    return {
      key: i + 1,
      period: `${moment(event.salesStarted).format('YYYY-MM-DD')} ~ ${moment(event.salesEnded).format('YYYY-MM-DD')}`,
      name: event.name,
      turn: event.turn,
      brand: event.brandName,
      created: moment(event.created).format('YYYY-MM-DD'),
      eventStatus: EventStatus[event.eventStatus],
    };
  });

  const getEvents = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchEvent) => {
      dispatch(
        getEventsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
    },

    [dispatch, pageSize],
  );

  useEffect(() => {
    getEvents(page);
  }, []);

  const handleChangePageSize = useCallback(
    (value: number) => {
      getEvents(0, value);
    },

    [getEvents],
  );

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getEvents(currentPage - 1);
    },

    [getEvents],
  );

  return (
    <div className="event-list">
      <PaginationTable
        columns={colums}
        dataSource={data}
        onChangePageSize={handleChangePageSize}
        pagination={{
          total: events.totalElements,
          pageSize: events.size,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
}

export default EventList;
