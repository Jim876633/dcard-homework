import Modal from 'antd/es/modal/Modal';
import { Routers } from './components/Routes/Routers';
import { useUIContext } from './context/useUIContext';

function App() {
  const { modalData } = useUIContext();
  return (
    <>
      <Routers />
      <Modal
        open={modalData.isOpen}
        onOk={modalData.onOKHandler}
        confirmLoading={modalData.isConfirmLoading}
        onCancel={modalData.onCancelHandler}
        okText={modalData.okText}
        cancelText={modalData.cancelText}
        cancelButtonProps={{
          style: { display: !modalData.cancelText ? 'none' : '' },
        }}
        centered
      >
        {modalData.content}
      </Modal>
    </>
  );
}

export default App;
