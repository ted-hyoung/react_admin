// base
import React, { useState, useRef, useEffect } from 'react';

// modules
import { Form, Descriptions, Row, Col, Button, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

// components
import { FlexRow } from 'components';

// lib
import { getBytes } from 'lib/utils';

// types
import { ResponseEventNotice, UpdateEventNotices } from 'models';

import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { updateEventNoticesAsync } from 'store/reducer/event';
import { StoreState } from 'store';

// defines
const MAX_LENGTH = 10;

interface Props extends FormComponentProps {
  eventNotices?: ResponseEventNotice[];
}

function EventNotice(props: Props) {
  const { eventNotices = [], form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields, resetFields } = form;

  const prevProps = useRef<Props>(props);
  const [notices, setNotices] = useState(() => eventNotices);
  const eventId = useSelector((state: StoreState) => state.event.event.eventId);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFields({ first: true, force: true }, (error, values: UpdateEventNotices) => {
      if (!error) {
        if (!values.eventNotices[0].contents) {
          message.info('공지 사항을 입력해주세요.');
          return;
        }

        const eventNotices = notices.reduce((ac: ResponseEventNotice[], notice, index: number) => {
          if (values.eventNotices[index].contents) {
            return ac.concat(Object.assign(notice, values.eventNotices[index]));
          }

          return ac;
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
    if (getFieldValue('eventNotices').length === MAX_LENGTH) {
      return;
    }

    setNotices(
      notices.concat({
        contents: '',
        shippingScheduledEnable: false,
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
      <Col style={{ width: 85, textAlign: 'right' }}>
        {notices.length - 1 === index && <Button type="primary" icon="plus" onClick={handleAddNotice} />}
        {notices.length !== 1 && !notices[index].shippingScheduledEnable && (
          <Button
            style={{ marginLeft: 10 }}
            data-index={index}
            type="primary"
            icon="minus"
            onClick={handleRemoveNotice}
          />
        )}
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
              disabled={eventNotices[index] ? eventNotices[index].shippingScheduledEnable : false}
            />,
          )}
        </Form.Item>
      </Col>
      <Col>
        <span>{getBytes(getFieldValue(`eventNotices[${index}].contents`))}/30</span>
      </Col>
    </FlexRow>
  ));

  useEffect(() => {
    if (notices.length === 0) {
      setNotices([{ contents: '', shippingScheduledEnable: false }]);
    }

    if (prevProps.current.eventNotices !== props.eventNotices) {
      setNotices(eventNotices);
    }
  }, [props]);

  useEffect(() => {
    prevProps.current = props;
  }, [props]);

  return (
    <Form className="event-notice" onSubmit={handleSubmit} onKeyPress={handleEnterPress}>
      <Descriptions bordered title="공구 정보" column={24}>
        <Descriptions.Item
          label={
            <>
              <span>긴급공지</span>
              <br />
              <div style={{ paddingLeft: 10 }}>
                <span> - 한 공지사항 당 30자까지 입력 가능</span>
                <br />
                <span> - 긴급공지는 최대 10개까지 등록 가능</span>
              </div>
            </>
          }
          span={1}
        >
          {formItems}
        </Descriptions.Item>
      </Descriptions>
      <Row type="flex" justify="center" gutter={15} style={{ marginTop: 30 }}>
        <Col>
          <Button type="primary" htmlType="submit">
            등록
          </Button>
        </Col>
        <Col>
          <Button onClick={() => resetFields()}>취소</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create<Props>()(EventNotice);
