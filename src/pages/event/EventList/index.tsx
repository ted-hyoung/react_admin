// base
import React, { useEffect, useCallback } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// modules
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';

// components
import { PaginationTable } from 'components';

// types
import { EventStatus } from 'enums';
import { StoreState } from 'store';
import { getEventsAsync } from 'store/reducer/event';
import { SearchEvent } from 'types';
import { Button } from 'antd';

interface EventList {
  key: number;
  period: string;
  name: string;
  turn: number;
  brand: string;
  created: string;
  eventStatus: EventStatus;
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
  // {
  //   title: '복사',
  //   dataIndex: 'copy',
  //   key: 'copy',
  // },
];

function EventList(props: RouteComponentProps) {
  const { history } = props;

  const { events } = useSelector((state: StoreState) => state.event);
  const dispatch = useDispatch();

  const { size: pageSize = 10 } = events;

  const getEvents = (page: number, size = pageSize, searchCondition?: SearchEvent) => {
    dispatch(
      getEventsAsync.request({
        page,
        size,
        searchCondition,
      }),
    );
  };

  useEffect(() => {
    getEvents(0);
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

  const handleRowEvent = (recode: EventList) => {
    return {
      onClick: () => history.push('/events/detail/' + recode.key),
    };
  };

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

  return (
    <div className="event-list">
      <PaginationTable
        bordered
        columns={colums}
        dataSource={data}
        onChangePageSize={handleChangePageSize}
        pagination={{
          total: events.totalElements,
          pageSize: events.size,
          onChange: handlePaginationChange,
        }}
        onRow={handleRowEvent}
      />
      <Link to="/events/detail" style={{ position: 'absolute', right: 50, marginTop: 15 }}>
        <Button type="primary" icon="setting" size="large">
          신규 등록
        </Button>
      </Link>
    </div>
  );
}

export default withRouter(EventList);
