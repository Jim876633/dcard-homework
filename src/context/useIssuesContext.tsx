import { GetIssueType } from '@src/models/IssueType';
import { githubApi } from '@src/services/github-api';
import { createContext, ReactNode, useContext, useState } from 'react';

const IssuesContext = createContext<IssuesContextValue>({
  issues: [],
  getIssues: async () => {},
});

export const useIssuesContext = () => {
  return useContext(IssuesContext);
};

export const IssuesContextProvier = ({ children }: Props) => {
  const [issues, setIssues] = useState<GetIssueType[]>([]);

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
    getIssues,
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
  issues: GetIssueType[];
  getIssues: (accessToken: string) => Promise<void>;
}
