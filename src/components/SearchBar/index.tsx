import React, { useCallback } from 'react';

// modules
import { Button } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

// components
import { SearchKeyAndValue, SearchDateFormItem } from 'components';

// types
import { SearchCondition } from '../SearchKeyAndValue';

// lib
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';

// assets
import './index.less';
import { DateActionType } from '../../enums';

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
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        Object.keys(values).forEach(key => {
          if (values[key] === undefined) {
            delete values[key];

            return;
          }

          if (key === 'searchCondition') {
            const searchCondition = values[key];
            if (searchCondition.value && searchCondition.key && searchCondition.key !== 'null') {
              values[searchCondition.key] = searchCondition.value;
            }
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

        onSearch(values);
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
      <Form.Item>{getFieldDecorator('dates')(
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
        />)}</Form.Item>
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
