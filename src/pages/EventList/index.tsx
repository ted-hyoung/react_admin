// base
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// modules
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';
import { useClipboard } from 'use-clipboard-copy';

// components
import { FlexRow, PaginationTable } from 'components';

// types
import { EventStatus } from 'enums';
import { StoreState } from 'store';
import { getEventsAsync, clearEvent, createCopyEventAsync } from 'store/reducer/event';
import { SearchEvent } from 'models';
import { Button, Col, DatePicker, Modal, TimePicker } from 'antd';
import { sortedString, setPagingIndex } from 'lib/utils';

interface EventList {
  key: number;
  no: number;
  period: string;
  name: string;
  turn: number;
  brand: string;
  created: string;
  eventStatus: EventStatus;
  eventLink: string;
}

const { info } = Modal;
const TIME_FORMAT = 'HH:mm A';
const DATE_FORMAT = 'YYYY-MM-DD';

function EventList() {
  const history = useHistory();

  const { events } = useSelector((state: StoreState) => state.event);
  const { id, copyStatus } = useSelector((state: StoreState) => state.event.copyEvent);
  const [visible, setVisible] = useState(false);
  console.log(id);
  console.log(copyStatus);

  const dispatch = useDispatch();

  const clipboard = useClipboard({
    onSuccess: () => {
      alert('URL 복사가 완료되었습니다.');
    },
  });

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

  const copyEvent = useCallback(
    (id: number, copyStatus?:false) => {
      dispatch(
        createCopyEventAsync.request({ data : {id}}),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getEvents(0, events.size);
  }, [getEvents]);

  useEffect(() => {
    // setVisible(copyStatus)
      if(copyStatus) {
        // 모달 팝업
        info({
          title: '공구가 복사 되었습니다.',
          content:'공구 등록 페이지로 이동됩니다.',
          okText: '확인',
         // cancelText: '취소',
          onOk() {
            // 공구 페이지로 이동
            history.push('/events/detail/' + id)
          }
        });

      }
  }, [copyStatus, id]);

  const onOk = useCallback(() => {
    setVisible(false);
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

  const pagination = useMemo(() => {
    return {
      total: events.totalElements,
      pageSize: events.size,
      onChange: handlePaginationChange,
    };
  }, [events]);

  const onRow = (recode: EventList) => {
    return {
      onClick: () => history.push('/events/detail/' + recode.key),
    };
  };

  const data: EventList[] = events.content.map((event, i) => {
    return {
      key: event.eventId,
      no: setPagingIndex(events.totalElements, events.page, events.size, i),
      period: `${moment(event.salesStarted).format('YYYY-MM-DD')} ~ ${moment(event.salesEnded).format('YYYY-MM-DD')}`,
      name: event.name,
      eventLink: `${process.env.REACT_APP_CLIENT_URL}/seller/${event.creator.loginId}/events/${event.eventId}`,
      turn: event.turn,
      brand: event.brand.brandName,
      created: moment(event.created).format('YYYY-MM-DD'),
      eventStatus: EventStatus[event.eventStatus],
    };
  });

  const colums: ColumnProps<EventList>[] = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      sorter: (a, b) => a.no - b.no,
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
      onCell: () => {
        return {
          onClick: e => e.stopPropagation(),
        };
      },
      render: (value, record) => (
        <div>
          {value}{' '}
          <Button
            style={{ color: '#000000' }}
            type="link"
            icon="paper-clip"
            onClick={() => clipboard.copy(record.eventLink)}
          />
        </div>
      ),
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
    {
      title: '복사',
      dataIndex: 'copy',
      key: 'copy',
      onCell: () => {
        return {
          onClick: e => e.stopPropagation(),
        };
      },
      render: (value, record) => (
        <div>
          {value}{' '}
          { record.eventStatus.indexOf('종료') === 0 &&
            <Button
              style={{ color: '#000000' }}
              icon="copy"
              onClick={() => copyEvent(record.key)}
            />
          }
        </div>
      ),
      onFilter: (value, record) => record.eventStatus.indexOf('종료') === 0,
    },
  ];

  return (
    <>
    <div className="event-list">
      <PaginationTable
        bordered
        columns={colums}
        dataSource={data}
        onChangePageSize={handleChangePageSize}
        pagination={pagination}
        onRow={onRow}
        style={{overflowX: 'scroll', whiteSpace:'nowrap'}}
      />
      <Link to="/events/detail" style={{ position: 'absolute', right: 50, marginTop: 15 }}>
        <Button type="primary" icon="setting" size="large" onClick={() => dispatch(clearEvent())}>
          신규 등록
        </Button>
      </Link>
    </div>
    <Modal
      title={'공구 시작일과 종료일을 입력 해주세요.'}
      visible={true}
      footer={
        <div className="modal-footer">
        <Button className="animation--disabled" type="primary" onClick={() => console.log('ok')}>
        확인
        </Button>
        </div>
        }
      width={500}
      destroyOnClose
      onCancel={() => setVisible(false)}
    >
      <div>
        <FlexRow>
          <Col>
            <span>시작일</span>
          </Col>
          <Col>
            <DatePicker placeholder="시작일" />
          </Col>
          <Col>
            <TimePicker
              use12Hours
              placeholder="시작시간"
              defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
              format={TIME_FORMAT}
            />
          </Col>
        </FlexRow>
        <FlexRow>
          <Col>
            <span> 종료 일</span>
          </Col>
          <Col>
            <DatePicker placeholder="종료일" />
          </Col>
          <Col>
            <TimePicker
              use12Hours
              placeholder="종료시간"
              defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
              format={TIME_FORMAT}
            />
          </Col>
        </FlexRow>
        <FlexRow>
          <Col>
            <span>배송 예정일</span>
          </Col>
          <Col>
            <DatePicker placeholder="배송예정일" />
          </Col>
        </FlexRow>
      </div>
    </Modal>
    </>
  );
}

export default EventList;
