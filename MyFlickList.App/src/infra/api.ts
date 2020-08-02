import * as generated from './api.generated';
import env from './env';

export default {
  catalog: new generated.CatalogClient(env.apiUrl.toString()),
  utils: {
    getImageUrl: (imageId: string) => env.getRelativeApiUrl('catalog/images' + imageId)
  }
};
