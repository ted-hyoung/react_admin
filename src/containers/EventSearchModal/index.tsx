// base
import React, { useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import moment from 'moment';
import { Button, Checkbox, Row, Col, Input, Icon, Modal as AntModal, DatePicker, Table, message } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import { ColumnProps, TableRowSelection } from 'antd/lib/table';

// store
import { StoreState } from 'store';
import { getEventsAsync } from 'store/reducer/event';

// enums
import { EVENT_STATUS, DEFAULT_EVENT_STATUSES, EventStatus } from 'enums';
import { SearchEvent } from 'models';
import { EventList } from 'containers/OrderSearchBar';

interface EventSearchForm extends FormComponentProps {
  eventsData: EventList[];
  setEventsData: Dispatch<SetStateAction<EventList[]>>;
  setSelectedEvents: Dispatch<SetStateAction<EventList[]>>;
  handleEventSearchModal: (visible: boolean) => void;
}

const EventSearchForm = Form.create<EventSearchForm>()((props: EventSearchForm) => {
  const { form, eventsData, setEventsData, setSelectedEvents, handleEventSearchModal } = props;
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll, resetFields } = form;
  const { events } = useSelector((state: StoreState) => state.event);
  const { size: pageSize } = events;
  const [eventChaeckALl, setEventCheckAll] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchEvent>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (events.content.length !== 0) {
      const data: EventList[] = [];
      events.content.forEach((item, index) => {
        data.push({
          key: index + 1,
          sales: `${moment(item.salesStarted).format('YYYY-MM-DD')} ~ ${moment(item.salesEnded).format('YYYY-MM-DD')}`,
          name: item.name,
          eventStatus: EventStatus[item.eventStatus],
          products: item.products,
        });
      });
      setEventsData(data);
    } else {
      setEventsData([]);
    }
  }, [events]);

  const getEvents = useCallback(
    (page: number, size: number, searchCondition?: SearchEvent) => {
      dispatch(getEventsAsync.request({ page, size, searchCondition }));
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  const handleChangeEventStatuses = useCallback(values => {
    setEventCheckAll(values.length === EVENT_STATUS.length);
  }, []);

  const handleChangeEventStatusesAll = useCallback(e => {
    setFieldsValue({
      eventStatues: e.target.checked ? DEFAULT_EVENT_STATUSES : [],
    });
    setEventCheckAll(e.target.checked);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        const { name, salesStarted, salesEnded, eventStatuses } = values;

        if (salesStarted.isAfter(salesEnded)) {
          return message.error('공구 시작일은 종료일보다 이전이여야 합니다.');
        }

        const searchCondition: SearchEvent = {
          name,
          salesStarted: moment(salesStarted).format('YYYY-MM-DDT00:00:00'),
          salesEnded: moment(salesEnded).format('YYYY-MM-DDT23:59:59'),
          eventStatuses,
        };

        if (name === '') {
          delete searchCondition.name;
        }

        setSelectedRowKeys([]);
        setLastSearchCondition(searchCondition);
        getEvents(0, pageSize, searchCondition);
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  const hadnleSearchReset = () => {
    resetFields();
    setEventCheckAll(true);
    setEventsData([]);
  };

  const rowSelection: TableRowSelection<EventList> = {
    selectedRowKeys,
    onChange: useCallback(selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }, []),
  };

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      setSelectedRowKeys([]);
      getEvents(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getEvents, pageSize, lastSearchCondition],
  );

  const handleSelectedEvent = () => {
    const selectedEvents: EventList[] = [];
    selectedRowKeys.forEach(item => {
      selectedEvents.push(eventsData[(item as any) - 1]);
    });
    setSelectedEvents(selectedEvents);
    handleEventSearchModal(false);
  };

  const columns: Array<ColumnProps<EventList>> = [
    {
      title: 'NO',
      key: 'key',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: '공구 기간',
      key: 'sales',
      dataIndex: 'sales',
      align: 'center',
    },
    {
      title: '공구명',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '상태',
      key: 'eventStatus',
      dataIndex: 'eventStatus',
      align: 'center',
    },
  ];

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row style={{ paddingBottom: 15 }}>
          <Col span={3} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span>공구명</span>
          </Col>
          <Col span={15}>
            <Form.Item>
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input width={100} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 15 }}>
          <Col span={3} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span>공구 기간</span>
          </Col>
          <Col span={1} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span>시작일</span>
          </Col>
          <Col span={5} style={{ paddingLeft: 15 }}>
            <Form.Item>
              {getFieldDecorator('salesStarted', {
                rules: [
                  {
                    required: true,
                    message: '공구 종료일을 선택해주세요.',
                  },
                ],
              })(<DatePicker placeholder="공구 시작일" />)}
            </Form.Item>
          </Col>
          <Col span={2} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span> ~ 종료일</span>
          </Col>
          <Col span={5} style={{ paddingLeft: 2 }}>
            <Form.Item>
              {getFieldDecorator('salesEnded', {
                rules: [
                  {
                    required: true,
                    message: '공구 종료일을 선택해주세요.',
                  },
                ],
              })(<DatePicker placeholder="공구 종료일" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 15 }}>
          <Col span={3} style={{ paddingTop: 12, textAlign: 'center' }}>
            <span>공구 상태</span>
          </Col>
          <Col span={18} style={{ paddingTop: 5 }}>
            <Form.Item>
              <Checkbox onChange={handleChangeEventStatusesAll} checked={eventChaeckALl}>
                전체
              </Checkbox>
              {getFieldDecorator('eventStatuses', {
                initialValue: DEFAULT_EVENT_STATUSES,
              })(<Checkbox.Group options={EVENT_STATUS} onChange={handleChangeEventStatuses} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 15, marginTop: 20, textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 5, width: 150 }}>
            검색
          </Button>
          <Button style={{ width: 150 }} onClick={hadnleSearchReset}>
            초기화
          </Button>
        </Row>
        <Row style={{ paddingBottom: 15 }}>
          <Col span={10}>검색결과 총 {events.totalElements}건</Col>
        </Row>
        <Row style={{ paddingBottom: 15 }}>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={eventsData}
            pagination={{
              defaultCurrent: events.page !== 0 ? events.page + 1 : 0,
              current: events.page !== 0 ? events.page + 1 : 0,
              total: events.totalElements,
              pageSize: events.size,
              onChange: handlePaginationChange,
            }}
          />
        </Row>
        <Row style={{ paddingBottom: 15, textAlign: 'center' }}>
          <Button type="primary" style={{ width: 150 }} onClick={handleSelectedEvent}>
            확인
          </Button>
        </Row>
      </Form>
    </>
  );
});

interface Props {
  eventSearchModal: boolean;
  handleEventSearchModal: (visible: boolean) => void;
  eventsData: EventList[];
  setEventsData: Dispatch<SetStateAction<EventList[]>>;
  setSelectedEvents: Dispatch<SetStateAction<EventList[]>>;
}

const EventSearchModal = (props: Props) => {
  const { eventSearchModal, handleEventSearchModal, eventsData, setEventsData, setSelectedEvents } = props;
  return (
    <>
      <AntModal
        title="※ 공구 검색"
        width={800}
        visible={eventSearchModal}
        onCancel={() => handleEventSearchModal(false)}
        footer={false}
        destroyOnClose
      >
        <EventSearchForm
          eventsData={eventsData}
          setEventsData={setEventsData}
          setSelectedEvents={setSelectedEvents}
          handleEventSearchModal={handleEventSearchModal}
        />
      </AntModal>
    </>
  );
};

export default EventSearchModal;
