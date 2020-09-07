import * as generated from './api.generated';
import config from './config';
import { trimEnd } from './utils';

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

export default {
  auth: (authToken?: string) => new generated.AuthClient(apiUrl, createFetchProvider(authToken)),
  flicks: (authToken?: string) =>
    new generated.FlicksClient(apiUrl, createFetchProvider(authToken)),
  search: (authToken?: string) =>
    new generated.SearchClient(apiUrl, createFetchProvider(authToken)),
  profiles: (authToken?: string) =>
    new generated.ProfilesClient(apiUrl, createFetchProvider(authToken))
};
