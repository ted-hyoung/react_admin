import { ModalOptions } from './../../types/Modal';
import { useContext } from 'react';
import { ModalContext } from 'lib/context/ModalProvider';

type OpenModal = (options: ModalOptions) => void;

function useModal() {
  const modal = useContext(ModalContext);

  const openModal: OpenModal = options => {
    modal.openModal(options);
  };

  return openModal;
}

export default useModal;
