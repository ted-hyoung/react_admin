// base
import React, { useCallback } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button } from 'antd';
import moment from 'moment';

// components
import { SearchDateFormItem } from 'components';

// utils
import { defaultDateTimeFormat } from 'lib/utils';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const DailySalesSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSearch = useCallback(() => {
    validateFields((errors, values) => {
      if (!errors) {
        Object.keys(values).forEach(key => {
          if (values[key] === undefined) {
            delete values[key];
            return;
          }
          if (key === 'dates') {
            const dates = values[key];

            values.startDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
            values.endDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);

            delete values[key];
            return;
          }
        });
        values.startDate = moment(values.startDate).format(defaultDateTimeFormat);
        values.endDate = moment(values.endDate).format(defaultDateTimeFormat);

        onSearch(values);
      }
    });
  }, [onSearch]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
  }, [onReset]);

  return (
    <Form>
      <Form.Item>
        {getFieldDecorator('dates', {
          initialValue: [moment().startOf('day'), moment().endOf('day')],
        })(<SearchDateFormItem />)}
      </Form.Item>
      <Form.Item>
        <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
          검색
        </Button>
        <Button onClick={handleReset}>초기화</Button>
      </Form.Item>
    </Form>
  );
});

export default DailySalesSearchBar;
