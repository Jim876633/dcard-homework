import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { GetIssueType, UpdateIssueType } from '@src/models/IssueType';
import { ModalType } from '@src/models/ModalType';
import { githubApi } from '@src/services/github-api';
import { Button, Form } from 'antd';
import { useRef } from 'react';
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
  const {
    showMessage,
    closeModal,
    openModal,
    openModalConfirmLoading,
    closeModalConfirmLoading,
  } = useUIContext();
  const { getIssues, updateIssue } = useIssuesContext();
  const [editForm] = Form.useForm();
  const fieldsRef = useRef(initialFormValues);

  const updateParams = {
    owner: issue.user.accountName,
    repo: issue.repository.name,
    issueNumber: issue.number,
  };

  /**
   * close the issue
   */
  const closeIssue = async () => {
    openModalConfirmLoading();
    const issue: UpdateIssueType = { state: 'closed' };
    const update = await updateIssue(issue, updateParams);
    if (update) {
      await getIssues();
      showMessage('success', 'Close issue successfully');
      closeModalConfirmLoading();
      closeModal();
    }
  };

  /**
   * update edit issue
   */
  const updateEditIssue = async () => {
    try {
      const editIssue = await editForm.validateFields();
      fieldsRef.current = [editIssue];
      openModalConfirmLoading();
      const issue = await updateIssue(editIssue, updateParams);
      if (issue) {
        await getIssues();
        showMessage('success', 'Update issue successfully');
        closeModalConfirmLoading();
        closeModal();
      }
    } catch (err) {
      return;
    }
  };

  /**
   * cancel handler
   */
  const cancelHandler = () => {
    fieldsRef.current = initialFormValues;
    editForm.resetFields();
    closeModal();
  };

  /**
   * show edit modal
   */
  const editIssueHandler = (): void => {
    closeMoreAction();
    const modalData: ModalType = {
      isOpen: true,
      okText: 'Edit',
      cancelText: 'Cancel',
      onOKHandler: updateEditIssue,
      onCancelHandler: cancelHandler,
      content: <EditForm fields={fieldsRef.current} editForm={editForm} />,
    };
    openModal(modalData);
  };

  /**
   * show delete model
   */
  const deleteIssueHandler = (): void => {
    closeMoreAction();
    const modalData: ModalType = {
      isOpen: true,
      okText: 'Yes',
      cancelText: 'No',
      onOKHandler: closeIssue,
      onCancelHandler: cancelHandler,
      content: <div>Are you sure to close this issue?</div>,
    };
    openModal(modalData);
  };

  return (
    <div className={styled.container}>
      <Button type="link" onClick={editIssueHandler}>
        <EditOutlined className={styled.icon} />
        Edit
      </Button>
      <Button type="link" danger onClick={deleteIssueHandler}>
        <DeleteOutlined className={styled.icon} />
        Delete
      </Button>
    </div>
  );
};
