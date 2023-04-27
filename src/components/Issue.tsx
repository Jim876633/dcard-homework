import { MoreOutlined } from '@ant-design/icons';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { LabelOptionEnum } from '@src/enums/labelEnum';
import { GetIssueType, LabelName } from '@src/models/IssueType';
import { Avatar, Button, List, Popover, Select } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from './Issue.module.scss';
import { MoreAction } from './MoreAction';

interface props {
  issue: GetIssueType;
}

const options = [
  {
    value: LabelOptionEnum.OPEN,
    label: LabelOptionEnum.OPEN,
  },
  {
    value: LabelOptionEnum.IN_PROGRESS,
    label: LabelOptionEnum.IN_PROGRESS,
  },
  {
    value: LabelOptionEnum.DONE,
    label: LabelOptionEnum.DONE,
  },
];

export const Issue = ({ issue }: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openMoreAction, setOpenMoreAction] = useState(false);
  const { updateIssueLabels } = useIssuesContext();

  const updateParams = {
    owner: issue.user.accountName,
    repo: issue.repository.name,
    issueNumber: issue.number,
  };

  const closeMoreAction = () => {
    setOpenMoreAction(false);
  };

  const selectChangeHandler = async (value: LabelName) => {
    await updateIssueLabels(value, updateParams);
  };

  return (
    <List.Item key={issue.id}>
      <List.Item.Meta
        avatar={
          <Avatar src={issue.user.avatarUrl} alt={issue.user.accountName} />
        }
        title={
          <Link to={`/issues/detail/${issue.id}`} state={{ id: issue.id }}>
            {issue.title}
          </Link>
        }
        description={issue.body}
      />
      <Select
        defaultValue={issue.labels[0]?.name}
        placeholder="Select label"
        style={{ width: 150, textAlign: 'left', marginRight: '1rem' }}
        onChange={selectChangeHandler}
        options={options}
      />
      <Popover
        placement="bottom"
        content={<MoreAction issue={issue} closeMoreAction={closeMoreAction} />}
        trigger="click"
        open={openMoreAction}
        onOpenChange={() => setOpenMoreAction(!openMoreAction)}
      >
        <Button
          className={styled.more_btn}
          onClick={() => setOpenMoreAction(!openMoreAction)}
        >
          <MoreOutlined />
        </Button>
      </Popover>
    </List.Item>
  );
};
