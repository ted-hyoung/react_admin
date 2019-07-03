// base
import React from 'react';

// types
import { ResponseQna } from 'types';
import { Table } from 'antd';
import { QnaStatus } from 'enums';
import { ColumnProps } from 'antd/lib/table';

// defines
const columns: ColumnProps<ResponseQna>[] = [
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
  { title: '접수일', dataIndex: 'created', key: 'created' },
  { title: '위치 수정', dataIndex: 'sequence', key: 'sequence' },
];

interface Props {
  dataSource: ResponseQna[];
}

function OrderTable(props: Props) {
  const { dataSource } = props;
  return (
    <div className="order-table">
      <Table
        rowKey={record => record.qnaId.toString()}
        dataSource={dataSource}
        columns={columns}
        expandIconAsCell={false}
        expandRowByClick
        expandedRowRender={record => <p>{record.contents}</p>}
      />
    </div>
  );
}

export default OrderTable;
