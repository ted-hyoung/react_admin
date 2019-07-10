// base
import React, { createContext, useState, useCallback } from 'react';

// modules

// components
import { Modal } from 'components';
import { ModalOptions } from 'types';

// type
interface CreateContext {
  openModal: (...args: any[]) => void;
}

/**
 * Throw error when ModalContext is used outside of context provider
 */
const invariantViolation = () => {
  throw new Error(
    'Attempted to call useModal outside of modal context. Make sure your app is rendered inside ModalProvider.',
  );
};

export const ModalContext = createContext<CreateContext>({
  openModal: invariantViolation,
});

function ModalProvider({ children }: { children: JSX.Element }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({
    type: 'info',
    content: '',
  });

  const openModal = (options: ModalOptions) => {
    setVisible(true);
    setOptions(options);
  };

  const onOk = useCallback(() => {
    if (options.onOk) {
      options.onOk();
    }
    setVisible(false);
  }, [options]);

  const onCancel = useCallback(() => {
    console.log('');
    if (options.onCancel) {
      options.onCancel();
    }
    setVisible(false);
  }, [options]);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <div>
        <Modal visible={visible} type={options.type} onOk={onOk} onCancel={onCancel} content={options.content} />
      </div>
    </ModalContext.Provider>
  );
}

export default ModalProvider;
