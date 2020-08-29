import * as generated from './api.generated';
import config from './config';
import { getAbsoluteUrl, trimEnd } from './utils';

// NSwag's client treats the URL as string and expects it to not end with a slash
const apiUrl = trimEnd(config.apiUrl, '/');

// Custom fetch implementation
const fetchProvider = {
  fetch: (url: RequestInfo, init?: RequestInit) => {
    return fetch(url, init);
  }
};

export default {
  catalog: new generated.CatalogClient(apiUrl, fetchProvider),
  utils: {
    getImageUrl: (imageId: string) => getAbsoluteUrl(config.apiUrl, 'catalog/images/' + imageId)
  }
};
