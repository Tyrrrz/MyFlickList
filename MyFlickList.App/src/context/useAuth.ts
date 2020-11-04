import decodeJwt from 'jwt-decode';
import { useMemo } from 'react';
import useLocalStorageValue from './useLocalStorageValue';

class AuthToken {
  public readonly value: string;
  private readonly decoded: Record<string, string | number | boolean | undefined>;

  constructor(value: string) {
    this.value = value;
    this.decoded = decodeJwt(value);
  }

  static tryCreate(value?: string) {
    if (value) {
      return new AuthToken(value);
    }

    return undefined;
  }

  getExpiration() {
    const unixTime = Number(this.decoded['exp']);
    return new Date(unixTime * 1000);
  }

  isExpired() {
    const expiration = this.getExpiration();

    if (!expiration) {
      return true;
    }

    return new Date() < expiration;
  }

  getUserId() {
    return Number(this.decoded['sub']);
  }

  getUsername() {
    return this.decoded['preferred_username'] as string;
  }

  getEmail() {
    return this.decoded['email'] as string;
  }

  isEmailVerified() {
    return this.decoded['email_verified'] === 'True';
  }

  getProfileId() {
    return Number(this.decoded['mfl_profile_id']);
  }
}

interface UseAuth {
  token?: AuthToken;
  setToken: (value: string) => void;
  resetToken: () => void;
}

export default function useAuth() {
  const [tokenValue, setTokenValue] = useLocalStorageValue('auth-token');

  const auth = useMemo(
    (): UseAuth => ({
      token: AuthToken.tryCreate(tokenValue),
      setToken: setTokenValue,
      resetToken: () => setTokenValue(undefined)
    }),
    [tokenValue, setTokenValue]
  );

  return auth;
}
