import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTokenContext } from "@src/context/useTokenContext";
import { GetIssueType, UpdateIssueType } from "@src/models/IssueType";
import { githubApi } from "@src/services/github-api";
import { Button, Form, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditForm } from "./EditForm";
import styled from "./MoreAction.module.scss";

interface props {
  issue: GetIssueType;
  closeMoreAction: () => void;
}

export const MoreAction = ({ issue, closeMoreAction }: props) => {
  const navigate = useNavigate();
  const accessToken = useTokenContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [updateIssueLoading, setUpdateIssueLoading] = useState(true);
  const [editForm] = Form.useForm();

  const updateParams = {
    owner: issue.repository.owner.login,
    repo: issue.repository.name,
    issueNumber: issue.number,
  };

  /**
   * show edit modal
   */
  const editHandler = (): void => {
    closeMoreAction();
    setIsOpenModal(true);
    // navigate(`/issues/detail/${issue.id}`, { state: issue });
  };

  /**
   * delete issue
   */
  const deleteHandler = (): void => {
    if (accessToken) {
      const updateIssue = { state: "closed" };
      githubApi.updateIssue(accessToken, updateIssue, updateParams);
    }
  };

  /**
   * update edit issue
   */
  const updateEditIssue = async () => {
    const editIssue = editForm.getFieldsValue(["title", "body"]);
    setUpdateIssueLoading(true);
    const update = await githubApi.updateIssue(
      accessToken as string,
      editIssue,
      updateParams
    );
    console.log(update);
    setUpdateIssueLoading(false);
    setIsOpenModal(false);
  };

  const handleCancel = () => {
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
        onOk={updateEditIssue}
        confirmLoading={updateIssueLoading}
        onCancel={handleCancel}
        okText="Edit"
        cancelText="Cancel"
        centered
      >
        <EditForm issue={issue} editForm={editForm} />
      </Modal>
    </div>
  );
};
