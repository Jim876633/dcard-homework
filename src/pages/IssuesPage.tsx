import { SearchOutlined } from '@ant-design/icons';
import { CreateForm } from '@src/components/CreateForm';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { CreateIssueType } from '@src/models/IssueType';
import { ModalType } from '@src/models/ModalType';
import { githubApi } from '@src/services/github-api';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Skeleton,
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Issue } from '../components/Issue';
import styled from './IssuesPage.module.scss';
import { useNavigate } from 'react-router-dom';

export const IssuesPage = () => {
  const { accessToken } = useTokenContext();
  const { messageContext, showMessage } = useUIContext();
  const [createForm] = Form.useForm();
  const [isListEmpty, setIsListEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<string[]>([]);

  const {
    getIssues,
    tabIssues,
    user,
    searchIssues,
    getMoreIssues,
    getUserRepos,
    pageRef,
    hasMoreRef,
  } = useIssuesContext();
  const {
    openModal,
    closeModal,
    openModalConfirmLoading,
    closeModalConfirmLoading,
  } = useUIContext();

  let fetchTimeID: any;

  /**
   * search issues handler
   */
  //TODO: 優化搜尋
  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setIsListEmpty(false);
    clearTimeout(fetchTimeID);
    fetchTimeID = setTimeout(() => {
      const fetchSearchIssue = async () => {
        const query = e.target.value;
        const issues = await searchIssues(query);
        if (issues) {
          if (issues.length === 0) {
            setIsListEmpty(true);
          }
          setIsLoading(false);
        }
      };
      fetchSearchIssue();
    }, 500);
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
      content: <CreateForm createForm={createForm} repos={repos} />,
    };
    openModal(modalData);
  };

  /**
   * init setting
   */
  const initSetting = async () => {
    const userRepos = await getUserRepos();
    if (userRepos) {
      setRepos(userRepos);
    }
  };

  useEffect(() => {
    if (tabIssues.length > 0) {
      setIsLoading(false);
      initSetting();
    }
    const scrollableDiv = document.getElementById('scrollableDiv');
    if (
      hasMoreRef.current &&
      tabIssues.length !== 0 &&
      scrollableDiv &&
      scrollableDiv.scrollHeight <= scrollableDiv.clientHeight
    ) {
      console.log('hi');
      loadMoreIssues();
    }
    //TODO: move isEmpty to context
    if (tabIssues.length === 0) {
      setIsListEmpty(true);
    } else {
      setIsListEmpty(false);
    }
  }, [tabIssues]);

  return (
    <div className={styled.container}>
      <Input
        size="large"
        placeholder="Search issue title and content"
        prefix={<SearchOutlined />}
        onChange={onChangeHandler}
      />
      {messageContext}
      <Spin spinning={isLoading}>
        <div className={styled.issues} id="scrollableDiv">
          <InfiniteScroll
            dataLength={tabIssues.length}
            next={loadMoreIssues}
            hasMore={hasMoreRef.current || tabIssues.length === 0}
            loader={
              tabIssues.length !== 0 && (
                <Skeleton
                  avatar={{ size: 'default' }}
                  paragraph={{ rows: 2 }}
                  title={false}
                  style={{ padding: '1rem 1.5rem' }}
                  active
                />
              )
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              locale={{
                emptyText: isListEmpty ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <div></div>
                ),
              }}
              size="large"
              itemLayout="horizontal"
              dataSource={tabIssues}
              renderItem={issue => <Issue key={issue.id} issue={issue} />}
            />
          </InfiniteScroll>
        </div>
      </Spin>
      <Button onClick={createIssueHandler} disabled={isLoading}>
        Creat issues
      </Button>
    </div>
  );
};
