// base
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// modules
import { Form, Descriptions, Row, Col, Button, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

// components
import { FlexRow } from 'components';

// lib
import { calcStringByte } from 'lib/utils';

// types
import { ResponseEventNotice, UpdateEventNotices } from 'types';

import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { updateEventNoticesAsync } from 'store/reducer/event';
import { StoreState } from 'store';

// defines
const MAX_LENGTH = 5;

interface Props extends FormComponentProps {
  eventNotices?: ResponseEventNotice[];
}

function EventNotice(props: Props) {
  const { eventNotices = [], form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = form;

  const prevProps = useRef<Props>(props);
  const [notices, setNotices] = useState(() => eventNotices);
  const eventId = useSelector((state: StoreState) => state.event.event.eventId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (prevProps.current.eventNotices !== props.eventNotices) {
      setNotices(eventNotices);
    }
  }, [props]);

  useEffect(() => {
    prevProps.current = props;
  }, [props]);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFields({ first: true, force: true }, (error, values: UpdateEventNotices) => {
      if (!error) {
        const eventNotices = notices.reduce((ac: ResponseEventNotice[], notice, index: number) => {
          return ac.concat(Object.assign(notice, values.eventNotices[index]));
        }, []);

        const data: UpdateEventNotices = {
          eventNotices,
        };

        dispatch(updateEventNoticesAsync.request({ id: eventId, data }));
      }
    });
  };

  const handleChangeNotice = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFieldsValue({
      [name]: {
        contents: value,
      },
    });
  };

  const handleAddNotice = () => {
    setNotices(
      notices.concat({
        contents: '',
      }),
    );
  };

  const handleRemoveNotice = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const index = Number(e.currentTarget.dataset.index);

    setNotices(notices.filter((notice, i) => i !== index));

    setFieldsValue({
      eventNotices: getFieldValue('eventNotices').filter((eventNotice: ResponseEventNotice, i: number) => i !== index),
    });
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.which === 13) {
      e.preventDefault();
      handleAddNotice();
    }
  };

  const formItems = notices.map((eventNotice: ResponseEventNotice, index: number) => (
    <FlexRow key={index}>
      <Col>
        <Button data-index={index} type="primary" icon="minus" onClick={handleRemoveNotice} />
      </Col>
      <Col span={16}>
        <Form.Item>
          {getFieldDecorator(`eventNotices[${index}].contents`, {
            initialValue: eventNotice.contents,
            trigger: undefined,
          })(
            <Input
              name={`eventNotices[${index}]`}
              data-index={index}
              maxLength={30}
              placeholder="공지 내용"
              onChange={handleChangeNotice}
            />,
          )}
        </Form.Item>
      </Col>
      <Col>
        <span>{calcStringByte(getFieldValue(`eventNotices[${index}].contents`))}/30</span>
      </Col>
    </FlexRow>
  ));

  return (
    <Form className="event-notice" onSubmit={handleSubmit} onKeyPress={handleEnterPress}>
      <Descriptions bordered title="공구 정보" column={24}>
        <Descriptions.Item label="긴급공지">
          {formItems}
          {notices.length !== MAX_LENGTH && (
            <FlexRow>
              <Col>
                <Button type="primary" icon="plus" onClick={handleAddNotice} />
              </Col>
              <Col span={16}>
                <Form.Item>
                  {getFieldDecorator(`eventNotices[${notices.length > 0 ? notices.length : 0}].contents`, {
                    initialValue: '',
                    trigger: undefined,
                  })(
                    <Input
                      name={`eventNotices[${notices.length > 0 ? notices.length : 0}]`}
                      data-index={notices.length > 0 ? notices.length : 0}
                      maxLength={30}
                      placeholder="공지 내용"
                      onChange={handleChangeNotice}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col>
                <span>
                  {calcStringByte(getFieldValue(`eventNotices[${notices.length > 0 ? notices.length : 0}].contents`))}
                  /30
                </span>
              </Col>
            </FlexRow>
          )}
        </Descriptions.Item>
      </Descriptions>
      <Row type="flex" justify="center" gutter={15} style={{ marginTop: 30 }}>
        <Col>
          <Button type="primary" htmlType="submit">
            등록
          </Button>
        </Col>
        <Col>
          <Button>취소</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create<Props>()(EventNotice);
