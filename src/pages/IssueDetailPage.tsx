import { GetIssueType } from '@src/models/IssueType';
import { Descriptions } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import styled from './IssueDetailPage.module.scss';
import { formatDate } from '@src/utils/format-data';
import { useIssuesContext } from '@src/context/useIssuesContext';

export const IssueDetailPage = () => {
  const { tabIssues } = useIssuesContext();
  const location = useLocation();
  const locationState: { id: number } | null = location.state;
  const issueDetail = tabIssues.find(issue => issue.id === locationState?.id);

  if (!locationState?.id && !issueDetail) {
    return <Navigate to="/issues" />;
  }

  return (
    <div className={styled.container}>
      <Descriptions title="Issue Detail" bordered column={2}>
        <Descriptions.Item label="Issue owner">
          {issueDetail?.user.name}
        </Descriptions.Item>
        <Descriptions.Item label="Repository name">
          {issueDetail?.repository.name}
        </Descriptions.Item>
        <Descriptions.Item label="Title" span={2}>
          {issueDetail?.title}
        </Descriptions.Item>
        <Descriptions.Item label="Body" span={2}>
          {issueDetail?.body || 'No body context'}
        </Descriptions.Item>
        <Descriptions.Item label="Labels">
          {issueDetail?.labels.map(label => label.name).join('/') ||
            'Not set label'}
        </Descriptions.Item>
        <Descriptions.Item label="Assignees">
          {issueDetail?.assignees
            ?.map(assignee => assignee.accountName)
            .join('/') || 'No assignee'}
        </Descriptions.Item>
        <Descriptions.Item label="Create times">
          {formatDate(issueDetail?.created_at || '')}
        </Descriptions.Item>
        <Descriptions.Item label="Last Update time">
          {formatDate(issueDetail?.updated_at || '')}
        </Descriptions.Item>
        <Descriptions.Item label="Issue state" span={2}>
          {issueDetail?.state}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
