import _ from 'lodash';
import * as generated from './api.generated';
import env from './env';

// NSwag's client is handling the url as a string, so we need to sanitize
const apiUrl = _.trimEnd(env.apiUrl.toString(), '/');

export default {
  catalog: new generated.CatalogClient(apiUrl),
  utils: {
    getImageUrl: (imageId: string) => env.getRelativeApiUrl('catalog/images/' + imageId)
  }
};
