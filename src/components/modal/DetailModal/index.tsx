import React from 'react';
import { Modal, Descriptions } from 'antd';
import { ModalOptions, DetailModalContent } from 'types';

interface Props extends ModalOptions {
  content: DetailModalContent[];
  visible: boolean;
}

function DetailModal(props: Props) {
  const { content } = props;
  return (
    <Modal {...props} width={800}>
      {Array.isArray(content) &&
        content.map((contentGroup, i) => (
          <div key={'detail-description-' + i} style={{ paddingBottom: 20 }}>
            <Descriptions bordered title={contentGroup.title} size="small" column={2}>
              {contentGroup.items.map(item => (
                <Descriptions.Item key={item.label} label={item.label} span={item.span}>
                  {item.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        ))}
    </Modal>
  );
}

export default DetailModal;
