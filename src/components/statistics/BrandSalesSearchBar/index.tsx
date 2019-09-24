// base
import React, { useCallback, useState } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button } from 'antd';
import moment from 'moment';

// components
import BrandSalesSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/statistics/BrandSalesSearchDate';

// utils
import { startDateFormat, endDateFormat, defaultDateTimeFormat } from 'lib/utils';

import { BrandSalesMultiSearch } from '../index';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const BrandSalesSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;
  const [ selectedBrand, setSelectedBrand ] = useState<number[]>([]);

  const handleSearch = useCallback(() => {
    validateFields((err, val) => {
      if (!err) {
        Object.keys(val).map(key => {
          if (val[key] === undefined) {
            delete val[key];
            return false;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
        });
        val.startDate = moment(val.startDate).format(defaultDateTimeFormat);
        val.endDate = moment(val.endDate).format(defaultDateTimeFormat);

        console.log('selectedDate', val);
        console.log('selectedBrand',selectedBrand);
        onSearch({startDate: "2019-09-24", endDate: "2019-09-24"});
       // onSearch(val);
      }
    });
  }, [onSearch, selectedBrand, validateFields]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
  }, [onReset,resetFields]);

  return (
    <>
      <Form>
        <Form.Item>
          {getFieldDecorator('date', {
            initialValue: [moment(new Date()).format(startDateFormat), moment(new Date()).format(endDateFormat)],
            getValueFromEvent: getValueFromEventForSearchDate,
            getValueProps: getValuePropsForSearchDate,
          })(<BrandSalesSearchDate/>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('brand', {
            rules: [
              {
                required :false,
                message: '브랜드를 선택해 주세요',
              }
            ]
          })(<BrandSalesMultiSearch setSelectedBrand={setSelectedBrand}/>)}
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
            검색
          </Button>
          <Button onClick={handleReset}>초기화</Button>
        </Form.Item>
      </Form>
    </>
  );
});

export default BrandSalesSearchBar;
