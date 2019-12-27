// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getQnaAsync } from 'store/reducer/qna';

// modules
import { Table, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// containers
import { QnaExpandForm, QnaSearch, QnaSequenceSelect } from 'containers';

// utils
import { dateTimeFormat, endDateFormat, setPagingIndex, startDateFormat } from 'lib/utils';

// types
import { ResponseQna, ResponseEventForQna, QnaComment, ResponseEventQnaGroup } from 'models';

// enums
import { QnaStatus, QnaOrderType, ShippingStatus } from 'enums';

// assets
import './index.less';

interface Qna {
  no: number;
  qnaId: number;
  qnaStatus: QnaStatus;
  eventQnaGroup: ResponseEventQnaGroup;
  contents: string;
  created: string;
  orderType: QnaOrderType;
  sequence: number;
  expose: boolean;
  qnaComment: QnaComment | null;
}

export interface SearchQNA {
  qnaStatus?: string;
  searchName?: string;
}

const defaultSearchCondition = {
  qnaStatus: '',
  searchName: '',
};

const Qna = () => {
  const { qna, waitStatusCount } = useSelector((storeState: StoreState) => storeState.qna);
  const dispatch = useDispatch();
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchQNA>();
  const { first, last, page, size: pageSize, content, totalPages, totalElements } = qna;

  const getQna = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchQNA) => {
      const params = {
        page,
        size,
        searchCondition,
      };
      dispatch(getQnaAsync.request(params));
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );
  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getQna(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getQna, pageSize, lastSearchCondition],
  );

  useEffect(() => {
    getQna(0, pageSize, defaultSearchCondition);
  }, [getQna, pageSize, defaultSearchCondition]);

  const columns: Array<ColumnProps<ResponseQna>> = [
    {
      title: '번호',
      dataIndex: 'no',
      key: 'no',
      width: '5%',
    },
    {
      title: '상태',
      dataIndex: 'qnaStatus',
      key: 'qnaStatus',
      width: '10%',
      render: (status: QnaStatus) => {
        return <Tag color={status === QnaStatus[QnaStatus.WAIT] ? '#f50' : '#a6a6a6'}>{QnaStatus[status]}</Tag>;
      },
    },
    {
      title: '공구명',
      dataIndex: 'event',
      key: 'event',
      width: '20%',
      render: (text, record) => {
        return record.eventQnaGroup && record.eventQnaGroup.event.name;
      },
    },
    { title: '문의 내용', dataIndex: 'contents', key: 'contents', width: '20%' },
    {
      title: '접수일',
      dataIndex: 'created',
      key: 'created',
      width: '20%',
      render: (text: string) => {
        return moment(text).format(dateTimeFormat);
      },
    },
    {
      title: '위치 수정',
      dataIndex: 'orderType',
      key: 'orderType',
      width: '25%',
      render: (textOrderType: QnaOrderType, record: ResponseQna) => {
        return (
          <QnaSequenceSelect
            textOrderType={textOrderType}
            recordQnaId={record.qnaId}
            recordSequence={record.sequence}
          />
        );
      },
    },
  ];

  const dataSource: Array<Qna> = qna.content.map((item, i) => {
    return {
      no: setPagingIndex(totalElements, page, pageSize, i),
      qnaId: item.qnaId,
      qnaStatus: item.qnaStatus,
      eventQnaGroup: item.eventQnaGroup,
      contents: item.contents,
      created: moment(item.created).format(dateTimeFormat),
      orderType: item.orderType,
      sequence: item.sequence,
      expose: item.expose,
      qnaComment: item.qnaComment,
    };
  });

  return (
    <div className="qna">
      <QnaSearch onOk={value => getQna(0, pageSize, value)} />

      <div className="qna-status-wait" style={{ textAlign: 'right', marginTop: 10, marginBottom: 10 }}>
        <strong>답변대기</strong> {waitStatusCount}
      </div>

      <div className="qna-table">
        <Table
          scroll={{ x: 720 }}
          rowKey={record => record.qnaId.toString()}
          dataSource={dataSource}
          columns={columns}
          // expandIconAsCell={false}
          // expandRowByClick
          pagination={{
            total: totalElements,
            pageSize,
            onChange: handlePaginationChange,
          }}
          expandedRowRender={record => <QnaExpandForm record={record} />}
        />
      </div>
    </div>
  );
};

export default Qna;
