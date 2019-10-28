// base
import React, { useState, useCallback } from 'react';

// modules
import { Modal, Input } from 'antd';

interface InstagramFormProps {
  visible: boolean;
  onOk: (value: string) => void;
  onCancel: () => void;
}

const InstagramForm = (props: InstagramFormProps) => {
  const { visible, onOk, onCancel } = props;

  const [value, setValue] = useState('');

  const handleOk = useCallback(() => {
    onCancel();
    onOk(value);
  }, [value, onCancel, onOk]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 URL" okText="확인" cancelText="취소">
      <Input onChange={handleChange} value={value} />
    </Modal>
  );
};

export default InstagramForm;
