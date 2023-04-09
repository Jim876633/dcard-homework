import { SearchOutlined } from '@ant-design/icons';
import { CreateForm } from '@src/components/CreateForm';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { githubApi } from '@src/services/github-api';
import { Button, Divider, Form, Input, List, Modal, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../components/Issue';
import styled from './IssuesPage.module.scss';
import { CreateIssueType } from '@src/models/IssueType';

export const IssuesPage = () => {
  const { accessToken, setAccessToken } = useTokenContext();
  const { messageContext, showMessage } = useUIContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [createForm] = Form.useForm();
  const editModalRef = useRef<Boolean>(false);
  const {
    getIssues,
    issues,
    getUser,
    user,
    setIssues,
    getMoreIssues,
    pageRef,
    hasMoreRef,
  } = useIssuesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [updateIssueLoading, setUpdateIssueLoading] = useState(false);

  const validRepos = [...new Set(issues.map(issue => issue.repository.name))];

  const navigate = useNavigate();
  let fetchTimeID: any;

  /**
   * get acess token
   * @param code
   */
  const getAcessToken = async (code: string) => {
    const accessToken = await githubApi.getAccessToken(code);
    localStorage.setItem('access_token', accessToken);
    setAccessToken(accessToken);
    navigate('/issues');
  };

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
      const moreIssues = await getMoreIssues(accessToken, pageRef.current);
      if (moreIssues.length === 0) hasMoreRef.current = false;
    }
  };

  /**
   * create an issue
   */
  const createIssue = async () => {
    try {
      const issue: CreateIssueType = await createForm.validateFields();
      setUpdateIssueLoading(true);

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
        await getIssues(accessToken as string);
        showMessage('success', 'Create an issue successfully');
        setUpdateIssueLoading(false);
        setIsOpenModal(false);
      }
    } catch {
      return;
    }
  };

  const openModal = () => {
    setIsOpenModal(true);
  };

  const onOKHandler = () => {
    createIssue();
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const localStorageToken = localStorage.getItem('access_token');
    if (!localStorageToken) {
      const query = window.location.search;
      const params = new URLSearchParams(query);
      const queryUrl = params.get('code');
      if (queryUrl) {
        getAcessToken(queryUrl as string);
      }
    } else {
      setAccessToken(localStorageToken);
    }
    if (accessToken) {
      const fetchData = async () => {
        await getUser(accessToken);
        await getIssues(accessToken);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [accessToken]);

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
      <Modal
        open={isOpenModal}
        onOk={onOKHandler}
        confirmLoading={updateIssueLoading}
        onCancel={handleCancel}
        okText={'Create'}
        cancelText={'Cancel'}
        centered
      >
        <CreateForm createForm={createForm} repos={validRepos} />
      </Modal>
      <Button onClick={openModal}>Creat issues</Button>
    </div>
  );
};
