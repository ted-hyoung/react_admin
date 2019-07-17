// base
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Select, Button, Row, Col } from 'antd';

// enums
import { QnaOrderType, TOP_OPTIONS } from 'enums';

// store
import { updateQnaSequenceAsync } from 'store/reducer/qna';

// defines
const { Option } = Select;

interface Props {
  textOrderType: QnaOrderType;
  recordQnaId: number;
  recordSequence: number;
}

function QnaSequenceSelect(props: Props) {
  const { textOrderType, recordQnaId, recordSequence } = props;
  const [orderType, setOrderType] = useState(textOrderType);
  const [sequence, setSequence] = useState(recordSequence);
  const dispatch = useDispatch();

  const handleChangeOrderType = useCallback(value => {
    setOrderType(value);
  }, []);

  const handleChangeSequence = useCallback(value => {
    setSequence(value);
  }, []);

  const handleUpdateSequence = useCallback(() => {
    const data = {
      qnaId: recordQnaId,
      orderType,
      sequence: sequence !== 0 ? sequence : undefined,
    };

    dispatch(updateQnaSequenceAsync.request(data));
  }, [dispatch, orderType, sequence, recordQnaId]);

  useEffect(() => {
    setOrderType(textOrderType);
    setSequence(recordSequence);
  }, [recordSequence, textOrderType]);

  return (
    <div className="qna-type-select">
      <Row type="flex">
        <Col>
          <Select style={{ marginRight: 4 }} value={orderType} onChange={handleChangeOrderType}>
            <Option value="NONE">선택안함</Option>
            <Option value="TOP">상단고정</Option>
            <Option value="BOTTOM">하단고정</Option>
          </Select>
        </Col>
        <Col>
          {orderType === QnaOrderType[QnaOrderType.TOP] ? (
            <>
              <div>
                <Select value={sequence} onChange={handleChangeSequence}>
                  {TOP_OPTIONS.map(item => {
                    return (
                      <Option key={item.name} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>

                {sequence !== recordSequence && (
                  <Button style={{ marginLeft: 4 }} type="primary" onClick={handleUpdateSequence}>
                    확인
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {orderType !== textOrderType && (
                <Button type="primary" onClick={handleUpdateSequence}>
                  확인
                </Button>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default QnaSequenceSelect;
