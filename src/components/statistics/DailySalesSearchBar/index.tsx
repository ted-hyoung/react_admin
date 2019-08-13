// base
import React, { useCallback } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button } from 'antd';
import moment from 'moment';

// components
import DailySalesSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/statistics/DailySalesSearchDate';

// utils
import { startDateFormat, endDateFormat, defaultDateTimeFormat } from 'lib/utils';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const DailySalesSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSearch = useCallback(() => {
    validateFields((err, val) => {
      if (!err) {
        Object.keys(val).forEach(key => {
          if (val[key] === undefined) {
            delete val[key];
            return;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
        });
        val.startDate = moment(val.startDate).format(defaultDateTimeFormat);
        val.endDate = moment(val.endDate).format(defaultDateTimeFormat);
        onSearch(val);
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
        {getFieldDecorator('date', {
          initialValue: [moment(new Date()).format(startDateFormat), moment(new Date()).format(endDateFormat)],
          getValueFromEvent: getValueFromEventForSearchDate,
          getValueProps: getValuePropsForSearchDate,
        })(<DailySalesSearchDate />)}
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
