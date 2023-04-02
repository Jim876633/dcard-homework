import { UserType } from './UserType';
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
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  repository: RepoType;
  repository_url?: string;
  user: UserType;
}

/**
 * repository type
 */
export type RepoType = {
  id?: number;
  name: string;
  private?: boolean;
  open_issues_count?: number;
};
