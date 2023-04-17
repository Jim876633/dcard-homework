import { githubApi } from '@src/services/github-api';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const AccessTokenContext = createContext<AccessTokenValueType>(
  {} as AccessTokenValueType
);

/**
 * useContext
 */
export const useTokenContext = () => {
  return useContext(AccessTokenContext);
};

/**
 * token context provider
 */
export const AccessTokenContextProvider = ({ children }: props) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const navigate = useNavigate();

  /**
   * get acess token
   * @param code
   */
  const getAccessToken = async (code: string) => {
    const accessToken = await githubApi.getAccessToken(code);
    localStorage.setItem('access_token', accessToken);
    setAccessToken(accessToken);
    return accessToken;
  };

  return (
    <AccessTokenContext.Provider
      value={{ accessToken, setAccessToken, getAccessToken }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};

/**
 * models
 */
interface AccessTokenValueType {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  getAccessToken: (code: string) => Promise<string>;
}
interface props {
  children: ReactNode;
}
