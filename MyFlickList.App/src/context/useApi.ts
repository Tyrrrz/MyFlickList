import { useMemo } from 'react';
import * as generatedClient from '../internal/api.generated';
import config from '../internal/config';
import { trimEnd } from '../internal/utils';
import useAuth from './useAuth';

// NSwag's client treats the URL as string and expects it to not end with a slash
const apiUrl = trimEnd(config.apiUrl, '/');

// Custom fetch implementation
function createFetchProvider(authToken?: string) {
  return {
    fetch: (url: RequestInfo, init?: RequestInit) => {
      const headers = {
        ...init?.headers
      } as Record<string, string>;

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      return fetch(url, {
        ...init,
        headers
      });
    }
  };
}

export default function useApi() {
  const auth = useAuth();

  const client = useMemo(() => {
    const fetchProvider = createFetchProvider(auth.token?.value);

    return {
      auth: new generatedClient.AuthClient(apiUrl, fetchProvider),
      flicks: new generatedClient.FlicksClient(apiUrl, fetchProvider),
      search: new generatedClient.SearchClient(apiUrl, fetchProvider),
      profiles: new generatedClient.ProfilesClient(apiUrl, fetchProvider)
    };
  }, [auth.token?.value]);

  return client;
}
