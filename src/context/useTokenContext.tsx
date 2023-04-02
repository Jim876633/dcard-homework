import { createContext, useContext } from "react";

export const AccessTokenContext = createContext<string | null>(null);

export const useTokenContext = () => {
  return useContext(AccessTokenContext);
};
