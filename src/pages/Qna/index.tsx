// base
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getQnaAsync } from 'store/reducer/qna';

// modules
import { Table, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// components
import { QnaExpandForm, QnaSearch, QnaSequenceSelect } from 'components';

// utils
import { dateFormat } from 'lib/utils';

// types
import { ResponseQna } from 'types';

// enums
import { QnaStatus, QnaOrderType } from 'enums';

// assets
import './index.less';

const Qna = () => {
  const { qna, waitStatusCount } = useSelector((storeState: StoreState) => storeState.qna);
  const dispatch = useDispatch();

  const getQna = useCallback(
    (qnaStatus?, searchName?) => {
      const params = {
        page: 0,
        size: 20,
        qnaStatus,
        searchName,
      };

      dispatch(getQnaAsync.request(params));
    },
    [dispatch],
  );

  useEffect(() => {
    getQna();
  }, [getQna]);

  const columns: Array<ColumnProps<ResponseQna>> = [
    {
      title: '번호',
      dataIndex: 'qnaId',
      key: 'qnaId',
      width: '5%',
    },
    {
      title: '상태',
      dataIndex: 'qnaStatus',
      key: 'qnaStatus',
      width: '10%',
      render: (status: string) => {
        return status === QnaStatus[QnaStatus.WAIT] ? (
          <Tag color="#f50">{QnaStatus[QnaStatus.답변대기]}</Tag>
        ) : (
          <Tag color="#a6a6a6">{QnaStatus[QnaStatus.답변완료]}</Tag>
        );
      },
    },
    { title: '공구명', dataIndex: 'eventName', key: 'eventName', width: '10%' },
    { title: '문의 내용', dataIndex: 'contents', key: 'contents', width: '30%' },
    {
      title: '접수일',
      dataIndex: 'created',
      key: 'created',
      width: '20%',
      render: (text: string) => {
        return moment(text).format(dateFormat);
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

  return (
    <div className="qna">
      <QnaSearch onOk={getQna} />

      <div className="qna-status-wait" style={{ textAlign: 'right', marginBottom: 10 }}>
        <strong>답변대기</strong> {waitStatusCount}
      </div>

      <div className="qna-table">
        <Table
          rowKey={record => record.qnaId.toString()}
          dataSource={qna.content}
          columns={columns}
          // expandIconAsCell={false}
          // expandRowByClick
          expandedRowRender={record => <QnaExpandForm record={record} />}
        />
      </div>
    </div>
  );
};

export default Qna;
