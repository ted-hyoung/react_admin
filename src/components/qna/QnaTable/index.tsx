// base
import React from 'react';

// modules
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// utils
import { ResponseQna } from 'types';
import { QnaStatus } from 'enums';

// defines
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
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
    render: (text: string) => {
      return text === QnaStatus.답변대기 ? QnaStatus.WAIT : QnaStatus.COMPLETE;
    },
  },
  { title: '공구명', dataIndex: 'eventName', key: 'eventName' },
  { title: '문의 내용', dataIndex: 'contents', key: 'contents' },
  {
    title: '접수일',
    dataIndex: 'created',
    key: 'created',
    render: (created: string) => {
      return moment(created).format(DATE_FORMAT);
    },
  },
  { title: '위치 수정', dataIndex: 'sequence', key: 'sequence' },
];

interface Props {
  dataSource: ResponseQna[];
}

function QnaTable(props: Props) {
  const { dataSource } = props;
  return (
    <div className="qna-table">
      <Table
        rowKey={record => record.qnaId.toString()}
        dataSource={dataSource}
        columns={columns}
        expandIconAsCell={false}
        expandRowByClick
      />
    </div>
  );
}

export default QnaTable;
