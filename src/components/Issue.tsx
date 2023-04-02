import styled from "./Issue.module.scss";
import { Select, Card, Avatar, Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { GetIssueType } from "@src/models/IssueType";
import { useState } from "react";
import { MoreAction } from "./MoreAction";

interface props {
  issue: GetIssueType;
}

export const Issue = ({ issue }: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openMoreAction, setOpenMoreAction] = useState(false);
  const { Meta } = Card;

  const closeMoreAction = () => {
    setOpenMoreAction(false);
  };

  return (
    <Card style={{ width: 400, marginTop: 16 }} loading={isLoading}>
      <Meta
        avatar={<Avatar src={issue.user.avatar_url} alt={issue.user.login} />}
        title={issue.title}
        description={issue.body}
      />
      <Select
        className={styled.select}
        defaultValue="open"
        style={{ width: 100 }}
        options={[
          {
            value: "open",
            label: "Open",
          },
          {
            value: "progess",
            label: "In Progress",
          },
          {
            value: "done",
            label: "Done",
          },
        ]}
      />
      <Popover
        placement="bottom"
        content={<MoreAction issue={issue} closeMoreAction={closeMoreAction} />}
        trigger="click"
        open={openMoreAction}
      >
        <Button
          className={styled.more_btn}
          onClick={() => setOpenMoreAction(true)}
        >
          <MoreOutlined />
        </Button>
      </Popover>
    </Card>
  );
};
