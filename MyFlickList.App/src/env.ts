const apiUrl = new URL(process.env.REACT_APP_API_URL || 'http://localhost:5000');
const appUrl = new URL(process.env.PUBLIC_URL || 'http://localhost:3000');

export default {
  apiUrl,
  appUrl,

  getRelativeApiUrl: (relativeUrl: string) => new URL(relativeUrl, apiUrl).toString()
};
