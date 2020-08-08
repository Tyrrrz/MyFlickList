const apiUrl = new URL(process.env.REACT_APP_API_URL || 'http://localhost:5000');
const appUrl = new URL(process.env.PUBLIC_URL || 'http://localhost:3000');

const secrets = {
  googleAnalyticsToken: process.env.REACT_APP_GOOGLE_ANALYTICS
};

export default {
  apiUrl,
  appUrl,

  secrets,

  getRelativeApiUrl: (relativeUrl: string) => new URL(relativeUrl, apiUrl).toString(),
  getRelativeAppUrl: (relativeUrl: string) => new URL(relativeUrl, appUrl).toString()
};
