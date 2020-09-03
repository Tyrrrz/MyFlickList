import * as generated from './api.generated';
import config from './config';
import { trimEnd } from './utils';

// NSwag's client treats the URL as string and expects it to not end with a slash
const apiUrl = trimEnd(config.apiUrl, '/');

// Custom fetch implementation
const fetchProvider = {
  fetch: (url: RequestInfo, init?: RequestInit) => {
    return fetch(url, init);
  }
};

export default {
  auth: new generated.AuthClient(apiUrl, fetchProvider),
  flicks: new generated.FlicksClient(apiUrl, fetchProvider),
  search: new generated.SearchClient(apiUrl, fetchProvider),
  profiles: new generated.ProfilesClient(apiUrl, fetchProvider)
};
