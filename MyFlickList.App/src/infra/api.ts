import * as generated from './api.generated';
import config from './config';
import { trimEnd } from './utils';

// NSwag's client is handling the url as a string, so we need to sanitize
const apiUrl = trimEnd(config.apiUrl.toString(), '/');

const fetchProvider = {
  fetch: (url: RequestInfo, init?: RequestInit) => {
    return fetch(url, init);
  }
};

export default {
  catalog: new generated.CatalogClient(apiUrl, fetchProvider),
  utils: {
    getImageUrl: (imageId: string) => config.getRelativeApiUrl('catalog/images/' + imageId)
  }
};
