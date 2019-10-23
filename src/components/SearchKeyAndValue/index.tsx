import React, { useCallback } from 'react';
import { Select, Input } from 'antd';

export interface SearchCondition {
  key: string;
  text: string;
}

export const initialValue = {
  key: 'null',
  value: '',
};

export function getValueFromEvent(originValue: SearchCondition, arg: SearchCondition) {
  return {
    ...originValue,
    ...arg,
  };
}

interface ReviewSearchKeyAndValuePropValue {
  key?: SearchCondition;
  value?: string;
}

interface ReviewSearchKeyAndValueProp {
  value?: ReviewSearchKeyAndValuePropValue;
  onSearch: () => void;
  onChange?: (value?: ReviewSearchKeyAndValuePropValue) => void;
  searchConditions: SearchCondition[];
}

const ReviewSearchKeyAndValue = React.forwardRef<HTMLDivElement, ReviewSearchKeyAndValueProp>((props, ref) => {
  const { value, onChange, searchConditions, onSearch } = props;

  const handleChange = useCallback(
    (val: ReviewSearchKeyAndValuePropValue) => {
      if (onChange) {
        onChange(val);
      }
    },
    [onChange],
  );

  const handleSelectChange = useCallback(
    selectValue => handleChange({ key: selectValue, value: value && value.value }),
    [handleChange, value],
  );

  const handleInputChange = useCallback(e => handleChange({ key: value && value.key, value: e.target.value }), [
    handleChange,
    value,
  ]);

  return (
    <div ref={ref} style={{ display: 'flex' }}>
      <Select style={{ width: 120, marginRight: 5 }} onChange={handleSelectChange} value={value && value.key}>
        <Select.Option value={'null'}>전체</Select.Option>
        {searchConditions.map((condition, idx) => (
          <Select.Option key={idx} value={condition.key}>
            {condition.text}
          </Select.Option>
        ))}
      </Select>
      <Input onChange={handleInputChange} value={value && value.value} onPressEnter={onSearch} />
    </div>
  );
});

export default ReviewSearchKeyAndValue;
