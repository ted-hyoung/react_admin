// base
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getQnaAsync } from 'store/reducer/qna';

// modules
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// components
import { QnaExpandForm, QnaSearch, QnaSequenceSelect } from 'components';

// utils
import { ResponseQna } from 'types';
import { QnaStatus, QnaOrderType } from 'enums';

// defines
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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
    },
    {
      title: '상태',
      dataIndex: 'qnaStatus',
      key: 'qnaStatus',
      render: (status: string) => {
        return status === QnaStatus[QnaStatus.WAIT] ? QnaStatus[QnaStatus.답변대기] : QnaStatus[QnaStatus.답변완료];
      },
    },
    { title: '공구명', dataIndex: 'eventName', key: 'eventName' },
    { title: '문의 내용', dataIndex: 'contents', key: 'contents', width: 400 },
    {
      title: '접수일',
      dataIndex: 'created',
      key: 'created',
      render: text => {
        return moment(text).format(DATE_FORMAT);
      },
    },
    {
      title: '위치 수정',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 300,
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

      <div className="qna-status-wait" style={{ textAlign: 'right', marginBottom: 10, padding: '0 30px' }}>
        답변대기 {waitStatusCount}
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
