import { ModalType } from '@src/models/ModalType';
import { NoticeType } from 'antd/es/message/interface';
import message from 'antd/lib/message/index';
import React, { ReactNode, createContext, useContext, useState } from 'react';

const uiContext = createContext<UIContextValue>({} as UIContextValue);

export const useUIContext = () => {
  return useContext(uiContext);
};

const defaultModalData = {
  isOpen: false,
  isConfirmLoading: false,
  onOKHandler: () => {},
  onCancelHandler: () => {},
  okText: '',
  cancelText: '',
  content: <div></div>,
};

export const UIContextProvier = ({ children }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalData, setModalData] = useState(defaultModalData as ModalType);

  /**
   * show message
   * @param type
   * @param content
   */
  const showMessage = (
    type: NoticeType = 'success',
    content = 'This is a success message'
  ) => {
    messageApi.open({
      type: type,
      content,
      duration: 1.2,
    });
  };

  const openModal = (modal: ModalType) => {
    setModalData(modal);
  };

  const closeModal = () => {
    setModalData(prev => {
      return { ...prev, isOpen: false };
    });
  };

  const openModalConfirmLoading = () => {
    setModalData(prev => {
      return { ...prev, isConfirmLoading: true };
    });
  };

  const closeModalConfirmLoading = () => {
    setModalData(prev => {
      return { ...prev, isConfirmLoading: false };
    });
  };

  const value = {
    messageContext: contextHolder,
    showMessage,
    openModal,
    closeModal,
    modalData,
    openModalConfirmLoading,
    closeModalConfirmLoading,
  };
  return <uiContext.Provider value={value}>{children}</uiContext.Provider>;
};

/**
 * models
 */
interface Props {
  children: ReactNode;
}

interface UIContextValue {
  messageContext: React.ReactElement;
  showMessage: (type: NoticeType, content: string) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  modalData: ModalType;
  openModalConfirmLoading: () => void;
  closeModalConfirmLoading: () => void;
}
