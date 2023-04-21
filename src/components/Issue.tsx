import { MoreOutlined } from '@ant-design/icons';
import { useTokenContext } from '@src/context/useTokenContext';
import { GetIssueType, LabelName } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import { Avatar, Button, Card, List, Popover, Select } from 'antd';
import { useState } from 'react';
import styled from './Issue.module.scss';
import { MoreAction } from './MoreAction';
import { useNavigate } from 'react-router-dom';
import { LabelOptionEnum } from '@src/enums/labelEnum';

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
  const { accessToken } = useTokenContext();
  const navigate = useNavigate();

  const updateParams = {
    owner: issue.user.accountName,
    repo: issue.repository.name,
    issueNumber: issue.number,
  };

  const closeMoreAction = () => {
    setOpenMoreAction(false);
  };

  const selectChangeHandler = async (value: LabelName) => {
    if (accessToken) {
      await githubApi.updateIssueLabels(
        accessToken,
        { labels: [value] },
        updateParams
      );
    }
  };

  const onClickHandler = () => {
    navigate(`/issues/detail/${issue.id}`, { state: issue });
  };
  //TODO: add it
  // useEffect(() => {
  //   if (issue.labels.length === 0) {
  //     const setLabelToOpen = async () => {
  //       if (accessToken) {
  //         await githubApi.updateIssueLabels(
  //           accessToken,
  //           { labels: ['open'] },
  //           updateParams
  //         );
  //       }
  //     };
  //     setLabelToOpen();
  //   }
  // }, []);

  return (
    <List.Item key={issue.id}>
      <List.Item.Meta
        avatar={
          <Avatar src={issue.user.avatarUrl} alt={issue.user.accountName} />
        }
        title={issue.title}
        description={issue.body}
      />
      <Select
        defaultValue={issue.labels[0]?.name || LabelOptionEnum.OPEN}
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
