import { MoreOutlined } from '@ant-design/icons';
import { useTokenContext } from '@src/context/useTokenContext';
import { LabelEnum } from '@src/enums/labelEnum';
import { GetIssueType, LabelName } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import { Avatar, Button, Card, List, Popover, Select } from 'antd';
import { useEffect, useState } from 'react';
import styled from './Issue.module.scss';
import { MoreAction } from './MoreAction';

interface props {
  issue: GetIssueType;
}

export const Issue = ({ issue }: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openMoreAction, setOpenMoreAction] = useState(false);
  const { accessToken } = useTokenContext();
  const { Meta } = Card;
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
        defaultValue={issue.labels[0]?.name || LabelEnum.OPEN}
        style={{ width: 150, textAlign: 'left', marginRight: '1rem' }}
        onChange={selectChangeHandler}
        options={[
          {
            value: LabelEnum.OPEN,
            label: LabelEnum.OPEN,
          },
          {
            value: LabelEnum.IN_PROGRESS,
            label: LabelEnum.IN_PROGRESS,
          },
          {
            value: LabelEnum.DONE,
            label: LabelEnum.DONE,
          },
        ]}
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
    // <Card style={{ width: '100%', marginTop: 16 }} loading={isLoading}>
    //   <Meta
    //     avatar={
    //       <Avatar src={issue.user.avatarUrl} alt={issue.user.accountName} />
    //     }
    //     title={issue.title}
    //     description={issue.body}
    //   />
    //   <Select
    //     className={styled.select}
    //     defaultValue={issue.labels[0]?.name || LabelEnum.OPEN}
    //     style={{ width: 150 }}
    //     onChange={selectChangeHandler}
    //     options={[
    //       {
    //         value: LabelEnum.OPEN,
    //         label: LabelEnum.OPEN,
    //       },
    //       {
    //         value: LabelEnum.IN_PROGRESS,
    //         label: LabelEnum.IN_PROGRESS,
    //       },
    //       {
    //         value: LabelEnum.DONE,
    //         label: LabelEnum.DONE,
    //       },
    //     ]}
    //   />
    //   <Popover
    //     placement="bottom"
    //     content={<MoreAction issue={issue} closeMoreAction={closeMoreAction} />}
    //     trigger="click"
    //     open={openMoreAction}
    //     onOpenChange={() => setOpenMoreAction(!openMoreAction)}
    //   >
    //     <Button
    //       className={styled.more_btn}
    //       onClick={() => setOpenMoreAction(!openMoreAction)}
    //     >
    //       <MoreOutlined />
    //     </Button>
    //   </Popover>
    // </Card>
  );
};
