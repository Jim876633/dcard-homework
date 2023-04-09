import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { GetIssueType, RepoType, UpdateIssueType } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import { Button, Form, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditForm } from './EditForm';
import styled from './MoreAction.module.scss';

interface props {
  issue: GetIssueType;
  closeMoreAction: () => void;
}

export const MoreAction = ({ issue, closeMoreAction }: props) => {
  const initialFormValues = [
    { name: 'title', value: issue.title },
    { name: 'body', value: issue.body },
  ];
  const navigate = useNavigate();
  const { accessToken } = useTokenContext();
  const { showMessage } = useUIContext();
  const { getIssues } = useIssuesContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [updateIssueLoading, setUpdateIssueLoading] = useState(false);
  const [editForm] = Form.useForm();
  const editModalRef = useRef(false);
  const fieldsRef = useRef(initialFormValues);

  const updateParams = {
    owner: issue.user.accountName,
    repo: issue.repository.name,
    issueNumber: issue.number,
  };

  /**
   * show edit modal
   */
  const editHandler = (): void => {
    editModalRef.current = true;
    closeMoreAction();
    setIsOpenModal(true);
    // navigate(`/issues/detail/${issue.id}`, { state: issue });
  };

  /**
   * show delete model
   */
  const deleteHandler = (): void => {
    editModalRef.current = false;
    closeMoreAction();
    setIsOpenModal(true);
  };

  /**
   * close the issue
   */
  const closeIssue = async () => {
    setUpdateIssueLoading(true);
    if (accessToken) {
      const updateIssue: UpdateIssueType = { state: 'closed' };
      const update = await githubApi.updateIssue(
        accessToken,
        updateIssue,
        updateParams
      );
      if (update) {
        await getIssues(accessToken as string);
        showMessage('success', 'Close issue successfully');
        setUpdateIssueLoading(false);
        setIsOpenModal(false);
      }
    }
  };

  /**
   * update edit issue
   */
  const updateEditIssue = async () => {
    try {
      const editIssue = await editForm.validateFields();
      fieldsRef.current = [editIssue];
      setUpdateIssueLoading(true);
      const updateIssue = await githubApi.updateIssue(
        accessToken as string,
        editIssue,
        updateParams
      );
      if (updateIssue) {
        await getIssues(accessToken as string);
        showMessage('success', 'Update issue successfully');
        setUpdateIssueLoading(false);
        setIsOpenModal(false);
      }
    } catch (err) {
      return;
    }
  };

  const onOKHandler = () => {
    if (editModalRef.current) {
      updateEditIssue();
    } else {
      closeIssue();
    }
  };

  const handleCancel = () => {
    fieldsRef.current = initialFormValues;
    editForm.resetFields();
    setIsOpenModal(false);
  };

  return (
    <div className={styled.container}>
      <Button type="link" onClick={editHandler}>
        <EditOutlined className={styled.icon} />
        Edit
      </Button>
      <Button type="link" danger onClick={deleteHandler}>
        <DeleteOutlined className={styled.icon} />
        Delete
      </Button>
      <Modal
        open={isOpenModal}
        onOk={onOKHandler}
        confirmLoading={updateIssueLoading}
        onCancel={handleCancel}
        okText={editModalRef.current ? 'Edit' : 'Yes'}
        cancelText={editModalRef.current ? 'Cancel' : 'No'}
        centered
      >
        {editModalRef.current ? (
          <EditForm
            fields={fieldsRef.current}
            issue={issue}
            editForm={editForm}
          />
        ) : (
          <div>Are you sure to close this issue?</div>
        )}
      </Modal>
    </div>
  );
};
