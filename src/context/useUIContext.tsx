import { message } from 'antd';
import React from 'react';
import { createContext, ReactNode, useContext } from 'react';
import { NoticeType } from 'antd/es/message/interface';

const uiContext = createContext<UIContextValue>({
  messageContext: <div />,
  showMessage: () => {},
});

export const useUIContext = () => {
  return useContext(uiContext);
};

export const UIContextProvier = ({ children }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

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
  const value = {
    messageContext: contextHolder,
    showMessage,
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
}
