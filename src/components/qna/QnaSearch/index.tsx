// base
import React, { useState, useCallback } from 'react';

// modules
import { Row, Col, Select, Input, Button } from 'antd';

// enums
import { QnaStatus } from 'enums';
import { mapEnums } from 'lib/utils';

// defines
const { Option } = Select;

const qnaStatusList = mapEnums(QnaStatus);

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
        <Col>
          <Select style={{ width: 120 }} value={qnaStatus} onChange={handleChangeQnaStatus}>
            <Option value="">전체</Option>
            {qnaStatusList.map(option => (
              <Option key={option.value} value={option.value}>
                {option.key}
              </Option>
            ))}
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
