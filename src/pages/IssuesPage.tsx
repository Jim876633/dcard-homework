import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { githubApi } from '@src/services/github-api';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../components/Issue';
import { Divider, Input, List, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from './IssuesPage.module.scss';

export const IssuesPage = () => {
  const { accessToken, setAccessToken } = useTokenContext();
  const { messageContext } = useUIContext();
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
      {/* <div className={styled.issues}>
        {issues?.map(issue => (
          <Issue key={issue.id} issue={issue} />
        ))}
      </div> */}
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
    </div>
  );
};

{
  /* <List
className="demo-loadmore-list"
loading={initLoading}
itemLayout="horizontal"
loadMore={loadMore}
dataSource={list}
renderItem={(item) => (
  <List.Item
    actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
  >
    <Skeleton avatar title={false} loading={item.loading} active>
      <List.Item.Meta
        avatar={<Avatar src={item.picture.large} />}
        title={<a href="https://ant.design">{item.name?.last}</a>}
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      />
      <div>content</div>
    </Skeleton>
  </List.Item>
)}
/>

<div
id="scrollableDiv"
style={{
  height: 400,
  overflow: 'auto',
  padding: '0 16px',
  border: '1px solid rgba(140, 140, 140, 0.35)',
}}
>
<InfiniteScroll
  dataLength={data.length}
  next={loadMoreData}
  hasMore={data.length < 50}
  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
  scrollableTarget="scrollableDiv"
>
  <List
    dataSource={data}
    renderItem={(item) => (
      <List.Item key={item.email}>
        <List.Item.Meta
          avatar={<Avatar src={item.picture.large} />}
          title={<a href="https://ant.design">{item.name.last}</a>}
          description={item.email}
        />
        <div>Content</div>
      </List.Item>
    )}
  />
</InfiniteScroll>
</div> */
}
