import { GetIssueType, RepoType } from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';

export const formatUser = (user: any): UserType | UserType[] => {
  if (user instanceof Array) {
    return user.map((user: any) => {
      return {
        id: user.id,
        name: user.name,
        accountName: user.login,
        avatarUrl: user.avatar_url,
      };
    });
  }
  return {
    id: user.id,
    name: user.name,
    accountName: user.login,
    avatarUrl: user.avatar_url,
  };
};

export const formatRepo = (repo: any): RepoType => {
  if (repo instanceof String) {
    return {
      name: repo.split('/').slice(-1).join(''),
    };
  }
  return {
    id: repo.id,
    name: repo.name,
    private: repo.private,
    open_issues_count: repo.open_issues_count,
  };
};

export const formatIssue = (issue: any): GetIssueType => {
  const formattAssignees: UserType[] = formatUser(
    issue.assignees
  ) as UserType[];
  const formattedUser: UserType = formatUser(issue.user) as UserType;
  const formattedRepo: RepoType = formatRepo(
    issue.repository || issue.repository_url
  );
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
    state: issue.state,
    user: formattedUser,
    assignees: formattAssignees,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    closed_at: issue.closed_at,
    repository: formattedRepo,
  };
};
