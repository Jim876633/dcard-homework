import { useUIContext } from '@src/context/useUIContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from './Error.module.scss';

export const ErrorPage = () => {
  const { openModal, closeModal } = useUIContext();
  const navigate = useNavigate();
  const url = window.location.href;

  const goToHomePage = () => {
    closeModal();
    navigate('/issues');
  };

  useEffect(() => {
    openModal({
      isOpen: true,
      onOKHandler: goToHomePage,
      okText: 'Close',
      content: (
        <div>
          <h2>You are on the wrong page.</h2>
          <br />
          Url <span className={styled.pathName}>{url}</span> is not found
          <br />
          <br />
          <p>Close it and go back to the home page.</p>
        </div>
      ),
    });
  }, []);

  return <div></div>;
};
