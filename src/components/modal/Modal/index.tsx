import React, { useEffect } from 'react';
import { Modal as AntModal } from 'antd';
import { Button } from 'antd/lib/radio';
import { ModalTypes, ModalOptions, DetailModalContent, GalleryModalContent } from 'types/Modal';
import { DetailModal, GalleryModal } from 'components';

interface Props extends ModalOptions {
  visible: boolean;
}

function Modal(props: Props) {
  const { content, type, visible, onOk, onCancel } = props;

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (visible) {
        event.preventDefault();
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  });

  switch (type) {
    case 'detail': {
      return (
        <DetailModal
          {...{
            ...props,
            content: content as DetailModalContent[],
          }}
          type="detail"
        />
      );
    }
    case 'gallery': {
      return (
        <GalleryModal
          {...{
            ...props,
            content: content as GalleryModalContent,
          }}
        />
      );
    }
    default: {
      return (
        <AntModal
          // width={460}
          className="modal"
          // style={{ borderRadius: 30 }}
          // bodyStyle={{
          //   display: 'flex',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          //   flexDirection: 'column',
          //   whiteSpace: 'normal',
          // }}
          centered
          closable={false}
          maskClosable={false}
          visible={visible}
          footer={<CustomFooter type={type} onOk={onOk} onCancel={onCancel} />}
        >
          {content}
        </AntModal>
      );
    }
  }
}

interface CustomFooterProps {
  type: ModalTypes;
  onOk?: () => void;
  onCancel?: () => void;
}

function CustomFooter(props: CustomFooterProps) {
  const { type, onOk, onCancel } = props;

  switch (type) {
    case 'info': {
      return (
        <div className="modal-footer">
          <Button className="animation--disabled" onClick={onCancel}>
            확인
          </Button>
        </div>
      );
    }

    case 'confirm': {
      return (
        <div className="modal-footer modal-footer--confirm" style={{ justifyContent: 'space-around' }}>
          <Button className="animation--disabled" onClick={onOk}>
            확인
          </Button>
          <Button className="animation--disabled" onClick={onCancel}>
            취소
          </Button>
        </div>
      );
    }

    default: {
      return <div />;
    }
  }
}

export default Modal;
