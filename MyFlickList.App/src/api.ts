import env from './env';

export default {
  getCatalog: async () => {
    const url = new URL('catalog', env.apiUrl.toString());
    const response = await fetch(url.toString());

    return await response.json();
  }
};
