export type UpdateIssueType = {
  title?: string;
  body?: string;
  labels?: (string | undefined)[];
  state?: 'open' | 'closed';
  assignees?: UserType[];
};

export interface GetIssueType extends UpdateIssueType {
  id: number;
  number: number;
  user: UserType;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  repository: RepositoryType;
}

/**
 * user interface
 */
type UserType = {
  login: string;
  id: number;
  avatar_url: string;
};

/**
 * repository interface
 */
type RepositoryType = {
  id: number;
  name: string;
  private: boolean;
  owner: UserType;
  open_issues_count: number;
};
