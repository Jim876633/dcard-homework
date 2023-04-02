import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

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
  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
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
}
interface props {
  children: ReactNode;
}

const AccessTokenContext = createContext<AccessTokenValueType>({
  accessToken: '',
  setAccessToken: () => {},
});
