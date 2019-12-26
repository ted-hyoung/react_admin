// base
import React, { useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import moment from 'moment';
import { Button, Row, Col, Input, Modal as AntModal, DatePicker, Table, message } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import { ColumnProps, TableRowSelection } from 'antd/lib/table';

// store
import { StoreState } from 'store';
import { getEventsAsync } from 'store/reducer/event';

// enums
import { EventStatus } from 'enums';
import { ResponseBrandForEvent, SearchEvent } from 'models';
import { BannerEventList, EventList } from 'containers/OrderSearchBar';
import { SelectOptionModal } from '../../components';
import { LabeledValue } from 'antd/lib/select';
import { SellerListModal } from '../index';


interface BannerEventSearchForm extends FormComponentProps {
  eventsData: BannerEventList[];
  setEventsData: Dispatch<SetStateAction<BannerEventList[]>>;
  setSelectedEvents: Dispatch<SetStateAction<BannerEventList[]>>;
  handleEventSearchModal: (visible: boolean) => void;
  brands:ResponseBrandForEvent[];
  setSelectedBrand: Dispatch<SetStateAction<ResponseBrandForEvent>>;
}

const BannerEventSearchForm = Form.create<BannerEventSearchForm>()((props: BannerEventSearchForm) => {
  const { form, eventsData, setEventsData, setSelectedEvents, handleEventSearchModal, brands} = props;
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll, resetFields } = form;
  const { events } = useSelector((state: StoreState) => state.event);
  const { size: pageSize } = events;
  const [visible, setVisible] = useState(false);
  const [visibleSellerList, setVisibleSellerList] = useState(false);
  const [setEventCheckAll] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchEvent>();
  const [accountId, setAccountId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loginId, setLoginId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<ResponseBrandForEvent>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (events.content.length !== 0) {
      const data: BannerEventList[] = [];
      events.content.forEach((item, index) => {
        data.push({
          key: index + 1,
          eventId:item.eventId,
          eventUrl: item.eventUrl,
          loginId:item.creator.loginId,
          brandName:item.brand.brandName,
          username:item.creator.username,
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

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll({ first: true, force: true }, (error, values) => {
      if (!error) {
        const { salesStarted, salesEnded } = values;
        let salesStartedTemp = '';
        let salesEndedTemp='';
        if(salesStarted){
          if (salesStarted.isAfter(salesEnded)) {
            return message.error('공구 시작일은 종료일보다 이전이여야 합니다.');
          }else{
            salesStartedTemp = moment(salesStarted).format('YYYY-MM-DDT00:00:00');
            salesEndedTemp = moment(salesEnded).format('YYYY-MM-DDT23:59:59');
          }
        }

        let brandId = 0;
        if(selectedBrand){
          brandId =  selectedBrand.brandId
        }

        const searchCondition: SearchEvent = {
          accountIds:Number(accountId) > 0 ? [Number(accountId)] : [],
          brandIds:brandId > 0 ? [brandId] : [],
          salesStarted: salesStartedTemp,
          salesEnded: salesEndedTemp,
        };

        if (searchCondition.salesStarted === '') {
          delete searchCondition.salesStarted;
          delete searchCondition.salesEnded;
        }

        setSelectedRowKeys([]);
        setLastSearchCondition(searchCondition);
        getEvents(0, pageSize, searchCondition);
      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  const handleSearchReset = () => {
    resetFields();
    setEventsData([]);
    setAccountId('');
    setUsername('');
    setLoginId('');
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
    const selectedEvents: BannerEventList[] = [];

    if(selectedRowKeys.length === 0){
      message.error('공구를 선택해주세요.');
      return false;
    }

    if(selectedRowKeys.length > 1){
      message.error('공구는 1개만 선택해주세요.');
      return false;
    }

    selectedEvents.push(eventsData[(selectedRowKeys as any) - 1]);
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

  const handleSelectBrand = (value: LabeledValue) => {
    const selectedBrand: ResponseBrandForEvent = {
      brandId: Number(value.key),
      brandName: String(value.label),
    };

    setFieldsValue({
      brandName: selectedBrand.brandName,
    });
    setVisible(false);
    setSelectedBrand(selectedBrand);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row style={{ paddingBottom: 15 }}>
          <Col span={3} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span>셀럽 ID/성명</span>
          </Col>
          <Col span={15} style={{marginRight:'10px'}}>
            <Form.Item>
              {getFieldDecorator('accountIds',  {
                initialValue: `${loginId}/${username}`,
              })(<Input width={100} />)}
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" shape="circle" icon="search" onClick={() => setVisibleSellerList(true)} />
          </Col>
        </Row>
        <Row>
          <Col span={3} style={{ paddingTop: 9, textAlign: 'center' }}>
            <span>브랜드</span>
          </Col>
          <Col span={15} style={{marginRight:'10px'}}>
            <Form.Item>
              {getFieldDecorator('brandName', {
                rules: [
                  {
                    required: false,
                    message: '브랜드명을 선택해주세요.',
                  },
                ],
              })(<Input readOnly width={30} />)}
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" shape="circle" icon="search" onClick={() => setVisible(true)} />
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
                    required: false,
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
                    required: false,
                    message: '공구 종료일을 선택해주세요.',
                  },
                ],
              })(<DatePicker placeholder="공구 종료일" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 15, marginTop: 20, textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 5, width: 150 }}>
            검색
          </Button>
          <Button style={{ width: 150 }} onClick={handleSearchReset}>
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
      <SelectOptionModal placeholder="브랜드 선택" visible={visible} options={brands} onSelect={handleSelectBrand} />
      <SellerListModal
        setAccountId={setAccountId}
        setUsername={setUsername}
        setLoginId={setLoginId}
        visible={visibleSellerList}
        setVisible={setVisibleSellerList}/>
    </>
  );
});

interface Props {
  eventSearchModal: boolean;
  handleEventSearchModal: (visible: boolean) => void;
  eventsData: BannerEventList[];
  setEventsData: Dispatch<SetStateAction<BannerEventList[]>>;
  setSelectedEvents: Dispatch<SetStateAction<BannerEventList[]>>;
  brands:ResponseBrandForEvent[];
  setSelectedBrand:Dispatch<SetStateAction<ResponseBrandForEvent>>;
}

const BannerEventSearchModal = (props: Props) => {
  const { eventSearchModal, handleEventSearchModal, eventsData, setEventsData, setSelectedEvents, brands ,setSelectedBrand } = props;
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
        <BannerEventSearchForm
          eventsData={eventsData}
          setEventsData={setEventsData}
          setSelectedEvents={setSelectedEvents}
          handleEventSearchModal={handleEventSearchModal}
          brands={brands}
          setSelectedBrand={setSelectedBrand}
        />
      </AntModal>
    </>
  );
};

export default BannerEventSearchModal;
