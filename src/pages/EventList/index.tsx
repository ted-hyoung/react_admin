// base
import React, { useEffect, useCallback, useMemo } from 'react';
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
import { getEventsAsync, clearEvent } from 'store/reducer/event';
import { SearchEvent } from 'models';
import { Button } from 'antd';
import { sortedString } from 'lib/utils';

interface EventList {
  key: number;
  id: number;
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
    sorter: (a, b) => a.key - b.key,
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
    sorter: (a, b) => sortedString(a.name, b.name),
  },
  {
    title: '공구 링크',
    dataIndex: 'eventLink',
    key: 'eventLink',
  },
  {
    title: '회차',
    dataIndex: 'turn',
    key: 'turn',
    sorter: (a, b) => a.turn - b.turn,
  },
  {
    title: '브랜드',
    dataIndex: 'brand',
    key: 'brand',
    sorter: (a, b) => sortedString(a.brand, b.brand),
  },
  {
    title: '등록일',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => moment(a.created).unix() - moment(b.created).unix(),
  },
  {
    title: '상태',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    filters: [
      {
        text: EventStatus.READY,
        value: EventStatus.READY,
      },
      {
        text: EventStatus.IN_PROGRESS,
        value: EventStatus.IN_PROGRESS,
      },
      {
        text: EventStatus.COMPLETE,
        value: EventStatus.COMPLETE,
      },
    ],
    onFilter: (value, record) => record.eventStatus.indexOf(value) === 0,
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

  const getEvents = useCallback(
    (page: number, size = 10, searchCondition?: SearchEvent) => {
      dispatch(
        getEventsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getEvents(0, events.size);
  }, [getEvents]);

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

  const pagination = useMemo(() => {
    return {
      total: events.totalElements,
      pageSize: events.size,
      onChange: handlePaginationChange,
    };
  }, [events]);

  const handleRowEvent = (recode: EventList) => {
    return {
      onClick: () => history.push('/events/detail/' + recode.id),
    };
  };

  const data: EventList[] = events.content.map((event, i) => {
    return {
      key: i + 1,
      id: event.eventId,
      period: `${moment(event.salesStarted).format('YYYY-MM-DD')} ~ ${moment(event.salesEnded).format('YYYY-MM-DD')}`,
      name: event.name,
      eventLink: process.env.REACT_APP_CLIENT_URL + '/events/influence/' + event.creator.loginId + '/' + event.eventId,
      turn: event.turn,
      brand: event.brand.brandName,
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
        pagination={pagination}
        onRow={handleRowEvent}
      />
      <Link to="/events/detail" style={{ position: 'absolute', right: 50, marginTop: 15 }}>
        <Button type="primary" icon="setting" size="large" onClick={() => dispatch(clearEvent())}>
          신규 등록
        </Button>
      </Link>
    </div>
  );
}

export default withRouter(EventList);
