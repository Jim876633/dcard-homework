import { useUIContext } from '@src/context/useUIContext';
import { Breadcrumb, Menu, Modal } from 'antd';
import Layout, { Content, Footer, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import styled from './Layout.module.scss';
import { labelData } from '@src/constants/labels';

export const LayoutElement = () => {
  const { modalData } = useUIContext();

  const navClickHandler = ({ key }: any) => {
    console.log(key);
  };

  return (
    <>
      <Layout className={styled.container}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            onClick={navClickHandler}
            items={labelData.map((label, i) => {
              return {
                key: i,
                label,
              };
            })}
          />
        </Header>
        <Content className={styled.content}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styled.content_inner}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Issue tracker ©2023 Created by Jim Huang
        </Footer>
      </Layout>
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
    </>
  );
};
