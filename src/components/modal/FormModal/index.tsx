import React from 'react';
import { Modal, Descriptions } from 'antd';
import { ModalOptions, DetailModalContent } from 'types';

interface Props extends ModalOptions {
  content: DetailModalContent[];
  visible: boolean;
}

function FormModal(props: Props) {
  const { content } = props;
  return (
    <Modal {...props} width={800}>
      {Array.isArray(content) &&
        content.map((item, i) => (
          <div key={'form-modal-' + i} style={{ paddingBottom: 20 }}>
            <Descriptions bordered title={item.title} size="small" column={2}>
              {item.items.map(item2 => (
                <Descriptions.Item key={item2.label} label={item2.label} span={item2.span}>
                  {item2.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        ))}
    </Modal>
  );
}

export default FormModal;
