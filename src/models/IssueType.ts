import { UserType } from './UserType';
export type UpdateIssueType = {
  title?: string;
  body?: string;
  labels?: LabelItem[];
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
  user: UserType;
  labels: GetLabelType[];
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

/**
 * get label type
 */
export type GetLabelType = {
  color: string;
  default: boolean;
  description: string;
  id: number;
  name: LabelName;
  node_id: string;
  url: string;
};

/**
 * update label type
 */
export type UpdateLabelsType = {
  labels: string[];
};

export type LabelName = 'open' | 'in progress' | 'done';

export type LabelItem = {
  name: string;
  color: string;
  description: string;
};

export type CreateIssueType = {
  title: string;
  body: string;
  repo?: string;
};
