import _ from 'lodash';
import * as generated from './api.generated';
import config from './config';

// NSwag's client is handling the url as a string, so we need to sanitize
const apiUrl = _.trimEnd(config.apiUrl.toString(), '/');

export default {
  catalog: new generated.CatalogClient(apiUrl),
  utils: {
    getImageUrl: (imageId: string) => config.getRelativeApiUrl('catalog/images/' + imageId)
  }
};
