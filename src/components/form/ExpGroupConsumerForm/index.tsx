// base
import React, { useState } from 'react';

// modules
import moment from 'moment';
import { Form, Descriptions, Rate, Button, Row, Col, Popconfirm, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';

// components
import { ImageUpload } from 'components/common';

// models
import { UpdateFileObject } from 'models';

// lib
import { CLIENT_DATE_TIME_FORMAT } from 'lib/constants';

export interface ExpGroupConsumerFormValues {
  username: string;
  phone: string;
  created: string;
  starRate: number;
  contents: string;
  images: UpdateFileObject[];
}

interface ExpGroupConsumerFormProps extends FormComponentProps<ExpGroupConsumerFormValues> {
  username: string;
  phone: string;
  created: string;
  starRate: number;
  contents: string;
  images: UpdateFileObject[];
  onSubmit?: (values: ExpGroupConsumerFormValues) => void;
}

function ExpGroupConsumerForm(props: ExpGroupConsumerFormProps) {
  const { form, username, phone, created, starRate, contents, images, onSubmit } = props;

  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const [isUpdate, setIsUpdate] = useState(false);

  const handleConfirm = () => {
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        if (onSubmit) {
          onSubmit(values);
        }
      }
    });

    setIsUpdate(false);
  };

  const handleCancel = () => {
    setIsUpdate(false);
    resetFields();
  };

  return (
    <Form>
      <Descriptions bordered column={24}>
        <Descriptions.Item span={12} label="성명">
          <span>{username}</span>
        </Descriptions.Item>
        <Descriptions.Item span={12} label="연락처">
          <span>{phone}</span>
        </Descriptions.Item>
        <Descriptions.Item span={12} label="작성일">
          <span>{moment(created).format(CLIENT_DATE_TIME_FORMAT)}</span>
        </Descriptions.Item>
        <Descriptions.Item span={12} label="평점">
          {getFieldDecorator('starRate', {
            initialValue: starRate,
          })(<Rate disabled={!isUpdate} />)}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="내용">
          {getFieldDecorator('contents', {
            initialValue: contents,
          })(<TextArea disabled={!isUpdate} style={{ resize: 'none' }} rows={3} />)}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="첨부파일">
          {getFieldDecorator('images', {
            initialValue: images,
          })(<ImageUpload options={{ fileListLimit: 3, showRemoveIcon: isUpdate }} />)}
        </Descriptions.Item>
      </Descriptions>
      <Row style={{ marginTop: 30 }} type="flex" justify="center" gutter={10}>
        {isUpdate ? (
          <>
            <Col>
              <Popconfirm
                title="첨부파일의 경우 변경된 후에는 복구가 불가능 합니다. 변경 하시겠습니까?"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                onConfirm={handleConfirm}
                okText="확인"
                cancelText="취소"
              >
                <Button type="primary">변경</Button>
              </Popconfirm>
            </Col>
            <Col>
              <Button onClick={handleCancel}>취소</Button>
            </Col>
          </>
        ) : (
          <Col>
            <Button type="primary" onClick={() => setIsUpdate(true)}>
              수정
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
}

export default Form.create<ExpGroupConsumerFormProps>()(ExpGroupConsumerForm);
