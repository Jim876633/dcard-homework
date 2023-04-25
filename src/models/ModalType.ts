import { ReactElement } from 'react';

export type ModalType = {
  isOpen: boolean;
  isConfirmLoading?: boolean;
  onOKHandler: () => void;
  onCancelHandler?: () => void;
  okText: string;
  cancelText?: string;
  content: ReactElement;
};
