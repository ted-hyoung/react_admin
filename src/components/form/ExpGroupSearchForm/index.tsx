// base
import React, { useState, useEffect } from 'react';

// moduels
import { Form, Descriptions, Col, Input, Checkbox, Button, Row, Icon, Table, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// components
import { FlexRow, SearchDateFormItem } from 'components';

// models, enums
import { SearchExperienceGroupForEvent } from 'models';
import { PrizeStatus } from 'enums/PrizeStatus';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';
import { TableRowSelection } from 'antd/lib/table';
import { ExperienceGroupStatus } from 'enums/ExperienceGroupStatus';

// defines
const expGroupStatuses = [
  {
    label: ExperienceGroupStatus.IN_PROGRESS,
    value: ExperienceGroupStatus[ExperienceGroupStatus.IN_PROGRESS],
  },
  { label: ExperienceGroupStatus.COMPLETE, value: ExperienceGroupStatus[ExperienceGroupStatus.COMPLETE] },
];

const defaultCheckboxOptions = expGroupStatuses.map(status => status.value);

interface ExpGroupSearchFormProps extends FormComponentProps {
  onSubmit?: (values: SearchExperienceGroupForEvent) => void;
}

function ExpGroupSearchForm(props: ExpGroupSearchFormProps) {
  const { form, onSubmit } = props;
  const { setFieldsValue, getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const [checkboxOption, setCheckboxOption] = useState({
    checkedList: expGroupStatuses.map(status => status.value as CheckboxValueType),
    indeterminate: true,
    checkAll: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        if (onSubmit) {
          const data = {
            ...values,
            recruitmentStarted: values.recruitmentStarted.startOf('day').format(LOCAL_DATE_TIME_FORMAT),
            recruitmentEnded: values.recruitmentEnded.endOf('day').format(LOCAL_DATE_TIME_FORMAT),
          };

          onSubmit(data);
        }
      }
    });
  };

  const handleReset = () => {
    resetFields();
  };

  const onChange = (checkedList: CheckboxValueType[]) => {
    setCheckboxOption({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < defaultCheckboxOptions.length,
      checkAll: checkedList.length === defaultCheckboxOptions.length,
    });
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const checkedList = checked ? defaultCheckboxOptions : [];

    setCheckboxOption({
      checkedList,
      indeterminate: false,
      checkAll: checked,
    });
  };

  useEffect(() => {
    setFieldsValue({
      expGroupStatuses: checkboxOption.checkedList,
    });
  }, [checkboxOption]);

  return (
    <Form onSubmit={handleSubmit}>
      <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
        <Col span={4} style={{ textAlign: 'center' }}>
          <span>체험단명</span>
        </Col>
        <Col>{getFieldDecorator('experienceGroupName')(<Input width={100} />)}</Col>
      </Row>
      <Row style={{ marginBottom: 15 }} type="flex" align="middle">
        <Col span={4} style={{ textAlign: 'center' }}>
          <span>체험단 기간</span>
        </Col>
        <Col span={2} style={{ textAlign: 'center' }}>
          <span>시작일</span>
        </Col>
        <Col>
          {getFieldDecorator('recruitmentStarted', {
            rules: [
              {
                required: true,
                message: '체험단 종료일을 선택해주세요.',
              },
            ],
          })(<DatePicker placeholder="체험단 시작일" />)}
        </Col>
        <Col span={2} style={{ textAlign: 'center' }}>
          <span> ~ 종료일</span>
        </Col>
        <Col>
          {getFieldDecorator('recruitmentEnded', {
            rules: [
              {
                required: true,
                message: '체험단 종료일을 선택해주세요.',
              },
            ],
          })(<DatePicker placeholder="체험단 종료일" />)}
        </Col>
      </Row>
      <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
        <Col span={4} style={{ textAlign: 'center' }}>
          <span>체험단 상태</span>
        </Col>
        <Col>
          <Checkbox
            indeterminate={checkboxOption.indeterminate}
            onChange={onCheckAllChange}
            checked={checkboxOption.checkAll}
          >
            전체
          </Checkbox>
          {getFieldDecorator('experienceGroupStatuses', {
            initialValue: checkboxOption.checkedList,
          })(<Checkbox.Group options={expGroupStatuses} onChange={onChange} />)}
        </Col>
      </Row>
      <Row style={{ margin: '20px 0' }} type="flex" justify="center" align="middle" gutter={10}>
        <Col>
          <Button type="primary" htmlType="submit">
            검색
          </Button>
        </Col>
        <Col>
          <Button onClick={handleReset}>초기화</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create<ExpGroupSearchFormProps>()(ExpGroupSearchForm);
