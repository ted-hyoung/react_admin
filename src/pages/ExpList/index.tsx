// base
import React, { useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getExpGroupsAsync } from 'store/action/expGroup.action';
import { StoreState } from 'store';

// modules
import { Table, Button } from 'antd';
import moment from 'moment';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';
import { ResponseExperienceGroups } from 'models';
import { PaginationTable } from 'components';
import { ExperienceGroupStatus } from 'enums/ExperienceGroupStatus';

const columns = [
  {
    title: 'No',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '체험단 후기명',
    dataIndex: 'experienceGroupName',
    key: 'experienceGroupName',
  },
  {
    title: '체험단 후기 모집 기간',
    dataIndex: 'recruitmentPeriod',
    key: 'recruitmentPeriod',
  },
  {
    title: '모집 인원',
    dataIndex: 'recruitmentPersonnelCount',
    key: 'recruitmentPersonnelCount',
  },
  {
    title: '총 모집 인원',
    dataIndex: 'totalRecruitmentPersonnelCount',
    key: 'totalRecruitmentPersonnelCount',
  },
  {
    title: '진행 상태',
    dataIndex: 'experienceGroupStatus',
    key: 'experienceGroupStatus',
  },
];

interface DataSource {
  key: number;
  no: number;
  experienceGroupName: string;
  recruitmentPeriod: string;
  recruitmentPersonnelCount: number;
  totalRecruitmentPersonnelCount: number;
  experienceGroupStatus: string;
}

function ExpList() {
  const { push } = useHistory();

  const { expGroups } = useSelector((state: StoreState) => state.expGroupState);
  const dispatch = useDispatch();

  const getExpList = (page = 0, size = 20) => {
    dispatch(getExpGroupsAsync.request({ page, size }));
  };

  const onRow = (record: DataSource) => ({
    onClick: () => push(`/exps/detail/${record.key}`),
  });

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getExpList(currentPage - 1);
    },
    [getExpList],
  );

  const pagination = useMemo(() => {
    return {
      total: expGroups.totalElements,
      pageSize: expGroups.size,
      onChange: handlePaginationChange,
    };
  }, [expGroups]);

  useEffect(() => {
    getExpList();
  }, []);

  return (
    <div className="exp-list">
      <PaginationTable
        bordered
        onRow={onRow}
        dataSource={expGroups.content.map((item, index) => {
          return {
            key: item.experienceGroupId,
            no: index + 1,
            experienceGroupName: item.experienceGroupName,
            recruitmentPeriod: `${moment(item.recruitmentStarted).format('YYYY-MM-DD')} ~ ${moment(
              item.recruitmentEnded,
            ).format('YYYY-MM-DD')}`,
            recruitmentPersonnelCount: item.recruitmentPersonnelCount,
            totalRecruitmentPersonnelCount: item.totalRecruitmentPersonnelCount,
            experienceGroupStatus: ExperienceGroupStatus[item.experienceGroupStatus],
          };
        })}
        columns={columns}
        pagination={pagination}
      />
      <div style={{ marginTop: 30, textAlign: 'right' }}>
        <Button type="primary" onClick={() => push('/exps/detail')}>
          신규 등록
        </Button>
      </div>
    </div>
  );
}

export default ExpList;
