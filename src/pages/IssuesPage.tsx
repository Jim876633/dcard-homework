import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { useUIContext } from '@src/context/useUIContext';
import { GetIssueType } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Issue } from '../components/Issue';

export const IssuesPage = () => {
  const { accessToken, setAccessToken } = useTokenContext();
  const { messageContext } = useUIContext();
  const { getIssues, issues } = useIssuesContext();
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
      getIssues(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      {messageContext}
      {issues?.map(issue => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};
