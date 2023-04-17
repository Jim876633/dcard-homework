import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from './LoginPage.module.scss';

const client_id = 'bfca6242ab51f259a7e6';

export const LoginPage = () => {
  const navigate = useNavigate();

  const connectGihub = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      navigate('/issues');
    } else {
      // connect to github with client_id

      window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo`
      );
    }
  };

  return (
    <div className={styled.container}>
      <Button size="large" icon={<GithubOutlined />} onClick={connectGihub}>
        Github login
      </Button>
    </div>
  );
};
