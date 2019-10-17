// base
import React, { useCallback, useState } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button } from 'antd';
import moment from 'moment';

// components

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

import BrandSalesMultiSearch from '../BrandSalesMultiSearch';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';
import { SearchDateFormItem } from 'components/formItem';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const BrandSalesSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue } = form;
  const [selectedBrand, setSelectedBrand] = useState<number[]>([]);

  const handleSearch = useCallback(() => {
    validateFields((errors, values) => {
      if (!errors) {
        Object.keys(values).map(key => {
          if (values[key] === undefined) {
            delete values[key];
            return false;
          }
          if (key === 'dates') {
            const dates = values[key];

            values.startDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
            values.endDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);

            delete values[key];
            return;
          }
        });
        values.startDate = moment(values.startDate).format(startDateFormat);
        values.endDate = moment(values.endDate).format(endDateFormat);
        onSearch(values);
      } else {
        console.error(errors);
      }
    });
  }, [onSearch, selectedBrand, validateFields]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
    setSelectedBrand([]);
  }, [onReset, resetFields, setSelectedBrand]);

  return (
    <>
      <Form>
        <Form.Item>
          {getFieldDecorator('dates', {
            initialValue: [moment().startOf('day'), moment().endOf('day')],
          })(<SearchDateFormItem />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('brandIds', {
            rules: [
              {
                required: true,
                message: '브랜드를 선택해 주세요',
              },
            ],
          })(<BrandSalesMultiSearch setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} />)}
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
