// base
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import {
  createExpGroupAsync,
  getExpGroupsByIdAsync,
  updateExpGroupsByIdAsync,
  clearStoreExpGroup,
  updateExpGroupConsumersAsync,
} from 'store/action/expGroup.action';
import {
  getExpGroupConsumersByIdAsync,
  updateExpGroupConsumersPrizeAsync,
  updateExpGroupConsumerExposeByIdAsync,
  getExpGroupConsumerByIdAsync,
  updateExpGroupConsumerByIdAsync,
  getExpGroupConsumersExcelByIdAsync,
} from 'store/action/expGroupConsumer.action';

// modules
import moment from 'moment';
import { Tabs, Row, Col, Button, Select, Modal, message } from 'antd';

// components
import { ExpGroupForm, ExpConsumerSearchForm, PaginationTable, ExpGroupConsumerForm } from 'components';
import { ExpGroupConsumerFormValues } from 'components/form/ExpGroupConsumerForm';

// lib
import { readExcel, createExcel, setPagingIndex } from 'lib/utils';
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

  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const [searchExpGroupConsumerParams, setSearchExpGroupConsumerParams] = useState<SearchExperienceGroupConsumer>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { expGroup, expGroupConsumers, expGroupConsumer, expGroupConsumersExcel } = useSelector(
    (state: StoreState) => ({
      expGroup: state.expGroupState.expGroup,
      expGroupConsumer: state.expGroupConsumerState.expGroupConsumer,
      expGroupConsumers: state.expGroupConsumerState.expGroupConsumers,
      expGroupConsumersExcel: state.expGroupConsumerState.expGroupConsumersExcel,
    }),
  );

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

    setSearchExpGroupConsumerParams(values);
  };

  const handleViewReview = (id: number) => {
    dispatch(getExpGroupConsumerByIdAsync.request({ id }));

    setVisible(true);
  };

  const handleUpdateExpGroupConsumer = (values: ExpGroupConsumerFormValues) => {
    const { contents, starRate, images } = values;

    if (!expGroupConsumer) {
      message.error('서버 문제로 인해 수정에 실패하였습니다.');

      return;
    }

    const data = {
      contents,
      starRate,
      images,
    };

    dispatch(updateExpGroupConsumerByIdAsync.request({ id: expGroupConsumer.experienceGroupConsumerId, data }));
  };

  const handleDownloadExcel = () => {
    dispatch(getExpGroupConsumersExcelByIdAsync.request({ id: Number(id), params: searchExpGroupConsumerParams }));
  };

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getExpGroupConsumersById(Number(id), currentPage - 1);
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
      dispatch(clearStoreExpGroup());
    };
  }, []);

  useEffect(() => {
    if (id) {
      getExpGroupsById(Number(id));
      getExpGroupConsumersById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (expGroupConsumersExcel.length > 0) {
      const data = expGroupConsumersExcel.reduce(
        (ac, item, index) => {
          const no = (index + 1).toString();
          const expose = item.expose ? '공개' : '비공개';

          ac.push([
            no,
            moment(item.created).format(CLIENT_DATE_TIME_FORMAT),
            item.consumer.username,
            item.consumer.phone,
            PrizeStatus[item.prizeStatus],
            item.experienceGroupReviewCreated ? 'O' : 'X',
            expose,
          ]);

          return ac;
        },
        [['No', '참여일', '이름', '연락처', '당첨 상태', '후기', '공개/비공개']],
      );

      createExcel(data);
    }
  }, [expGroupConsumersExcel]);

  return (
    <div className="exp-detail">
      <Tabs defaultActiveKey="EVENT">
        <Tabs.TabPane tab="이벤트 정보" key="EVENT">
          <ExpGroupForm initailValues={expGroup ? expGroup : undefined} onSubmit={handleSubmit} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="참여자 정보" key="PRODUCT" disabled={!id}>
          <ExpConsumerSearchForm onSubmit={handleExpSearch} onResetAfter={() => getExpGroupConsumersById(Number(id))} />
          <div style={{ marginTop: 50 }}>
            <span>검색결과 총 {expGroupConsumers.totalElements}건</span>
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
                <Button type="primary" icon="download" onClick={handleDownloadExcel}>
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
                      no: setPagingIndex(
                        expGroupConsumers.totalElements,
                        expGroupConsumers.page,
                        expGroupConsumers.size,
                        index,
                      ),
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
                      <Button type="primary" onClick={() => handleViewReview(record.key)}>
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
      <Modal
        title="후기 상세"
        width={800}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        destroyOnClose
      >
        {expGroupConsumer && (
          <ExpGroupConsumerForm
            username={expGroupConsumer.consumer.username}
            phone={expGroupConsumer.consumer.phone}
            created={expGroupConsumer.experienceGroupReviewCreated}
            starRate={expGroupConsumer.starRate}
            contents={expGroupConsumer.contents}
            images={expGroupConsumer.images}
            onSubmit={handleUpdateExpGroupConsumer}
          />
        )}
      </Modal>
    </div>
  );
}

export default ExpDetail;
