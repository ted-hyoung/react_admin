// base
import React, { useState, useEffect } from 'react';

// moduels
import { Form, Descriptions, Col, Input, Checkbox, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// components
import { FlexRow, SearchDateFormItem } from 'components';

// models, enums
import { SearchExperienceGroupConsumer } from 'models';
import { PrizeStatus } from 'enums/PrizeStatus';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';
import { DateRangeType, DateActionType } from 'enums';

// defines
const winningStatuses = [
  { label: PrizeStatus.WAIT, value: PrizeStatus[PrizeStatus.WAIT] },
  { label: PrizeStatus.COMPLETE, value: PrizeStatus[PrizeStatus.COMPLETE] },
];

const defaultCheckboxOptions = winningStatuses.map(status => status.value);

interface ExpConsumerSearchFormProps extends FormComponentProps {
  onSubmit?: (values: SearchExperienceGroupConsumer) => void;
  onResetAfter?: () => void;
}

function ExpConsumerSearchForm(props: ExpConsumerSearchFormProps) {
  const { form, onSubmit, onResetAfter } = props;
  const { setFieldsValue, getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const [checkboxOption, setCheckboxOption] = useState({
    checkedList: winningStatuses.map(status => status.value as CheckboxValueType),
    indeterminate: true,
    checkAll: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        if (onSubmit) {
          const data = {
            username: values.username,
            phone: values.phone,
            createdStarted: values.dates ? values.dates[0].format(LOCAL_DATE_TIME_FORMAT) : undefined,
            createdEnded: values.dates ? values.dates[1].format(LOCAL_DATE_TIME_FORMAT) : undefined,
            prizeStatuses: values.prizeStatuses,
          };

          onSubmit(data);
        }
      }
    });
  };

  const handleReset = () => {
    resetFields();

    if (onResetAfter) {
      onResetAfter();
    }
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
      prizeStatuses: checkboxOption.checkedList,
    });
  }, [checkboxOption]);

  return (
    <Form onSubmit={handleSubmit}>
      <Descriptions bordered title="참여 검색 조회" column={24}>
        <Descriptions.Item label="검색어" span={24}>
          <FlexRow>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>이름</span>
            </Col>
            <Col span={6}>{getFieldDecorator('username')(<Input />)}</Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>연락처</span>
            </Col>
            <Col span={6}>{getFieldDecorator('phone')(<Input />)}</Col>
          </FlexRow>
        </Descriptions.Item>
        <Descriptions.Item label="검색 기간" span={24}>
          {getFieldDecorator('dates')(
            <SearchDateFormItem
              initValue={true}
              optionDateLength={[
                DateActionType.TODAY,
                DateActionType.RECENT_THREE_DAYS,
                DateActionType.RECENT_WEEK,
                DateActionType.RECENT_MONTH,
                DateActionType.RECENT_THREE_MONTH,
                DateActionType.RECENT_SIX_MONTH
              ]}
          />)}
        </Descriptions.Item>
        <Descriptions.Item label="검색어" span={24}>
          <Checkbox
            indeterminate={checkboxOption.indeterminate}
            onChange={onCheckAllChange}
            checked={checkboxOption.checkAll}
          >
            전체
          </Checkbox>
          {getFieldDecorator('prizeStatuses', {
            initialValue: checkboxOption.checkedList,
          })(<Checkbox.Group options={winningStatuses} onChange={onChange} />)}
        </Descriptions.Item>
      </Descriptions>
      <FlexRow>
        <Col>
          <Button type="primary" htmlType="submit">
            검색
          </Button>
        </Col>
        <Col>
          <Button htmlType="button" onClick={handleReset}>
            초기화
          </Button>
        </Col>
      </FlexRow>
    </Form>
  );
}

export default Form.create<ExpConsumerSearchFormProps>()(ExpConsumerSearchForm);
