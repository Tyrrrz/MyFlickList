import decodeJwt from 'jwt-decode';
import usePersistedState from './usePersistedState';

export class AuthToken {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  private decode() {
    return decodeJwt(this.value) as Record<string, string | number | undefined>;
  }

  getUserId() {
    return this.decode()['nameid'] as string | undefined;
  }

  getUsername() {
    return this.decode()['unique_name'] as string | undefined;
  }

  getExpiration() {
    const unixTime = this.decode()['exp'] as number | undefined;
    return unixTime ? new Date(unixTime * 1000) : undefined;
  }

  isExpired() {
    const expiration = this.getExpiration();

    if (!expiration) {
      return true;
    }

    return new Date() < expiration;
  }
}

export interface AuthContext {
  token?: AuthToken | undefined;
  setTokenValue: (tokenValue?: string | undefined) => void;
}

export default function useAuth(): AuthContext {
  const [tokenValue, setTokenValue] = usePersistedState<string | undefined>(
    'auth-token',
    undefined
  );

  const token = tokenValue ? new AuthToken(tokenValue) : undefined;

  return {
    token,
    setTokenValue
  };
}
