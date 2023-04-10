import { useUIContext } from '@src/context/useUIContext';
import { Modal } from 'antd';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const { modalData } = useUIContext();
  return (
    <>
      <Modal
        open={modalData.isOpen}
        onOk={modalData.onOKHandler}
        confirmLoading={modalData.isConfirmLoading}
        onCancel={modalData.onCancelHandler}
        okText={modalData.okText}
        cancelText={modalData.cancelText}
        centered
      >
        {modalData.content}
      </Modal>
      <Outlet />
    </>
  );
};
