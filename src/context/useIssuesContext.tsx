import { GetIssueType } from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';
import { githubApi } from '@src/services/github-api';
import { createContext, ReactNode, useContext, useState } from 'react';

const IssuesContext = createContext<IssuesContextValue>({
  issues: [],
  user: { id: 0, name: '', accountName: '', avatarUrl: '' },
  getIssues: async () => {},
  getUser: async () => {},
  setIssues: () => {},
});

export const useIssuesContext = () => {
  return useContext(IssuesContext);
};

export const IssuesContextProvier = ({ children }: Props) => {
  const [issues, setIssues] = useState<GetIssueType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  const getUser = async (accessToken: string) => {
    const user = await githubApi.getUser(accessToken);
    setUser(user);
  };

  /**
   * get user issues
   * @param token
   */
  const getIssues = async (accessToken: string) => {
    const data = await githubApi.getUserIssues(accessToken);
    setIssues(data);
  };

  const value = {
    issues,
    user,
    getIssues,
    getUser,
    setIssues,
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
  getIssues: (taoken: string) => Promise<void>;
  getUser: (token: string) => Promise<void>;
  setIssues: React.Dispatch<React.SetStateAction<GetIssueType[]>>;
}
