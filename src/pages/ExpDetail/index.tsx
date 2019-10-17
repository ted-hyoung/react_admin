// base
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import {
  createExpGroupAsync,
  getExpGroupsByIdAsync,
  updateExpGroupsByIdAsync,
  clearExpGroupDetail,
  updateExpGroupConsumersAsync,
} from 'store/action/expGroup.action';
import {
  getExpGroupConsumersByIdAsync,
  updateExpGroupConsumersPrizeAsync,
  updateExpGroupConsumerExposeByIdAsync,
  getExpGroupConsumerByIdAsync,
} from 'store/action/expGroupConsumer.action';

// modules
import moment from 'moment';
import { Tabs, Row, Col, Button, Select } from 'antd';

// components
import { ExpForm, ExpSearchForm, PaginationTable } from 'components';

// lib
import { readExcel } from 'lib/utils';
import { CLIENT_DATE_TIME_FORMAT } from 'lib/constants';

// models, enums
import {
  CreateExperienceGroup,
  UpdateExperienceGroup,
  Indexable,
  CreateConsumerForExperienceGroupConsumerUpload,
  SearchExperienceGroupConsumer,
} from 'models';
import { PrizeStatus } from 'enums';

function ExpDetail() {
  const { id } = useParams();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { expGroup, expGroupConsumers } = useSelector((state: StoreState) => ({
    expGroup: state.expGroupState.expGroup,
    expGroupConsumers: state.expGroupConsumerState.expGroupConsumers,
  }));
  const dispatch = useDispatch();

  const getExpGroupsById = (id: number) => {
    dispatch(getExpGroupsByIdAsync.request({ id }));
  };

  const getExpGroupConsumersById = (id: number, page = 0, size = 20, params?: SearchExperienceGroupConsumer) => {
    dispatch(getExpGroupConsumersByIdAsync.request({ id, page, size, params }));
  };

  const handleSubmit = (values: CreateExperienceGroup | UpdateExperienceGroup) => {
    if (id) {
      dispatch(updateExpGroupsByIdAsync.request({ id: Number(id), data: values }));
    } else {
      dispatch(createExpGroupAsync.request(values));
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    } else {
      window.alert('파일을 찾을 수 없습니다.');

      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        const workbook = await readExcel(e.target.result as ArrayBuffer);

        const worksheet = workbook.getWorksheet(1);

        const consumers = worksheet
          .getSheetValues()
          .reduce((ac: CreateConsumerForExperienceGroupConsumerUpload[], item: Indexable, index) => {
            if (index > 1) {
              ac.push({
                username: item[1],
                phone: '0' + item[2],
              });
            }

            return ac;
          }, []);

        dispatch(updateExpGroupConsumersAsync.request({ id: Number(id), data: { consumers } }));
      }
    };

    fileReader.readAsArrayBuffer(file);

    // Reset input value
    e.target.value = '';
  };

  const handleChangePrizeStatus = (status: PrizeStatus, ids: string[] | number[]) => {
    dispatch(
      updateExpGroupConsumersPrizeAsync.request({
        data: { experienceGroupConsumerIds: ids as number[], prizeStatus: status },
      }),
    );
  };

  const handleChangeExpose = (expose: boolean, id: number) => {
    dispatch(updateExpGroupConsumerExposeByIdAsync.request({ id, data: { expose: Boolean(expose) } }));
  };

  const handleExpSearch = (values: SearchExperienceGroupConsumer) => {
    getExpGroupConsumersById(Number(id), 0, 20, values);
  };

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getExpGroupConsumersById(currentPage - 1);
    },
    [getExpGroupConsumersById],
  );

  const pagination = useMemo(() => {
    return {
      total: expGroupConsumers.totalElements,
      pageSize: expGroupConsumers.size,
      onChange: handlePaginationChange,
    };
  }, [expGroupConsumers]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[] | number[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    return () => {
      dispatch(clearExpGroupDetail());
    };
  }, []);

  useEffect(() => {
    if (id) {
      getExpGroupsById(Number(id));
      getExpGroupConsumersById(Number(id));
    }
  }, [id]);

  return (
    <div className="exp-detail">
      <Tabs defaultActiveKey="EVENT">
        <Tabs.TabPane tab="이벤트 정보" key="EVENT">
          <ExpForm initailValues={expGroup ? expGroup : undefined} onSubmit={handleSubmit} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="참여자 정보" key="PRODUCT" disabled={!id}>
          <ExpSearchForm onSubmit={handleExpSearch} />
          <div style={{ marginTop: 50 }}>
            <span>검색결과 총 00건</span>
            <Row style={{ marginBottom: 10 }} type="flex" justify="end" align="middle" gutter={10}>
              <Col>
                <Button onClick={() => handleChangePrizeStatus(PrizeStatus[PrizeStatus.COMPLETE], selectedRowKeys)}>
                  당첨자 선택
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon="upload"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  체험단 목록 업로드
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />
                </Button>
              </Col>
              <Col>
                <Button type="primary" icon="download">
                  엑셀 다운로드
                </Button>
              </Col>
            </Row>
            <PaginationTable
              rowSelection={rowSelection}
              pagination={pagination}
              dataSource={
                expGroupConsumers
                  ? expGroupConsumers.content.map((item, index) => ({
                      key: item.experienceGroupConsumerId,
                      no: index + 1,
                      created: moment(item.created).format(CLIENT_DATE_TIME_FORMAT),
                      username: item.consumer.username,
                      phone: item.consumer.phone,
                      prizeStatus: PrizeStatus[item.prizeStatus],
                      experienceGroupReviewCreated: item.experienceGroupReviewCreated,
                      expose: item.expose,
                    }))
                  : []
              }
              columns={[
                {
                  title: 'No',
                  dataIndex: 'no',
                  key: 'no',
                },
                {
                  title: '참여일',
                  dataIndex: 'created',
                  key: 'created',
                },
                {
                  title: '이름',
                  dataIndex: 'username',
                  key: 'username',
                },
                {
                  title: '연락처',
                  dataIndex: 'phone',
                  key: 'phone',
                },
                {
                  title: '당첨 상태',
                  dataIndex: 'prizeStatus',
                  key: 'prizeStatus',
                  render: (text, record) => (
                    <Select
                      style={{ width: '100%' }}
                      value={text}
                      onChange={(value: PrizeStatus) => handleChangePrizeStatus(value, [record.key])}
                    >
                      <Select.Option value={PrizeStatus[PrizeStatus.WAIT]}>대기</Select.Option>
                      <Select.Option value={PrizeStatus[PrizeStatus.COMPLETE]}>완료</Select.Option>
                    </Select>
                  ),
                },
                {
                  title: '후기',
                  dataIndex: 'experienceGroupReviewCreated',
                  key: 'experienceGroupReviewCreated',
                  render: (text, record) =>
                    text ? (
                      <Button
                        type="primary"
                        onClick={() => dispatch(getExpGroupConsumerByIdAsync.request({ id: record.key }))}
                      >
                        보기
                      </Button>
                    ) : (
                      ''
                    ),
                },
                {
                  title: '공개/비공개',
                  dataIndex: 'expose',
                  key: 'expose',
                  render: (text, record) => (
                    <Select
                      style={{ width: '100%' }}
                      value={text.toString()}
                      onChange={(value: string) => handleChangeExpose(value === 'true', record.key)}
                    >
                      <Select.Option value="true">공개</Select.Option>
                      <Select.Option value="false">비공개</Select.Option>
                    </Select>
                  ),
                },
              ]}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default ExpDetail;
