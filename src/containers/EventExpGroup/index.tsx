// base
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import {
  getExpGroupsForEventAsync,
  createExpGroupByEventAsync,
  getExpGroupsByEventAsync,
  clearStoreSearchExpGroup,
  deleteExpGroupByEventAsync,
} from 'store/action/expGroup.action';

// modules
import moment from 'moment';
import { Row, Col, Button, Descriptions, Icon, Modal, message } from 'antd';

// components
import { PaginationTable } from 'components';

// containers
import { ExpGroupSearchForm } from 'containers';

// lib
import { CLIENT_DATE_FORMAT } from 'lib/constants';

// models, enums
import { SearchExperienceGroupForEvent } from 'models';
import { ExperienceGroupStatus } from 'enums/ExperienceGroupStatus';
import { setPagingIndex } from 'lib/utils';

// defines
const searchExpGroupColumns = [
  {
    title: 'No',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '기간',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: '체험단명',
    dataIndex: 'experienceGroupName',
    key: 'experienceGroupName',
  },
  {
    title: '상태',
    dataIndex: 'experienceGroupStatus',
    key: 'experienceGroupStatus',
  },
];

const eventExpGroupColumns = [
  {
    title: 'No',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '체험단명',
    dataIndex: 'experienceGroupName',
    key: 'experienceGroupName',
  },
  {
    title: '기간',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: '대상 인원 수',
    dataIndex: 'recruitmentPersonnelCount',
    key: 'recruitmentPersonnelCount',
  },
  {
    title: '후기 등록 수',
    dataIndex: 'experienceGroupConsumerCount',
    key: 'experienceGroupConsumerCount',
  },
  {
    title: '진행 상태',
    dataIndex: 'experienceGroupStatus',
    key: 'experienceGroupStatus',
  },
];

function ExpGroups() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const [searchExpGroupParams, setSearchExpGroupParams] = useState<SearchExperienceGroupForEvent>();

  const { eventExpGroups, searchExpGroup } = useSelector((state: StoreState) => state.expGroupState);

  const createExpGroupByEvent = ({
    eventId,
    experienceGroupIds,
  }: {
    eventId: number;
    experienceGroupIds: number[];
  }) => {
    dispatch(createExpGroupByEventAsync.request({ id: eventId, data: { experienceGroupIds } }));
  };

  const getExpGroupsForEvent = (
    eventId: number,
    page = 0,
    size = 5,
    params: SearchExperienceGroupForEvent | undefined,
  ) => {
    dispatch(getExpGroupsForEventAsync.request({ eventId, page, size, params }));
  };

  const getExpGroupsByEvent = (id = 0, page = 0, size = 20) => {
    dispatch(getExpGroupsByEventAsync.request({ id, page, size }));
  };

  const handleSearchExpGroup = (values: SearchExperienceGroupForEvent) => {
    getExpGroupsForEvent(Number(id), 0, 5, values);
    setSearchExpGroupParams(values);
  };

  const handleOpen = () => {
    setSelectedRowKeys([]);
    setVisible(true);
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setVisible(false);
    dispatch(clearStoreSearchExpGroup());
  };

  const handleConfirm = () => {
    if (selectedRowKeys.length === 0) {
      message.error('선택된 체험단 후기가 없습니다.');

      return;
    }

    createExpGroupByEvent({ eventId: Number(id), experienceGroupIds: selectedRowKeys as number[] });

    handleCancel();
  };

  const handleDeleteSelected = () => {
    dispatch(
      deleteExpGroupByEventAsync.request({
        eventId: Number(id),
        data: { experienceGroupIds: selectedRowKeys as number[] },
      }),
    );
  };

  useEffect(() => {
    getExpGroupsByEvent(Number(id));
  }, []);

  const eventExpGroupPagination = useMemo(() => {
    return {
      total: eventExpGroups.totalElements,
      pageSize: eventExpGroups.size,
      onChange: (currentPage: number) => {
        getExpGroupsByEvent(Number(id), currentPage - 1);
      },
    };
  }, [eventExpGroups]);

  const searchExpGroupPagination = useMemo(() => {
    return {
      total: searchExpGroup.totalElements,
      pageSize: searchExpGroup.size,
      onChange: (currentPage: number) => {
        getExpGroupsForEvent(Number(id), currentPage - 1, 5, searchExpGroupParams);
      },
    };
  }, [searchExpGroup]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[] | number[]) => setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <div className="exp-groups">
      <Descriptions style={{ marginBottom: 30 }} bordered column={24}>
        <Descriptions.Item label="체험단 이벤트명" span={24}>
          <Row>
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="primary" style={{ width: 150 }} onClick={handleOpen}>
                체험단 이벤트 검색
              </Button>
              <Icon type="search" style={{ fontSize: 20, marginLeft: 10 }} />
            </Col>
          </Row>
        </Descriptions.Item>
      </Descriptions>
      <Row style={{ marginBottom: 10 }} type="flex" justify="end" align="middle">
        <Col>
          <Button type="danger" onClick={handleDeleteSelected}>
            선택 삭제
          </Button>
        </Col>
      </Row>
      <PaginationTable
        pagination={eventExpGroupPagination}
        rowSelection={visible ? {} : rowSelection}
        columns={eventExpGroupColumns}
        dataSource={eventExpGroups.content.map((item, index) => ({
          key: item.experienceGroupId,
          index: setPagingIndex(eventExpGroups.totalElements, eventExpGroups.page, eventExpGroups.size, index),
          experienceGroupName: item.experienceGroupName,
          period: `${moment(item.recruitmentStarted).format(CLIENT_DATE_FORMAT)} ~ ${moment(
            item.recruitmentEnded,
          ).format(CLIENT_DATE_FORMAT)}`,
          recruitmentPersonnelCount: item.recruitmentPersonnelCount,
          experienceGroupConsumerCount: item.experienceGroupConsumerCount,
          experienceGroupStatus: ExperienceGroupStatus[item.experienceGroupStatus],
        }))}
      />
      <Modal title="※ 체험단 검색" width={800} visible={visible} onCancel={handleCancel} footer={false} destroyOnClose>
        <ExpGroupSearchForm onSubmit={handleSearchExpGroup} />
        <PaginationTable
          pagination={searchExpGroupPagination}
          rowSelection={rowSelection}
          columns={searchExpGroupColumns}
          dataSource={searchExpGroup.content.map((item, index) => ({
            key: item.experienceGroupId,
            index: setPagingIndex(searchExpGroup.totalElements, searchExpGroup.page, searchExpGroup.size, index),
            period: `${moment(item.recruitmentStarted).format(CLIENT_DATE_FORMAT)} ~ ${moment(
              item.recruitmentEnded,
            ).format(CLIENT_DATE_FORMAT)}`,
            experienceGroupName: item.experienceGroupName,
            experienceGroupStatus: ExperienceGroupStatus[item.experienceGroupStatus],
          }))}
        />
        <Row style={{ marginTop: 20 }} type="flex" justify="center">
          <Col>
            <Button type="primary" onClick={handleConfirm}>
              등록
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default ExpGroups;
