// base
import React from 'react';

// components
import { Row, Select, Col, Input, Button } from 'antd';

import './index.less';

const TempalteQna = () => {
  return (
    <div className="qna">
      <div className="link-text" style={{ padding: '50px 0 0 30px' }}>
        <span>셀럽에게 문의하기 {'>'}</span>
      </div>
      <div className="qna-search" style={{ padding: '51px 30px 39px' }}>
        <Row type="flex">
          <Col>
            <Select defaultValue="">
              <Select.Option value="">전체</Select.Option>
              <Select.Option value="WAIT">답변대기</Select.Option>
              <Select.Option value="COMPLETE">답변완료</Select.Option>
            </Select>
          </Col>
          <Col style={{ margin: '0 10px' }}>
            <Input placeholder="검색어 입력" name="searchName" />
          </Col>
          <Col>
            <Button>검색</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TempalteQna;
