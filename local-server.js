import express from 'express';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());

const baseUrl = '/githubOauth';

/**
 * get user's access token
 */
app.get(`${baseUrl}/getAccessToken`, async function (req, res) {
  const response = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`,
    { method: 'POST', headers: { Accept: 'application/json' } }
  );
  const data = await response.json();
  res.json(data.access_token);
});

/**
 * get user information
 */
app.get(`${baseUrl}/getUser`, async (req, res) => {
  const response = await fetch(' https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: req.get('Authorization'),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  const data = await response.json();
  res.json(data);
});

/**
 * get user's issues
 */
app.get(`${baseUrl}/getUserIssues/:page`, async function (req, res) {
  const response = await fetch(
    `https://api.github.com/issues?state=open&filter=all&per_page=6&page=${req.params.page}`,
    {
      method: 'GET',
      headers: {
        Authorization: req.get('Authorization'),
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );
  const data = await response.json();
  res.json(data);
});

/**
 * update issue
 */
app.patch(
  `${baseUrl}/updateIssue/:owner/:repo/:issueNumber`,
  async function (req, res) {
    const response = await fetch(
      `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issueNumber}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: req.get('Authorization'),
          Accept: ' application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    res.json(data);
  }
);

/**
 * search issues
 */
app.get(`${baseUrl}/search`, async function (req, res) {
  const userParams = req.query.user ? `user:${req.query.user}` : '';
  const repoParams = req.query.repo
    ? `repo:${req.query.user}/${req.query.repo}`
    : '';
  const queryParams = req.query.query || '';
  const params = `${queryParams} ${userParams} ${repoParams}`;
  const endcodeUrl = encodeURIComponent(params);
  const response = await fetch(
    `https://api.github.com/search/issues?q=${endcodeUrl}`,
    {
      method: 'GET',
      headers: {
        Authorization: req.get('Authorization'),
        Accept: ' application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );
  const data = await response.json();
  res.json(data);
});

/**
 * create issue
 */
app.post(`${baseUrl}/create/:owner/:repo`, async function (req, res) {
  const response = await fetch(
    `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: req.get('Authorization'),
        Accept: ' application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(req.body),
    }
  );
  const data = response.json();
  res.json(data);
});

/**
 * set issue labels
 */
app.put(
  `${baseUrl}/setLabels/:owner/:repo/:issueNumber`,
  async function (req, res) {
    const response = await fetch(
      `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issueNumber}/labels`,
      {
        method: 'PUT',
        headers: {
          Authorization: req.get('Authorization'),
          Accept: ' application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify(req.body),
      }
    );
    const data = response.json();
    res.json(data);
  }
);

app.listen(3000);
