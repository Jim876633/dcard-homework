import { GetIssueType, UpdateIssueType } from '@src/models/IssueType';

/**
 * get access token
 * @param code
 * @return access token
 */
const getAccessToken = async (code: string) => {
  const res = await fetch('/githubOauth/getAccessToken?code=' + code);
  const accessToken = await res.json();
  return accessToken;
};

/**
 * get user issues
 * @param token
 * @return issues
 */
const getUserIssues = async (token: string) => {
  const res = await fetch('/githubOauth/getUserIssues', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  const data = await res.json();
  const formatData: GetIssueType[] = data.map((issue: GetIssueType) => {
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      state: issue.state,
      user: issue.user,
      assignees: issue.assignees,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      closed_at: issue.closed_at,
      repository: issue.repository,
    };
  });
  return formatData;
};

/**
 * update issue
 * @param token
 * @param issue
 * @param UpdateParams
 * @returns After update issue
 */
const updateIssue = async (
  token: string,
  issue: UpdateIssueType,
  UpdateParams: UpdateParamsType
) => {
  const res = await fetch(
    `/githubOauth/updateIssue/${UpdateParams.owner}/${UpdateParams.repo}/${UpdateParams.issueNumber}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    }
  );
  const data = await res.json();
  return data;
};

/**
 *
 * @param token
 * @param query
 * @param searchParams
 * @returns search list
 */
const searchIssues = async (
  token: string,
  query: string,
  searchParams: SearchParamsType
): Promise<GetIssueType | undefined> => {
  const res = await fetch(
    `/githubOauth/search/${searchParams.user}/${searchParams.repo}/${query}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    }
  );
  const data = await res.json();
  if (data?.items) {
    const searchList = data.items.map((issue: GetIssueType) => {
      return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        state: issue.state,
        user: issue.user,
        assignees: issue.assignees,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        repository: issue.repository,
      };
    });
    return searchList;
  }
};

const createIssue = async (
  token: string,
  Issue: UpdateIssueType,
  createParams: CreateParamsType
) => {
  const res = await fetch(
    `/githubOauth/create/${createParams.owner}/${createParams.repo}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      body: JSON.stringify(Issue),
    }
  );
  const data = await res.json();
  return data;
};

export const githubApi = {
  getAccessToken,
  getUserIssues,
  updateIssue,
  searchIssues,
  createIssue,
};

interface SearchParamsType {
  user: string;
  repo: string;
}

interface CreateParamsType {
  owner: string;
  repo: string;
}
interface UpdateParamsType extends CreateParamsType {
  issueNumber: number;
}
