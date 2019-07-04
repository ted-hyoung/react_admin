import React, { useCallback } from 'react';

import { Form, Select, Input, DatePicker, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';

export interface SearchCondition {
  key: string;
  text: string;
}

interface SearchBarProps extends FormComponentProps {
  getData: (page: number, size?: number, searchCondition?: { [prop: string]: string }) => void;
  pageSize: number;
  searchConditions: SearchCondition[];
}

interface SearchBarKeyAndValuePropValue {
  key?: SearchCondition;
  value?: string;
}

interface SearchBoarKeyAndValueProp {
  value?: SearchBarKeyAndValuePropValue;
  onSearch: () => void;
  onChange?: (value?: SearchBarKeyAndValuePropValue) => void;
  searchConditions: SearchCondition[];
}

enum DateRange {
  ENTIRE = '전체',
  TODAY = '오늘',
  RECENT_3DAYS = '최근 3일',
  RECENT_WEEK = '최근 7일',
}

const SearchBarKeyAndValue = React.forwardRef<HTMLDivElement, SearchBoarKeyAndValueProp>((props, ref) => {
  const { value, onChange, searchConditions, onSearch } = props;

  const handleChange = useCallback(
    (val: SearchBarKeyAndValuePropValue) => {
      if (onChange) {
        onChange(val);
      }
    },
    [onChange],
  );

  const handleSelectChange = useCallback(selectValue => handleChange({ key: selectValue }), [handleChange]);

  const handleInputChange = useCallback(e => handleChange({ value: e.target.value }), [handleChange]);

  return (
    <div ref={ref} style={{ display: 'flex' }}>
      <Select style={{ width: 120, marginRight: 5 }} onChange={handleSelectChange} value={value && value.key}>
        <Select.Option value={'null'}>전체</Select.Option>
        {searchConditions.map(condition => (
          <Select.Option key={condition.key} value={condition.key}>
            {condition.text}
          </Select.Option>
        ))}
      </Select>
      <Input onChange={handleInputChange} value={value && value.value} onPressEnter={onSearch} />
    </div>
  );
});

function SearchBar(props: SearchBarProps) {
  const { form, getData, pageSize, searchConditions } = props;
  const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue, getFieldValue, resetFields } = form;

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
            val.startDate = val[key][0].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            val.endDate = val[key][1].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            delete val[key];
          }
        });
        getData(0, pageSize, { ...val });
      }
    });
  }, [validateFieldsAndScroll, pageSize, getData]);

  const handleReset = useCallback(() => {
    resetFields();
    getData(0, pageSize);
  }, [getData, resetFields, pageSize]);

  const setDate = useCallback(
    (value: string) => {
      let startDate;
      let endDate: Moment | undefined = moment();
      switch (value) {
        case DateRange.ENTIRE: {
          endDate = undefined;
          break;
        }
        case DateRange.TODAY: {
          startDate = moment();
          break;
        }
        case DateRange.RECENT_3DAYS: {
          startDate = moment().subtract(3, 'day');
          break;
        }
        case DateRange.RECENT_WEEK: {
          startDate = moment().subtract(1, 'week');
          break;
        }
      }
      setFieldsValue({
        date: [startDate, endDate],
      });
    },
    [setFieldsValue],
  );
  return (
    <div className="search">
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('searchCondition', {
            initialValue: {
              key: 'null',
              value: '',
            },
            getValueFromEvent: arg => {
              return {
                ...getFieldValue('searchCondition'),
                ...arg,
              };
            },
          })(<SearchBarKeyAndValue searchConditions={searchConditions} onSearch={handleSearch} />)}
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item>{getFieldDecorator('date')(<DatePicker.RangePicker />)}</Form.Item>
          {Object.keys(DateRange).map((key: any) => (
            <Button key={key} onClick={() => setDate(DateRange[key])} style={{ marginRight: 5 }}>
              {DateRange[key]}
            </Button>
          ))}
        </div>
        <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
          검색
        </Button>
        <Button onClick={handleReset}>초기화</Button>
      </Form>
    </div>
  );
}

export default Form.create<SearchBarProps>()(SearchBar);
