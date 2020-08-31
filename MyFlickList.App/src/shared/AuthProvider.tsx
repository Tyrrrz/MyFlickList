import React, { createContext } from 'react';
import usePersistedState from './usePersistedState';

export interface Auth {
  token?: string | undefined;
  setToken: (token?: string | undefined) => void;
}

// Default value is only used when there is no context provider in the tree.
// We're going to use a dummy object in that case.
export const AuthContext = createContext<Auth>({
  setToken: () => {
    // Do nothing
  }
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = usePersistedState<string | undefined>('auth-token', undefined);

  const value = { token, setToken } as Auth;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
