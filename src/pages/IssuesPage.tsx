import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { githubApi } from '@src/services/github-api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../components/Issue';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from './IssuesPage.module.scss';

export const IssuesPage = () => {
  const { accessToken, setAccessToken } = useTokenContext();
  const { messageContext } = useUIContext();
  const { getIssues, issues, getUser, user, setIssues } = useIssuesContext();
  const navigate = useNavigate();

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

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const searchParams = { user: user?.accountName as string };
    const searchIssues = await githubApi.searchIssues(
      accessToken as string,
      query,
      searchParams
    );
    setIssues(searchIssues);
  };

  useEffect(() => {
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
      getUser(accessToken);
      getIssues(accessToken);
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
      {issues?.map(issue => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};
