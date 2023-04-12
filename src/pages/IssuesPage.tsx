import { SearchOutlined } from '@ant-design/icons';
import { CreateForm } from '@src/components/CreateForm';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { CreateIssueType } from '@src/models/IssueType';
import { ModalType } from '@src/models/ModalType';
import { githubApi } from '@src/services/github-api';
import { Button, Divider, Form, Input, List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../components/Issue';
import styled from './IssuesPage.module.scss';

export const IssuesPage = () => {
  const { accessToken } = useTokenContext();
  const { messageContext, showMessage } = useUIContext();
  const [createForm] = Form.useForm();
  const {
    getIssues,
    issues,
    user,
    setIssues,
    getMoreIssues,
    pageRef,
    hasMoreRef,
  } = useIssuesContext();
  const [isLoading, setIsLoading] = useState(false);
  const {
    openModal,
    closeModal,
    openModalConfirmLoading,
    closeModalConfirmLoading,
  } = useUIContext();

  const validRepos = [...new Set(issues.map(issue => issue.repository.name))];

  let fetchTimeID: any;

  /**
   * search issues handler
   */
  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    clearTimeout(fetchTimeID);
    fetchTimeID = setTimeout(() => {
      const fetchSearchIssue = async () => {
        const query = e.target.value;
        const searchParams = { user: user?.accountName as string };
        const searchIssues = await githubApi.searchIssues(
          accessToken as string,
          query,
          searchParams
        );
        setIssues(searchIssues);
        setIsLoading(false);
      };
      fetchSearchIssue();
    }, 300);
  };

  /**
   * load more issues
   */
  const loadMoreIssues = async () => {
    pageRef.current += 1;
    if (accessToken) {
      const moreIssues = await getMoreIssues(pageRef.current);
      if (moreIssues?.length === 0) hasMoreRef.current = false;
    }
  };

  /**
   * create an issue
   */
  const createIssue = async () => {
    try {
      const issue: CreateIssueType = await createForm.validateFields();
      openModalConfirmLoading();

      const createParams = {
        owner: user?.accountName as string,
        repo: issue.repo as string,
      };
      delete issue['repo'];
      const createIssue = await githubApi.createIssue(
        accessToken as string,
        issue,
        createParams
      );
      if (createIssue) {
        await getIssues();
        showMessage('success', 'Create an issue successfully');
        closeModalConfirmLoading();
        closeModal();
      }
    } catch {
      return;
    }
  };

  /**
   * show create modal
   */
  const createIssueHandler = () => {
    const modalData: ModalType = {
      isOpen: true,
      okText: 'Create',
      cancelText: 'Cancel',
      onOKHandler: createIssue,
      onCancelHandler: closeModal,
      content: <CreateForm createForm={createForm} repos={validRepos} />,
    };
    openModal(modalData);
  };

  return (
    <div className={styled.container}>
      <Input
        size="large"
        placeholder="Search issue title and content"
        prefix={<SearchOutlined />}
        onChange={onChangeHandler}
      />
      {messageContext}
      <div className={styled.issues} id="scrollableDiv">
        <InfiniteScroll
          dataLength={issues.length}
          next={loadMoreIssues}
          hasMore={hasMoreRef.current}
          loader={
            <Skeleton
              avatar={{ size: 'default' }}
              paragraph={{ rows: 2 }}
              title={false}
              style={{ padding: '1rem 1.5rem' }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            loading={isLoading}
            size="large"
            itemLayout="horizontal"
            dataSource={issues}
            renderItem={issue => <Issue key={issue.id} issue={issue} />}
          />
        </InfiniteScroll>
      </div>
      <Button onClick={createIssueHandler}>Creat issues</Button>
    </div>
  );
};
