import { GetIssueType } from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';
import { githubApi } from '@src/services/github-api';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';

const IssuesContext = createContext<IssuesContextValue>(
  {} as IssuesContextValue
);

export const useIssuesContext = () => {
  return useContext(IssuesContext);
};

export const IssuesContextProvier = ({ children }: Props) => {
  const [issues, setIssues] = useState<GetIssueType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
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
   * @param accessToken
   */
  const getUser = async (accessToken: string) => {
    const user = await githubApi.getUser(accessToken);
    resetIssuesLoad();
    setUser(user);
    return user;
  };

  /**
   * get user issues
   * @param token
   * @param page
   */
  const getIssues = async (accessToken: string, page: number = 1) => {
    const data = await githubApi.getUserIssues(accessToken, page);
    resetIssuesLoad();
    setIssues(data);
    return data;
  };

  /**
   * get more issues
   * @param accessToken
   * @param page
   */
  const getMoreIssues = async (accessToken: string, page: number) => {
    const data = await githubApi.getUserIssues(accessToken, page);
    setIssues(prev => [...prev, ...data]);
    return data;
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
  getIssues: (taoken: string, page?: number) => Promise<GetIssueType[]>;
  getMoreIssues: (taoken: string, page: number) => Promise<GetIssueType[]>;
  getUser: (token: string) => Promise<UserType>;
  setIssues: React.Dispatch<React.SetStateAction<GetIssueType[]>>;
  pageRef: React.MutableRefObject<number>;
  hasMoreRef: React.MutableRefObject<boolean>;
}
