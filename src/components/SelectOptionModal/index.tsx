import React, { useState } from 'react';
import { Modal, Select } from 'antd';
import { SelectValue, LabeledValue } from 'antd/lib/select';

// defines
const { Option } = Select;

export interface OptionProps {
  key: string;
  label: string;
}

interface Props {
  visible: boolean;
  options?: OptionProps[];
  onSelect?: (value: string | number | LabeledValue) => void;
}

function SelectOptionModal(props: Props) {
  const { visible, options, onSelect } = props;

  const handleSelectOption = (value: string | number | LabeledValue) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <Modal visible={visible} closable={false} centered footer={null}>
      <Select labelInValue style={{ width: '100%' }} placeholder="브랜드 선택" onSelect={handleSelectOption}>
        <Option value="test1">테스트1</Option>
        <Option value="test2">테스트2</Option>
        <Option value="test3">테스트3</Option>
      </Select>
    </Modal>
  );
}

export default SelectOptionModal;
