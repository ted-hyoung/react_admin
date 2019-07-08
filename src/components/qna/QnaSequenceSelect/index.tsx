// base
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Select, Button, Row, Col } from 'antd';
import { QnaOrderType } from 'enums/QnaOrderType';

// store
import { updateQnaSequenceAsync } from 'store/reducer/qna';

// defines
const { Option } = Select;
const TOP_OPTIONS = [
  { name: '선택', value: 0 },
  { name: '1', value: 1 },
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '4', value: 4 },
  { name: '5', value: 5 },
  { name: '6', value: 6 },
  { name: '7', value: 7 },
  { name: '8', value: 8 },
  { name: '9', value: 9 },
  { name: '10', value: 10 },
];

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

  const handleUpdateSequence = useCallback(async () => {
    const data = {
      qnaId: recordQnaId,
      orderType,
      sequence: sequence !== 0 ? sequence : undefined,
    };

    await dispatch(updateQnaSequenceAsync.request(data));
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
