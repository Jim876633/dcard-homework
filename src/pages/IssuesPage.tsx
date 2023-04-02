import { useTokenContext } from '@src/context/useTokenContext';
import { GetIssueType } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../components/Issue';

interface props {
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

export const IssuesPage = ({ setAccessToken }: props) => {
  const accessToken = useTokenContext();
  const [issues, setIssues] = useState<GetIssueType[]>();
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

  /**
   * get user issues
   * @param token
   */
  const getUserIssues = async (token: string) => {
    const data = await githubApi.getUserIssues(token);
    setIssues(data);
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
  }, []);

  useEffect(() => {
    if (accessToken) {
      getUserIssues(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      {issues?.map(issue => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};
