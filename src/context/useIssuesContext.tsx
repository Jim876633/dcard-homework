import { GetIssueType, UpdateIssueType } from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';
import { githubApi } from '@src/services/github-api';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { useTokenContext } from './useTokenContext';
import { UpdateParamsType } from '@src/models/ParamsType';
import { LabelOptionEnum } from '@src/enums/labelEnum';

const IssuesContext = createContext<IssuesContextValue>(
  {} as IssuesContextValue
);

export const useIssuesContext = () => {
  return useContext(IssuesContext);
};

export const IssuesContextProvier = ({ children }: Props) => {
  const [issues, setIssues] = useState<GetIssueType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [tab, setTab] = useState<string>(LabelOptionEnum.ALL);
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

  const getUserRepos = async () => {
    if (accessToken && user) {
      const data = await githubApi.searchIssues(accessToken, '', {
        user: user.accountName,
      });
      return [...new Set(data.map(issue => issue.repository.name))];
    }
  };

  /**
   * search issues
   * @param query
   * @returns issues or undefined
   */
  const searchIssues = async (query: string) => {
    if (user && accessToken) {
      const issues = await githubApi.searchIssues(
        accessToken as string,
        query,
        { user: user.accountName }
      );
      setIssues(issues);
      return issues;
    }
  };

  /**
   *
   * @param issue
   * @param updateParams
   * @returns update issue or undefined
   */
  const updateIssue = async (
    issue: UpdateIssueType,
    updateParams: UpdateParamsType
  ) => {
    if (accessToken) {
      const update = await githubApi.updateIssue(
        accessToken,
        issue,
        updateParams
      );
      if (update.id) {
        getIssues();
      }
      return update;
    }
  };

  //TODO: select tab
  const selectTab = (tab: string) => {
    setTab(tab);
  };

  const tabIssues =
    tab === LabelOptionEnum.ALL
      ? issues
      : issues.filter(issue => {
          return issue.labels.some(label => label.name === tab);
        });

  const value = {
    user,
    getIssues,
    getMoreIssues,
    getUser,
    searchIssues,
    updateIssue,
    getUserRepos,
    selectTab,
    tabIssues,
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
  getIssues: (page?: number) => Promise<GetIssueType[] | undefined>;
  getMoreIssues: (page: number) => Promise<GetIssueType[] | undefined>;
  getUser: () => Promise<UserType | undefined>;
  searchIssues: (query: string) => Promise<GetIssueType[] | undefined>;
  updateIssue: (
    issue: UpdateIssueType,
    updateParams: UpdateParamsType
  ) => Promise<GetIssueType | undefined>;
  getUserRepos: () => Promise<string[] | undefined>;
  selectTab: (tab: string) => void;
  tabIssues: GetIssueType[];
  pageRef: React.MutableRefObject<number>;
  hasMoreRef: React.MutableRefObject<boolean>;
}
