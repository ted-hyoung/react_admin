import React from 'react';
import { Modal, Select } from 'antd';
import { LabeledValue, AbstractSelectProps } from 'antd/lib/select';

// defines
const { Option } = Select;

export interface OptionProps {
  key: string;
  label: string;
}

interface Props extends AbstractSelectProps {
  visible: boolean;
  options: OptionProps[];
  onSelect?: (value: LabeledValue) => void;
}

function SelectOptionModal(props: Props) {
  const { visible, options, onSelect, ...rest } = props;

  const handleSelectOption = (value: LabeledValue) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <Modal visible={visible} closable={false} centered footer={null}>
      <Select
        {...rest}
        labelInValue
        style={{ width: '100%' }}
        onSelect={value => handleSelectOption(value as LabeledValue)}
      >
        {options.map(option => (
          <Option key={option.key} value={option.key}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Modal>
  );
}

export default SelectOptionModal;
