import { useIssuesContext } from '@src/context/useIssuesContext';
import { useTokenContext } from '@src/context/useTokenContext';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import styled from './ProtectRoutes.module.scss';

export const ProtectRoutes = () => {
  const navigate = useNavigate();
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
        navigate('/issues');
      } else {
        setLoading(false);
      }
    }
    const fetchData = async () => {
      const user = await getUser();
      if (user) {
        getIssues();
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  if (loading) {
    return (
      <div className={styled.spin_block}>
        <Spin size="large" />
      </div>
    );
  }
  if (user?.id) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};
