export interface SearchParamsType {
  user: string;
  repo?: string;
}

export interface CreateParamsType {
  owner: string;
  repo: string;
}
export interface UpdateParamsType extends CreateParamsType {
  issueNumber: number;
}
