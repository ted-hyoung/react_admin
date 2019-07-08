// base
import React, { useState, useCallback } from 'react';

// modules
import { Row, Col, Select, Input, Button } from 'antd';

// utils
import { QnaStatus } from 'enums';

// defines
const { Option } = Select;
const OPTIONS = [
  { name: '전체', value: '' },
  { name: '답변대기', value: QnaStatus[QnaStatus.WAIT] },
  { name: '답변완료', value: QnaStatus[QnaStatus.COMPLETE] },
];

interface Props {
  onOk: (qnaStatus: string, searchName: string) => void;
}

function QnaSearch(props: Props) {
  const { onOk } = props;
  const [qnaStatus, setQnaStatus] = useState('');
  const [searchName, setSearchName] = useState('');

  const handleChangeQnaStatus = useCallback(value => {
    setQnaStatus(value);
  }, []);

  const handleChangeSearchName = useCallback(e => {
    setSearchName(e.target.value);
  }, []);

  return (
    <div className="qna-search">
      <Row type="flex" gutter={8}>
        <Col span={2}>
          <Select style={{ width: '100%' }} value={qnaStatus} onChange={handleChangeQnaStatus}>
            {OPTIONS.map(option => {
              return (
                <Option key={option.name} value={option.value}>
                  {option.name}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col span={8}>
          <Input placeholder="상품명, 문의 내용을 검색하세요." value={searchName} onChange={handleChangeSearchName} />
        </Col>
        <Col span={2}>
          <Button type="primary" shape="circle" icon="search" onClick={() => onOk(qnaStatus, searchName)} />
        </Col>
      </Row>
    </div>
  );
}

export default QnaSearch;
