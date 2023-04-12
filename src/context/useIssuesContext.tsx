import { GetIssueType } from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';
import { githubApi } from '@src/services/github-api';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { useTokenContext } from './useTokenContext';

const IssuesContext = createContext<IssuesContextValue>(
  {} as IssuesContextValue
);

export const useIssuesContext = () => {
  return useContext(IssuesContext);
};

export const IssuesContextProvier = ({ children }: Props) => {
  const [issues, setIssues] = useState<GetIssueType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const { accessToken } = useTokenContext();
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  /**
   * reset page ref and has more ref
   */
  const resetIssuesLoad = () => {
    pageRef.current = 1;
    hasMoreRef.current = true;
  };

  /**
   * get user data
   */
  const getUser = async () => {
    if (accessToken) {
      const user = await githubApi.getUser(accessToken);
      resetIssuesLoad();
      setUser(user);
      return user;
    }
  };

  /**
   * get user issues
   * @param page
   */
  const getIssues = async (page: number = 1) => {
    if (accessToken) {
      const data = await githubApi.getUserIssues(accessToken, page);
      resetIssuesLoad();
      setIssues(data);
      return data;
    }
  };

  /**
   * get more issues
   * @param page
   */
  const getMoreIssues = async (page: number) => {
    if (accessToken) {
      const data = await githubApi.getUserIssues(accessToken, page);
      setIssues(prev => [...prev, ...data]);
      return data;
    }
  };

  //TODO: create issue repolist
  const getUserRepos = async (user: string) => {
    if (accessToken) {
      const data = await githubApi.searchIssues(accessToken, '', { user });
      return data.map(issue => issue.repository_url);
    }
  };

  const value = {
    issues,
    user,
    getIssues,
    getMoreIssues,
    getUser,
    setIssues,
    pageRef,
    hasMoreRef,
  };
  return (
    <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
  );
};

/**
 * models
 */
interface Props {
  children: ReactNode;
}

interface IssuesContextValue {
  user: UserType | null;
  issues: GetIssueType[];
  getIssues: (page?: number) => Promise<GetIssueType[] | undefined>;
  getMoreIssues: (page: number) => Promise<GetIssueType[] | undefined>;
  getUser: () => Promise<UserType | undefined>;
  setIssues: React.Dispatch<React.SetStateAction<GetIssueType[]>>;
  pageRef: React.MutableRefObject<number>;
  hasMoreRef: React.MutableRefObject<boolean>;
}
