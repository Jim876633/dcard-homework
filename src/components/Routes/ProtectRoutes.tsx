import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectRoutes = () => {
  const [loading, setLoading] = useState(true);

  const { accessToken, setAccessToken, getAccessToken } = useTokenContext();

  const { getUser, getIssues, user } = useIssuesContext();

  useEffect(() => {
    setLoading(true);
    const localStorageToken = localStorage.getItem('access_token');
    if (localStorageToken) {
      setAccessToken(localStorageToken);
    } else {
      const query = window.location.search;
      const params = new URLSearchParams(query);
      const queryUrl = params.get('code');
      if (queryUrl) {
        getAccessToken(queryUrl);
      }
    }
    //TODO: test is accessToken get in asyn function
    console.log(accessToken);
    if (accessToken) {
      const fetchData = async () => {
        await getUser();
        await getIssues();
        setLoading(false);
      };
      fetchData();
    }
    //TODO: if accessToken first time is undefined can't use loading false it will return to homepage
    // setLoading(false)
  }, [accessToken]);

  if (loading) {
    return <Spin />;
  }
  if (user?.id) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};
