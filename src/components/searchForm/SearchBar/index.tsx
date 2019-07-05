import React, { useCallback } from 'react';

// modules
import { Button } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

// components
import { SearchKeyAndValue, SearchDate } from 'components';
import {
  getValuePropsForSearchDate,
  getValueFromEventForSearchDate,
  validateDate,
} from 'components/searchForm/SearchDate';

// types
import { SearchCondition } from '../SearchKeyAndValue';

// assets
import './index.less';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
  searchConditions?: SearchCondition[];
  customFormItems?: (form: WrappedFormUtils) => Array<React.ReactNode>;
}

const SearchBar = Form.create<Props>()((props: Props) => {
  const { searchConditions, form, onSearch, onReset, customFormItems } = props;
  const { getFieldDecorator, resetFields, validateFieldsAndScroll } = form;

  const handleSearch = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        Object.keys(val).forEach(key => {
          if (val[key] === undefined) {
            delete val[key];
            return;
          }
          if (key === 'searchCondition') {
            const searchCondition = val[key];
            if (searchCondition.value && searchCondition.key && searchCondition.key !== 'null') {
              val[searchCondition.key] = searchCondition.value;
            }
            delete val[key];
            return;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
        });
        onSearch(val);
      }
    });
  }, [onSearch]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
  }, [onReset]);

  return (
    <Form className="search-bar">
      {searchConditions && (
        <Form.Item>
          {getFieldDecorator('searchCondition', {
            initialValue: {
              key: 'null',
              value: '',
            },
          })(<SearchKeyAndValue searchConditions={searchConditions} onSearch={handleSearch} />)}
        </Form.Item>
      )}
      {customFormItems && customFormItems(form).map(item => item)}
      <Form.Item>
        {getFieldDecorator('date', {
          getValueFromEvent: getValueFromEventForSearchDate,
          getValueProps: getValuePropsForSearchDate,
        })(<SearchDate />)}
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

export default SearchBar;
